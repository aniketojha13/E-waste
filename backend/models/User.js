/**
 * User data-access layer for DynamoDB.
 *
 * Table schema (USERS_TABLE):
 *   PK  username (String)  — partition key
 *   GSI RoleIndex: role (pk) + createdAt (sk) — for listing by role
 */

const {
  GetCommand,
  PutCommand,
  QueryCommand,
  ScanCommand
} = require('@aws-sdk/lib-dynamodb');
const docClient = require('../config/dynamo');

const TABLE = () => process.env.USERS_TABLE || 'ewaste-users';

/** Fetch a user by their username (primary key). */
async function getByUsername(username) {
  const { Item } = await docClient.send(new GetCommand({
    TableName: TABLE(),
    Key: { username: username.toLowerCase() }
  }));
  return Item || null;
}

/** Fetch a user by their email address using the EmailIndex GSI. */
async function getByEmail(email) {
  const { Items } = await docClient.send(new QueryCommand({
    TableName: TABLE(),
    IndexName: 'EmailIndex',
    KeyConditionExpression: 'email = :e',
    ExpressionAttributeValues: { ':e': email.toLowerCase() }
  }));
  return Items && Items.length > 0 ? Items[0] : null;
}

/** Write (upsert) a user record. */
async function putUser(user) {
  await docClient.send(new PutCommand({
    TableName: TABLE(),
    Item: {
      ...user,
      username: user.username.toLowerCase(),
      email: user.email.toLowerCase(),
      createdAt: user.createdAt || new Date().toISOString()
    }
  }));
}

/** List all users that have a given role, newest first. */
async function listByRole(role) {
  const { Items } = await docClient.send(new QueryCommand({
    TableName: TABLE(),
    IndexName: 'RoleIndex',
    KeyConditionExpression: '#r = :role',
    ExpressionAttributeNames: { '#r': 'role' },
    ExpressionAttributeValues: { ':role': role },
    ScanIndexForward: false
  }));
  return Items || [];
}

/** Count users that have a given role via the RoleIndex GSI. */
async function countByRole(role) {
  const { Count } = await docClient.send(new QueryCommand({
    TableName: TABLE(),
    IndexName: 'RoleIndex',
    KeyConditionExpression: '#r = :role',
    ExpressionAttributeNames: { '#r': 'role' },
    ExpressionAttributeValues: { ':role': role },
    Select: 'COUNT'
  }));
  return Count || 0;
}

module.exports = { getByUsername, getByEmail, putUser, listByRole, countByRole };
