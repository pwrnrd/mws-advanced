const mws = require('..');
const keys = require('../test/keys.json');

mws.init(keys);

async function main() {
    try {
        const result = await mws.deregisterDestination({
            marketplaceId: 'A2EUQ1WTGCTBG2',
            SQSQueueURL: 'https://sqs.eu-west-1.amazonaws.com/465868727235/MWSReportSubscription', // 'https://sqs.eu-west-1.amazonaws.com/465868727235/amazonTest',

        });
        console.log(result, null, 4);
    } catch (err) {
        console.warn('* error', err);
    }
}

main();
