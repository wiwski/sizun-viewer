/* eslint-disable import/no-unresolved */
const { GraphQLClient } = require('graphql-request');
const { pushToSubscription } = require('./push-notification');

const faunadbEndpoint = 'https://graphql.fauna.com/graphql';
const faunaKey = process.env.FAUNADB_KEY;

const graphQLClient = new GraphQLClient(faunadbEndpoint, {
  headers: {
    authorization: `Bearer ${faunaKey}`,
  },
});

const addSubscription = async (endpoint, data) => {
  const query = `mutation addSubscription {
        createPushNotificationSubscription(data: {
          endpoint: "${endpoint}"
          subscriptionData: ${JSON.stringify(data)}
        }) {
          _id
        }
      }`;
  try {
    const res = await graphQLClient.request(query);
    // eslint-disable-next-line no-underscore-dangle
    const id = res.createPushNotificationSubscription._id;
    const welcomeMsg = JSON.stringify({
      title: 'Awesome!',
      message: 'Push Notifications are now enabled.',
    });
    const sent = await pushToSubscription(JSON.parse(data), welcomeMsg);
    return {
      statusCode: 201,
      body: JSON.stringify({
        id,
        sent,
      }),
    };
  } catch (error) {
    console.error('error adding subsription: ', error);
    return {
      statusCode: 500,
      body: `${error}`,
    };
  }
};

exports.handler = async function (event) {
  const method = event.httpMethod;
  switch (method) {
    case 'POST':
      try {
        const eventData = JSON.parse(event.body);
        const { endpoint, data } = eventData;
        const addResponse = await addSubscription(endpoint, data);
        console.log('New Subscription added for: ', endpoint);
        return addResponse;
      } catch (error) {
        console.error('Error saving subscription ', error);
        return {
          statusCode: 400,
          body: `{"error": "Unable to process"}`,
        };
      }
    default:
      return {
        statusCode: 400,
        body: `{"error": "Unsupported Method"}`,
      };
  }
};
