/* eslint-disable import/no-unresolved */
/* eslint-disable no-case-declarations */
const { GraphQLClient } = require('graphql-request');
const webpush = require('web-push');

const faunadbEndpoint = 'https://graphql.fauna.com/graphql';
const faunaKey = process.env.FAUNADB_KEY;
const graphQLClient = new GraphQLClient(faunadbEndpoint, {
  headers: {
    authorization: `Bearer ${faunaKey}`,
  },
});

const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
const vapidPublicKey =
  'MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAETtzJDtKpee4AMn2WsWXnIaJ5aUoQ15pSE1NapqQWEPBaRf6Oj_HG81BXC26e3t3mLzWCnBloeSGxCuw_kPuQZQ==';
webpush.setVapidDetails('mailto:witoldwrob@gmail.com', vapidPublicKey, vapidPrivateKey);

const isAuthenticated = (event) => {
  /**
   * @type {String[]}
   */
  const apiKeys = JSON.parse(process.env.ACCESS_KEYS);
  const { headers } = event;
  if ('x-api-key' in headers && apiKeys.includes(headers['x-api-key'])) return true;
  return false;
};

const getAllSubscriptions = async () => {
  const query = `query {
    allPushNotificationSubscriptions{
      data {
        subscriptionData
      }
    }
  }`;
  try {
    const data = await graphQLClient.request(query);
    const subscriptions = data.allPushNotificationSubscriptions.data;
    return subscriptions;
  } catch (error) {
    console.error('error getting subs ', error);
    return [];
  }
};

const sendPushMsg = async (subscription, message) => {
  try {
    console.log('sending for subscription ', subscription);
    const sendResult = await webpush.sendNotification(subscription, message);
    console.log('push sent, result', sendResult);
    return true;
  } catch (error) {
    console.error('Failed to send message to endpoint ', error);
    return false;
  }
};

exports.pushToSubscription = sendPushMsg;

exports.handler = async (event) => {
  const method = event.httpMethod;
  if (!isAuthenticated(event)) {
    return {
      statusCode: 401,
      body: `{"errors": "Invalid api key"}`,
    };
  }
  switch (method) {
    case 'POST':
      const subscriptions = await getAllSubscriptions();
      const promises = subscriptions.map(async (subscription) => {
        const subData = JSON.parse(subscription.subscriptionData);
        // eslint-disable-next-line no-return-await
        return await sendPushMsg(subData, event.body);
      });
      const result = await Promise.all(promises);
      const failed = result.filter((success) => !success).length;
      return {
        statusCode: 201,
        body: JSON.stringify({
          failed,
          success: result.length - failed,
        }),
      };
    default:
      return {
        statusCode: 400,
        body: `{"error": "Unsupportd method"}`,
      };
  }
};
