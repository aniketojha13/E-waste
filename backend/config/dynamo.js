const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');

const clientConfig = {
  region: process.env.AWS_REGION || 'ap-south-1'
};

// When deployed on Vercel or external host, use provided IAM credentials
if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
  clientConfig.credentials = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    ...(process.env.AWS_SESSION_TOKEN ? { sessionToken: process.env.AWS_SESSION_TOKEN } : {})
  };
}

// When running under sam local
if (process.env.AWS_SAM_LOCAL) {
  clientConfig.endpoint = 'http://host.docker.internal:8000';
}

const client = new DynamoDBClient(clientConfig);

const docClient = DynamoDBDocumentClient.from(client, {
  marshallOptions: { removeUndefinedValues: true }
});

module.exports = docClient;
