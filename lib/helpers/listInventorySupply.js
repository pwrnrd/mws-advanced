const { forceArray } = require('../util/transformers');

/*
[ { Condition: 'NewItem',
    SupplyDetail: '',
    TotalSupplyQuantity: '0',
    FNSKU: 'B000WFVXGI',
    InStockSupplyQuantity: '0',
    ASIN: 'B000WFVXGI',
    SellerSKU: 'ND-X5EF-Z0N1' } ]
*/

const inputParser = (opt) => ({
    SellerSkus: opt.sellerSkus || opt.SellerSkus,
    QueryStartDateTime: opt.queryStartDateTime || opt.QueryStartDateTime,
    ResponseGroup: opt.responseGroup || opt.ResponseGroup,
    MarketplaceId: opt.marketplaceId || opt.MarketplaceId,
});

const outputParser = (out) => ({
    nextToken: out.NextToken,
    supplyList: out.InventorySupplyList ? forceArray(out.InventorySupplyList.member) : undefined, // TODO: Consider not returning undefined but an empty array instead.
});

const listInventorySupply = (api) => api.parseEndpoint(outputParser, inputParser)('ListInventorySupply');

module.exports = listInventorySupply;
