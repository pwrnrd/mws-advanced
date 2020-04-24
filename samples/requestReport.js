const mws = require('..');
const keys = require('../test/keys.json');

mws.init(keys);

/* eslint-disable dot-notation */

async function main() {
    try {
        // TODO: we need a function to download an existing report if it was created in the last X,
        // otherwise request a new one, because Amazon doesn't throttle all of the things.
        const results = await mws.requestReport({ ReportType: '_GET_MERCHANT_LISTINGS_DATA_', MarketplaceIdList: ['A2EUQ1WTGCTBG2'] });
        console.log('results', results);
        // console.warn('* done?', results);
    } catch (err) {
        console.warn('* err=', err);
    }
}

main();
