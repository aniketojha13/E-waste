const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DATA_FILE = path.resolve(__dirname, '../data/local-db.json');

const INITIAL_USERS = [
  {
    name: 'System Admin',
    username: 'admin',
    email: 'admin@ewaste.com',
    password: bcrypt.hashSync('admin123', 10),
    role: 'admin',
    mobile: '9999999999',
    address: 'E-Waste Admin Central Headquarters',
    createdAt: new Date().toISOString()
  },
  {
    name: 'John Agent (Downtown Center)',
    username: 'agent1',
    email: 'agent1@ewaste.com',
    password: bcrypt.hashSync('agent123', 10),
    role: 'agent',
    mobile: '9876543210',
    address: 'Downtown E-Waste Hub, Sector 4, Main Market',
    createdAt: new Date().toISOString()
  },
  {
    name: 'Rajesh Sharma (North Hub)',
    username: 'agent2',
    email: 'agent2@ewaste.com',
    password: bcrypt.hashSync('agent123', 10),
    role: 'agent',
    mobile: '9811223344',
    address: 'North District Recycling Depot, Industrial Area Phase 2',
    createdAt: new Date().toISOString()
  },
  {
    name: 'Amit Patel (South Hub)',
    username: 'agent3',
    email: 'agent3@ewaste.com',
    password: bcrypt.hashSync('agent123', 10),
    role: 'agent',
    mobile: '9822334455',
    address: 'South Metro E-Waste Processing Center, Ring Road',
    createdAt: new Date().toISOString()
  }
];

function loadData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
      // Ensure at least one admin account exists so administrator can always log in
      if (Array.isArray(data['ewaste-users'])) {
        const hasAdmin = data['ewaste-users'].some(x => x.role === 'admin');
        if (!hasAdmin) {
          data['ewaste-users'].push(INITIAL_USERS[0]);
          saveData(data);
        }
      }
      return data;
    }
  } catch (err) {
    console.warn('Failed reading local DB file, initializing fresh store:', err.message);
  }

  const initial = {
    'ewaste-users': INITIAL_USERS,
    'ewaste-products': [],
    'ewaste-payments': []
  };

  saveData(initial);
  return initial;
}

function saveData(data) {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Failed saving local DB file:', err.message);
  }
}

const localStore = {
  async send(command) {
    const data = loadData();
    const commandName = command.constructor.name;
    const input = command.input;
    const table = input.TableName;

    if (!data[table]) data[table] = [];
    const items = data[table];

    if (commandName === 'GetCommand') {
      const keyEntries = Object.entries(input.Key);
      const match = items.find(item => keyEntries.every(([k, v]) => String(item[k]).toLowerCase() === String(v).toLowerCase()));
      return { Item: match ? { ...match } : undefined };
    }

    if (commandName === 'PutCommand') {
      const item = { ...input.Item };
      const keyField = input.Item.username !== undefined ? 'username' : 'pid';
      const index = items.findIndex(i => String(i[keyField]).toLowerCase() === String(item[keyField]).toLowerCase());
      if (index >= 0) {
        items[index] = item;
      } else {
        items.push(item);
      }
      saveData(data);
      return {};
    }

    if (commandName === 'DeleteCommand') {
      const keyField = input.Key.username !== undefined ? 'username' : 'pid';
      const targetVal = String(input.Key[keyField]).toLowerCase();
      const index = items.findIndex(i => String(i[keyField]).toLowerCase() === targetVal);
      if (index >= 0) {
        items.splice(index, 1);
        saveData(data);
      }
      return {};
    }

    if (commandName === 'UpdateCommand') {
      const keyField = input.Key.username !== undefined ? 'username' : 'pid';
      const targetVal = String(input.Key[keyField]).toLowerCase();
      const existing = items.find(i => String(i[keyField]).toLowerCase() === targetVal);

      if (!existing && input.ConditionExpression) {
        const error = new Error('ConditionalCheckFailedException');
        error.name = 'ConditionalCheckFailedException';
        throw error;
      }

      if (existing && input.ExpressionAttributeValues) {
        if (input.ExpressionAttributeValues[':s']) {
          existing.status = input.ExpressionAttributeValues[':s'];
        }
        if (input.ExpressionAttributeValues[':u']) {
          existing.updatedAt = input.ExpressionAttributeValues[':u'];
        }
      }

      saveData(data);
      return { Attributes: { ...existing } };
    }

    if (commandName === 'QueryCommand') {
      let filtered = [...items];
      const vals = input.ExpressionAttributeValues || {};

      if (input.IndexName === 'RoleIndex' && vals[':role']) {
        filtered = filtered.filter(i => (i.role || '').toLowerCase() === String(vals[':role']).toLowerCase());
      } else if (input.IndexName === 'EmailIndex' && vals[':e']) {
        filtered = filtered.filter(i => (i.email || '').toLowerCase() === String(vals[':e']).toLowerCase());
      } else if (input.IndexName === 'UsernameIndex' && vals[':u']) {
        filtered = filtered.filter(i => (i.username || '').toLowerCase() === String(vals[':u']).toLowerCase());
      } else if (input.IndexName === 'StatusIndex' && vals[':s']) {
        filtered = filtered.filter(i => (i.status || '').toLowerCase() === String(vals[':s']).toLowerCase());
      } else if ((input.IndexName === 'AllProductsIndex' || input.IndexName === 'AllPaymentsIndex') && vals[':e']) {
        filtered = filtered.filter(i => (i.entity || '') === vals[':e']);
      }

      // Sort newest first
      filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

      if (input.Select === 'COUNT') {
        return { Count: filtered.length };
      }

      return { Items: filtered };
    }

    if (commandName === 'ScanCommand') {
      return { Items: [...items] };
    }

    return {};
  }
};

module.exports = localStore;
