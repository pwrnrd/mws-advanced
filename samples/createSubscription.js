const mws = require('..');
const keys = require('../test/keys.json');

mws.init(keys);

async function main() {
    try {
        const result = await mws.createSubscription({
            marketplaceId: 'ATVPDKIKX0DER',
            SQSQueueURL: 'https://sqs.eu-west-1.amazonaws.com/465868727235/amazonTest',
            notificationType: 'ReportProcessingFinished',
        });
        console.log(result, null, 4);
    } catch (err) {
        console.warn('* error', err);
    }
}

main();
