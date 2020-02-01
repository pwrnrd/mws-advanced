const { forceArray } = require('../util/transformers');

const getOrderOutParser = (out) => forceArray(out.Orders.Order);

const getOrder = (api) => api.parseEndpoint(getOrderOutParser)('GetOrder');

module.exports = getOrder;
