
const generateEndpoints = require('./endpoints-utils');

const categoryName = 'Subscriptions';

const apiVersion = '2013-07-01';

const endpointList = [
    'RegisterDestination',
    'DeregisterDestination',
    'ListRegisteredDestinations',
    'SendTestNotificationToDestination',
    'CreateSubscription',
    'GetSubscription',
    'DeleteSubscription',
    'ListSubscriptions',
    'UpdateSubscription',
    'GetServiceStatus',
];

const newEndpointList = {
    RegisterDestination: {
        throttle: {
            maxInFlight: 25,
            restoreRate: 120,
        },
        params: {
            MarketplaceId: {
                type: 'xs:string',
                required: true,
            },
            'Destination.DeliveryChannel': {
                type: 'xs:string',
                required: true,
            },
            'Destination.AttributeList.member.1.Key': {
                type: 'xs:string',
                required: true,
            },
            'Destination.AttributeList.member.1.Value': {
                type: 'xs:string',
                required: true,
            },
        },
        returns: {},
    },
    DeregisterDestination: {
        throttle: {
            maxInFlight: 25,
            restoreRate: 120,
        },
        params: {
            MarketplaceId: {
                type: 'xs:string',
                required: true,
            },
            'Destination.DeliveryChannel': {
                type: 'xs:string',
                required: true,
            },
            'Destination.AttributeList.member.1.Key': {
                type: 'xs:string',
                required: true,
            },
            'Destination.AttributeList.member.1.Value': {
                type: 'xs:string',
                required: true,
            },
        },
        returns: {},
    },
    ListRegisteredDestinations: {
        throttle: {
            maxInFlight: 25,
            restoreRate: 120,
        },
        params: {
            MarketplaceId: {
                type: 'xs:string',
                required: true,
            },
        },
        returns: {
            DestinationList: {
                type: 'Destination',
                required: false,
            },
        },
    },
    SendTestNotificationToDestination: {
        throttle: {
            maxInFlight: 25,
            restoreRate: 120,
        },
        params: {
            MarketplaceId: {
                type: 'xs:string',
                required: true,
            },
            Destination: {
                type: 'Destination',
                required: true,
            },
        },
        returns: {},
    },
    CreateSubscription: {
        throttle: {
            maxInFlight: 25,
            restoreRate: 120,
        },
        params: {
            MarketplaceId: {
                type: 'xs:string',
                required: true,
            },
            'Subscription.Destination.DeliveryChannel': {
                type: 'xs:string',
                required: true,
            },
            'Subscription.Destination.AttributeList.member.1.Key': {
                type: 'xs:string',
                required: true,
            },
            'Subscription.Destination.AttributeList.member.1.Value': {
                type: 'xs:string',
                required: true,
            },
            'Subscription.IsEnabled': {
                type: 'xs:boolean',
                required: true,
            },
            'Subscription.NotificationType': {
                type: 'xs:string',
                required: true,
                values: ['AnyOfferChanged', 'FeedProcessingFinished', 'FBAOutboundShipmentStatus', 'FeePromotion',
                    'FulfillmentOrderStatus', 'ReportProcessingFinished'],
            },
        },
        returns: {},
    },
    GetSubscription: {
        throttle: {
            maxInFlight: 25,
            restoreRate: 120,
        },
        params: {
            MarketplaceId: {
                type: 'xs:string',
                required: true,
            },
            Destination: {
                type: 'Destination',
                required: true,
            },
            'Subscription.NotificationType': {
                type: 'xs:string',
                required: true,
                values: ['AnyOfferChanged', 'FeedProcessingFinished', 'FBAOutboundShipmentStatus', 'FeePromotion',
                    'FulfillmentOrderStatus', 'ReportProcessingFinished'],
            },
        },
        returns: {
            Subscription: {
                type: 'Subscription',
                required: false,
            },
        },
    },
    DeleteSubscription: {
        throttle: {
            maxInFlight: 25,
            restoreRate: 120,
        },
        params: {
            MarketplaceId: {
                type: 'xs:string',
                required: true,
            },
            'Destination.DeliveryChannel': {
                type: 'xs:string',
                required: true,
            },
            'Destination.AttributeList.member.1.Key': {
                type: 'xs:string',
                required: true,
            },
            'Destination.AttributeList.member.1.Value': {
                type: 'xs:string',
                required: true,
            },
            NotificationType: {
                type: 'xs:string',
                required: true,
                values: ['AnyOfferChanged', 'FeedProcessingFinished', 'FBAOutboundShipmentStatus', 'FeePromotion',
                    'FulfillmentOrderStatus', 'ReportProcessingFinished'],
            },
        },
        returns: {},
    },
    ListSubscriptions: {
        throttle: {
            maxInFlight: 25,
            restoreRate: 120,
        },
        params: {
            MarketplaceId: {
                type: 'xs:string',
                required: true,
            },
        },
        returns: {
            SubscriptionList: {
                type: 'SubscriptionList',
                required: false,
            },
        },
    },
    UpdateSubscription: {
        throttle: {
            maxInFlight: 25,
            restoreRate: 120,
        },
        params: {
            MarketplaceId: {
                type: 'xs:string',
                required: true,
            },
            Subscription: {
                type: 'Subscription',
                required: true,
            },
        },
        returns: {},
    },
    GetServiceStatus: {
        throttle: {
            maxInFlight: 25,
            restoreRate: 120,
        },
        params: {
        },
        returns: {
            Status: {
                type: 'xs:string',
                required: true, // TODO: mws docs don't specify which items are required here, assume status would be?
            },
            Timestamp: {
                type: 'xs:dateTime',
                required: true,
            },
            MessageId: {
                type: 'xs:string',
                required: false,
            },
            Messages: {
                type: 'Message',
                required: false,
            },
        },
    },
};


/**
 * @private
 */

const endpoints = generateEndpoints(
    categoryName,
    apiVersion,
    endpointList,
    newEndpointList,
);

module.exports = endpoints;
