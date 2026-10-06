/**
 * Product data-access layer for DynamoDB.
 *
 * Table schema (PRODUCTS_TABLE):
 *   PK  pid (String)       — partition key (unique product ID)
 *   GSI UsernameIndex: username (pk) + createdAt (sk) — customer's own products
 *   GSI AllProductsIndex: entity (pk, constant="PRODUCT") + createdAt (sk) — scan all
 */

const {
  GetCommand,
  PutCommand,
  QueryCommand
} = require('@aws-sdk/lib-dynamodb');
const docClient = require('../config/dynamo');

const TABLE = () => process.env.PRODUCTS_TABLE || 'ewaste-products';

/** Fetch a single product by its PID. */
async function getByPid(pid) {
  const { Item } = await docClient.send(new GetCommand({
    TableName: TABLE(),
    Key: { pid }
  }));
  return Item || null;
}

/** Write (upsert) a product record. */
async function putProduct(product) {
  await docClient.send(new PutCommand({
    TableName: TABLE(),
    Item: {
      ...product,
      entity: 'PRODUCT',
      createdAt: product.createdAt || new Date().toISOString()
    }
  }));
}

/** List products submitted by a specific customer (UsernameIndex GSI). */
async function queryByUsername(username) {
  const { Items } = await docClient.send(new QueryCommand({
    TableName: TABLE(),
    IndexName: 'UsernameIndex',
    KeyConditionExpression: 'username = :u',
    ExpressionAttributeValues: { ':u': username.toLowerCase() },
    ScanIndexForward: false
  }));
  return Items || [];
}

/** List all products across all users (AllProductsIndex GSI). */
async function listAll() {
  const { Items } = await docClient.send(new QueryCommand({
    TableName: TABLE(),
    IndexName: 'AllProductsIndex',
    KeyConditionExpression: 'entity = :e',
    ExpressionAttributeValues: { ':e': 'PRODUCT' },
    ScanIndexForward: false
  }));
  return Items || [];
}

/** Count all products via the AllProductsIndex GSI. */
async function countAll() {
  const { Count } = await docClient.send(new QueryCommand({
    TableName: TABLE(),
    IndexName: 'AllProductsIndex',
    KeyConditionExpression: 'entity = :e',
    ExpressionAttributeValues: { ':e': 'PRODUCT' },
    Select: 'COUNT'
  }));
  return Count || 0;
}

module.exports = { getByPid, putProduct, queryByUsername, listAll, countAll };
