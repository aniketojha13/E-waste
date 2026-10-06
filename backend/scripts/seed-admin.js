/**
 * One-time seed script: creates the admin and agent accounts in DynamoDB.
 *
 * Usage (local):
 *   node backend/scripts/seed-admin.js
 *
 * Usage (against deployed table):
 *   AWS_REGION=ap-south-1 \
 *   USERS_TABLE=ewaste-users \
 *   JWT_SECRET=<secret> \
 *   node backend/scripts/seed-admin.js
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const bcrypt = require('bcryptjs');
const { getByUsername, putUser } = require('../models/User');

const SEED_USERS = [
  {
    name: 'System Admin',
    username: 'admin',
    email: 'admin@ewaste.com',
    password: 'admin123',
    role: 'admin',
    mobile: '9999999999',
    address: 'E-waste Admin Headquarters'
  },
  {
    name: 'John Agent',
    username: 'agent1',
    email: 'agent1@ewaste.com',
    password: 'agent123',
    role: 'agent',
    mobile: '8888888888',
    address: 'City E-waste Collection Center'
  }
];

async function seed() {
  console.log(`Seeding users into table: ${process.env.USERS_TABLE}`);

  for (const userData of SEED_USERS) {
    const existing = await getByUsername(userData.username);
    if (existing) {
      console.log(`  SKIP  ${userData.username} (already exists)`);
      continue;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    await putUser({
      ...userData,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    });

    console.log(`  CREATED  ${userData.username} / ${userData.password}  [role: ${userData.role}]`);
  }

  console.log('Seeding complete.');
}

seed().catch(err => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
