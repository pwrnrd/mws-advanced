/* eslint-disable max-classes-per-file */
// TODO: Product category at least has a hourly request quota that is
// not tracked anywhere currently.

// TODO: so, it turns out that the throttle headers don't come through on throttled requests
// only on the request that was last successful.
// So, we need to fix mws-simple to give headers (does it already do that?) for non-throttled
// requests, so that we can keep track of actual throttle in Queue.
// We need to do this because we can not guarantee that our Queue instance is the only
// thing in existence that is potentially affecting Quota (previous instances may have, or
// completely external accesses from other tools), so we need to make sure that our data is
// adjusted to compensate for what Amazon tells us regarding quota information.

class QueueItem {
    constructor({
        api,
        category,
        action,
        params,
        options,
        resolver,
        rejecter,
        onComplete,
        onFailure,
    }) {
        this.api = api;
        this.category = category;
        this.action = action;
        this.params = params;
        this.options = options;
        this.resolver = resolver;
        this.rejecter = rejecter;
        this.onComplete = onComplete;
        this.onFailure = onFailure;

        this.run = this.run.bind(this);
    }

    async run() {
        try {
            const res = await this.api.doRequest(this.params, this.options);
            this.resolver(res);
            this.onComplete();
        } catch (err) {
            // notify Queue that the request failed, so Queue can determine if it should reject
            // or retry.
            this.onFailure(err, this);
        }
    }
}

class Queue {
    constructor({
        api,
        category,
        action,
        maxInFlight,
        restoreRate,
    }, deleteQueueFromSchedule) {
        this.api = api;
        this.category = category;
        this.action = action;
        this.inFlight = 0;
        this.maxInFlight = maxInFlight || 20;
        this.restoreRate = restoreRate || 6;
        this.deleteQueueFromSchedule = deleteQueueFromSchedule;
        this.queue = [];
        this.queueTimer = null;
        // toggle this to false when we hit a throttle. As long as we don't hit a throttle we can drain the queue.
        // TODO: remove this when we can keep track of throttling from headers
        this.singleDrain = true;

        this.throttle = this.throttle.bind(this);
        this.setThrottleTimer = this.setThrottleTimer.bind(this);
        this.calcThrottleTimeout = this.calcThrottleTimeout.bind(this);
        this.onQueueTimer = this.onQueueTimer.bind(this);
        this.runItems = this.runItems.bind(this);
        this.complete = this.complete.bind(this);
        this.fail = this.fail.bind(this);
        this.request = this.request.bind(this);
        this.nThrottleErrorsReceived = 0;
        this.isStarted = false;
        this.isThrottled = false;
        this.startDate = new Date().getTime();
    }

    throttle() {
        this.setThrottleTimer();
    }

    setThrottleTimer() {
        // console.warn('* setThrottleTimer');
        if (this.queueTimer) { clearTimeout(this.queueTimer); }
        this.queueTimer = setTimeout(this.onQueueTimer, this.calcThrottleTimeout());
    }

    onQueueTimer() {
        this.inFlight -= 1;
        this.runItems();
    }

    calcThrottleTimeout() {
        // In case you're running multiple instances, you want to back-off requesting
        // Normally we should not encounter throttle errors. However, some APIs share
        // quotas and sometimes multiple instances of MWS run. Hence, quotas might be
        // blown. We need to be smart about implementing a back-off strategy. The
        // back-off strategy implemented is simple: multiply the time required for a restore
        // by the amount of throttle errors received.
        // This is not ideal, especially if you create new instances running short term jobs
        // while, simultaneously, you have another instance running a long term job.
        // For example, one instance is requesting API endpoint X 10.000 times all at once,
        // while you create short term instances every minute to send requests to API endpoint X 5 times.
        // At each point in time we might have only two instances (as short term instances are
        // created and destroyed) but every short term instance initiated might cause the long-term instance
        // to receive new throttle errors. Hence, we cap the numberOfInstances.
        const maxNumberOfInstances = 3;
        const multipleInstanceMultiplier = this.nThrottleErrorsReceived > maxNumberOfInstances
            ? maxNumberOfInstances
            : this.nThrottleErrorsReceived;
        return ((((60 / this.restoreRate) * 1000) * multipleInstanceMultiplier) + 250);
    }

    runItems() {
        if (this.queue.length === 0) {
            // console.warn('* ignoring drain request, queue empty');
            this.isStarted = false;
            this.deleteQueueFromSchedule();
            return undefined;
        }

        if (this.inFlight >= this.maxInFlight) { return this.throttle(); }

        // console.warn('* drainQueue length at start', this.queue.length, '- messages inflight', this.inFlight);
        const item = this.queue.shift();
        if (item) {
            // console.log('RUN: -In flight', this.inFlight, '- max in-flight', this.maxInFlight, '- queue length', this.queue.length, '- secs after start:', (new Date().getTime() - this.startDate) / 1000);
            // console.warn('* runQueue:', item.category, item.action, '- # queue length:', this.queue.length, '# throttled:', this.throttleCalls);
            this.inFlight += 1;
            item.run();
        }
        // console.warn('* drainQueue at end', this.queue.length, '- # inflight:', this.inFlight);
        return undefined;
    }


    complete() {
        return this.runItems();
    }

    fail(error, failedItem) {
        // console.warn('* Queue.fail', failedItem.category, failedItem.action, error);
        if (error instanceof this.api.mws.ServerError) {
            if (error.code === 503) {
                // console.warn('THROTTLE HIT: * retry -- throttle hit for', failedItem.category, failedItem.action, '- in flight:', this.inFlight);
                this.nThrottleErrorsReceived += 1;
                // apparently we hid the max in flight
                this.inFlight = this.inFlight > this.maxInFlight ? this.inFlight : this.maxInFlight;
                this.queue.unshift(failedItem);
                return this.runItems();
            }
        }
        // console.warn('* non-throttle failure', error);
        failedItem.rejecter(error);
        this.complete();
        return undefined;
    }

    request(params, options) {
        // console.warn('* request', this.category, this.action);
        return new Promise((resolve, reject) => {
            const action = new QueueItem({
                api: this.api,
                category: this.category,
                action: this.action,
                params,
                options,
                resolver: resolve,
                rejecter: reject,
                onComplete: this.complete,
                onFailure: this.fail,
            });
            this.queue.push(action);
            if (!this.isStarted) {
                this.isStarted = true;
                setImmediate(this.runItems);
            }
        });
    }
}

/**
 * Keeps track of all the queues.
 */
class QueueScheduler {
    constructor() {
        this.queueMap = new Map();
    }

    getQueue(queueName) {
        return this.queueMap.get(queueName);
    }

    registerQueue(newQueue, queueName) {
        return this.queueMap.set(queueName, newQueue);
    }

    deleteQueue(queueName) {
        return this.queueMap.delete(queueName);
    }
}

const QueueSchedule = new QueueScheduler();

module.exports = {
    Queue,
    QueueScheduler,
    QueueSchedule,
};
