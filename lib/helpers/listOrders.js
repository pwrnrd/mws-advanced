const { forceArray } = require('../util/transformers');

// TODO: if provide a NextToken then call ListOrdersByNextToken ?
// TODO: provide an option to automatically call ListOrdersByNextToken if NextToken is received?

const listOrdersOutParser = (out) => forceArray(out.Orders.Order);

const listOrders = (api) => api.parseEndpoint(listOrdersOutParser)('ListOrders');

module.exports = listOrders;
