/**
 * Payment data-access layer for DynamoDB.
 *
 * Table schema (PAYMENTS_TABLE):
 *   PK  pid (String)       — partition key (matches Product pid)
 *   GSI UsernameIndex: username (pk) + createdAt (sk)
 *   GSI StatusIndex:   status  (pk) + createdAt (sk) — filter by payment status
 *   GSI AllPaymentsIndex: entity (pk, constant="PAYMENT") + createdAt (sk)
 */

const {
  GetCommand,
  PutCommand,
  UpdateCommand,
  QueryCommand
} = require('@aws-sdk/lib-dynamodb');
const docClient = require('../config/dynamo');

const TABLE = () => process.env.PAYMENTS_TABLE || 'ewaste-payments';

/** Fetch a payment record by its PID. */
async function getByPid(pid) {
  const { Item } = await docClient.send(new GetCommand({
    TableName: TABLE(),
    Key: { pid }
  }));
  return Item || null;
}

/** Write (upsert) a payment record. */
async function putPayment(payment) {
  await docClient.send(new PutCommand({
    TableName: TABLE(),
    Item: {
      ...payment,
      entity: 'PAYMENT',
      createdAt: payment.createdAt || new Date().toISOString()
    }
  }));
}

/** Update the status field of an existing payment. */
async function updateStatus(pid, status) {
  const { Attributes } = await docClient.send(new UpdateCommand({
    TableName: TABLE(),
    Key: { pid },
    UpdateExpression: 'SET #s = :s, updatedAt = :u',
    ExpressionAttributeNames: { '#s': 'status' },
    ExpressionAttributeValues: {
      ':s': status,
      ':u': new Date().toISOString()
    },
    ConditionExpression: 'attribute_exists(pid)',
    ReturnValues: 'ALL_NEW'
  }));
  return Attributes;
}

/** List all payments (AllPaymentsIndex GSI), newest first. */
async function listAll() {
  const { Items } = await docClient.send(new QueryCommand({
    TableName: TABLE(),
    IndexName: 'AllPaymentsIndex',
    KeyConditionExpression: 'entity = :e',
    ExpressionAttributeValues: { ':e': 'PAYMENT' },
    ScanIndexForward: false
  }));
  return Items || [];
}

/** Count payments that have a specific status (StatusIndex GSI). */
async function countByStatus(status) {
  const { Count } = await docClient.send(new QueryCommand({
    TableName: TABLE(),
    IndexName: 'StatusIndex',
    KeyConditionExpression: '#s = :s',
    ExpressionAttributeNames: { '#s': 'status' },
    ExpressionAttributeValues: { ':s': status },
    Select: 'COUNT'
  }));
  return Count || 0;
}

/** Batch-fetch payment records for a list of PIDs (one read each). */
async function getByPids(pids) {
  const results = await Promise.all(pids.map(pid => getByPid(pid)));
  return results.filter(Boolean);
}

module.exports = { getByPid, putPayment, updateStatus, listAll, countByStatus, getByPids };
