const inputParser = (params) => ({
    MarketplaceId: params.marketplaceId,
    'Destination.DeliveryChannel': 'SQS',
    'Destination.AttributeList.member.1.Key': 'sqsQueueUrl',
    'Destination.AttributeList.member.1.Value': params.SQSQueueURL,
});

const inputParserCreateSubscription = (params) => ({
    MarketplaceId: params.marketplaceId,
    'Subscription.NotificationType': params.notificationType,
    'Subscription.Destination.DeliveryChannel': 'SQS',
    'Subscription.Destination.AttributeList.member.1.Key': 'sqsQueueUrl',
    'Subscription.Destination.AttributeList.member.1.Value': params.SQSQueueURL,
    'Subscription.IsEnabled': true,
});
const inputParserDeleteSubscription = (params) => ({
    MarketplaceId: params.marketplaceId,
    'Destination.DeliveryChannel': 'SQS',
    'Destination.AttributeList.member.1.Key': 'sqsQueueUrl',
    'Destination.AttributeList.member.1.Value': params.SQSQueueURL,
    NotificationType: params.notificationType,
});

const outputParser = (out) => out;

const registerDestination = (api) => api.parseEndpoint(outputParser, inputParser)('RegisterDestination');
const deregisterDestination = (api) => api.parseEndpoint(outputParser, inputParser)('DeregisterDestination');
const createSubscription = (api) => api.parseEndpoint(outputParser, inputParserCreateSubscription)('CreateSubscription');
const deleteSubscription = (api) => api.parseEndpoint(outputParser, inputParserDeleteSubscription)('DeleteSubscription');

module.exports = {
    registerDestination,
    createSubscription,
    deleteSubscription,
    deregisterDestination,
};
