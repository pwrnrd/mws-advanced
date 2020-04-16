const sleep = require('../util/sleep');
const { inputParser, outputParserListFinancialEvents, outputParserListFinancialEventsByNextToken } = require('../parsers/financialEvents');

// TODO: write some tests to more completely test this function's output


const listFinancialEvents = (api) => api.parseEndpoint(outputParserListFinancialEvents, inputParser)('ListFinancialEvents');

const listFinancialEventsByNextToken = (api) => api.parseEndpoint(outputParserListFinancialEventsByNextToken)('ListFinancialEventsByNextToken');

const listFinancialEventsAll = (api) => async (options = {}) => {
    let results = [];
    // ListFinancialEvents returns an object with a next-token. We want to have access to this
    // token. Hence, we use the listFinancialEventsByNextToken parser.
    const financialEvents = await api.parseEndpoint(outputParserListFinancialEventsByNextToken, inputParser)('ListFinancialEvents')(options);
    results = results.concat(financialEvents.result);
    let { nextToken } = financialEvents;
    /* eslint-disable no-await-in-loop */
    while (nextToken) {
        const nextPage = await listFinancialEventsByNextToken(api)({ NextToken: nextToken });
        // eslint-disable-next-line prefer-destructuring
        nextToken = nextPage.nextToken;
        results = results.concat(nextPage.result);
        await sleep(2000); // the refresh rate equals one request every two seconds
    }
    /* eslint-enable no-await-in-loop */
    return results;
};


module.exports = {
    listFinancialEvents,
    listFinancialEventsByNextToken,
    listFinancialEventsAll,
};
