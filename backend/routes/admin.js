const express = require('express');
const router = express.Router();
const { listByRole, countByRole, getByUsername, getByEmail, putUser, deleteUser } = require('../models/User');
const { countAll: countProducts } = require('../models/Product');
const { countByStatus } = require('../models/Payment');
const { verifyToken, verifyRole } = require('../middleware/auth');
const bcrypt = require('bcryptjs');

// ─── GET /api/admin/customers ─────────────────────────────────────────────────

router.get('/customers', verifyToken, verifyRole(['admin']), async (req, res) => {
  try {
    const customers = await listByRole('customer');
    // Strip passwords before returning
    res.json(customers.map(({ password, ...rest }) => rest)); // eslint-disable-line no-unused-vars
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─── GET /api/admin/agents ────────────────────────────────────────────────────

router.get('/agents', verifyToken, verifyRole(['admin']), async (req, res) => {
  try {
    const agents = await listByRole('agent');
    res.json(agents.map(({ password, ...rest }) => rest)); // eslint-disable-line no-unused-vars
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─── POST /api/admin/agents ───────────────────────────────────────────────────
// Admin creates a new verified collection agent
router.post('/agents', verifyToken, verifyRole(['admin']), async (req, res) => {
  try {
    const { name, username, email, password, mobile, address } = req.body;

    if (!name || !username || !email || !password) {
      return res.status(400).json({ message: 'Name, username, email, and password are required' });
    }

    const [existingByUsername, existingByEmail] = await Promise.all([
      getByUsername(username.toLowerCase()),
      getByEmail(email.toLowerCase())
    ]);

    if (existingByUsername || existingByEmail) {
      return res.status(400).json({ message: 'Username or Email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const agent = {
      name,
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password: hashedPassword,
      mobile: mobile || '9876543210',
      address: address || 'Central E-Waste Collection Depot',
      role: 'agent',
      createdAt: new Date().toISOString()
    };

    await putUser(agent);

    const { password: _, ...safeAgent } = agent;
    res.status(201).json({ message: 'Collection agent created successfully', agent: safeAgent });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─── PUT /api/admin/users/:username ───────────────────────────────────────────
// Admin edits any user (agent or customer)
router.put('/users/:username', verifyToken, verifyRole(['admin']), async (req, res) => {
  try {
    const { username } = req.params;
    const existing = await getByUsername(username);

    if (!existing) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { name, email, mobile, address, role, password } = req.body;

    const updated = {
      ...existing,
      name: name !== undefined ? name : existing.name,
      email: email !== undefined ? email.toLowerCase() : existing.email,
      mobile: mobile !== undefined ? mobile : (existing.mobile || ''),
      address: address !== undefined ? address : (existing.address || ''),
      role: role !== undefined ? role : existing.role,
      updatedAt: new Date().toISOString()
    };

    if (password && password.trim().length >= 4) {
      const salt = await bcrypt.genSalt(10);
      updated.password = await bcrypt.hash(password, salt);
    }

    await putUser(updated);

    const { password: _, ...safeUser } = updated;
    res.json({ message: 'User updated successfully', user: safeUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─── DELETE /api/admin/users/:username ────────────────────────────────────────
// Admin deletes any collection agent or customer account
router.delete('/users/:username', verifyToken, verifyRole(['admin']), async (req, res) => {
  try {
    const { username } = req.params;

    if (username.toLowerCase() === req.user.username.toLowerCase()) {
      return res.status(400).json({ message: 'Cannot delete your own active administrator account' });
    }

    const existing = await getByUsername(username);
    if (!existing) {
      return res.status(404).json({ message: 'User not found' });
    }

    await deleteUser(username);
    res.json({ message: `User @${username} removed successfully` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─── GET /api/admin/stats ─────────────────────────────────────────────────────
// System overview statistics — all counts are GSI queries, no full table scans

router.get('/stats', verifyToken, verifyRole(['admin']), async (req, res) => {
  try {
    const [customerCount, agentCount, productCount, pendingPayments, completedPayments] =
      await Promise.all([
        countByRole('customer'),
        countByRole('agent'),
        countProducts(),
        countByStatus('Pending'),
        countByStatus('Paid')
      ]);

    res.json({ customerCount, agentCount, productCount, pendingPayments, completedPayments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
