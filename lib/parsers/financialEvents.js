const { forceArray } = require('../util/transformers');

const listButWhereFieldNameDoesNotEndWithList = [
    'TaxesWithheld',
];


const forceArraysOnNestedObjects = (obj) => {
    const objWithForcedArrays = obj;
    const keys = Object.keys(obj);
    for (const key of keys) {
        if (typeof (obj[key]) === 'object') {
            objWithForcedArrays[key] = forceArraysOnNestedObjects(obj[key]);
        }
        if (!!key.match(/List$/) || listButWhereFieldNameDoesNotEndWithList.indexOf(key) !== -1) {
            // All nested elements in financial events of which the element key ends with
            // 'List', should be converted to an array.
            objWithForcedArrays[key] = forceArray(obj[key]);
        }
    }
    return objWithForcedArrays;
};

const inputParser = (opt) => ({
    MaxResultsPerPage: opt.maxResultsPerPage || opt.MaxResultsPerPage,
    AmazonOrderId: opt.amazonOrderId || opt.AmazonOrderId,
    FinancialEventGroupId: opt.financialEventGroupId || opt.FinancialEventGroupId,
    PostedAfter: opt.postedAfter || opt.PostedAfter,
    PostedBefore: opt.postedBefore || opt.PostedBefore,
});

const outputParserListFinancialEvents = (out) => forceArraysOnNestedObjects(out.FinancialEvents);

const outputParserListFinancialEventsByNextToken = (out) => ({
    // TODO: Need to parse the output for the different transaction types
    nextToken: out.NextToken,
    result: outputParserListFinancialEvents(out),
});


module.exports = {
    inputParser,
    outputParserListFinancialEvents,
    outputParserListFinancialEventsByNextToken,
};
