const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');
const localStore = require('./localStore');

const hasAwsCredentials = Boolean(
  (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) ||
  process.env.AWS_PROFILE ||
  process.env.AWS_CONTAINER_CREDENTIALS_RELATIVE_URI ||
  process.env.AWS_SAM_LOCAL
);

let docClient;

if (!hasAwsCredentials) {
  console.log('⚡ Local development mode: Using persistent local storage with pre-seeded admin & agent accounts');
  docClient = localStore;
} else {
  const clientConfig = {
    region: process.env.AWS_REGION || 'ap-south-1'
  };

  if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
    clientConfig.credentials = {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      ...(process.env.AWS_SESSION_TOKEN ? { sessionToken: process.env.AWS_SESSION_TOKEN } : {})
    };
  }

  if (process.env.AWS_SAM_LOCAL) {
    clientConfig.endpoint = 'http://host.docker.internal:8000';
  }

  const client = new DynamoDBClient(clientConfig);
  docClient = DynamoDBDocumentClient.from(client, {
    marshallOptions: { removeUndefinedValues: true }
  });
}

module.exports = docClient;
