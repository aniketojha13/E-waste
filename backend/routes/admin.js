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

// ─── GET /api/admin/agent-applications ─────────────────────────────────────────
router.get('/agent-applications', verifyToken, verifyRole(['admin']), async (req, res) => {
  try {
    const fs = require('fs');
    const path = require('path');
    const DATA_FILE = path.resolve(__dirname, '../data/local-db.json');
    if (fs.existsSync(DATA_FILE)) {
      const db = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
      return res.json(db['agent-applications'] || []);
    }
    res.json([]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─── PUT /api/admin/agent-applications/:id ──────────────────────────────────────
router.put('/agent-applications/:id', verifyToken, verifyRole(['admin']), async (req, res) => {
  try {
    const fs = require('fs');
    const path = require('path');
    const DATA_FILE = path.resolve(__dirname, '../data/local-db.json');
    if (!fs.existsSync(DATA_FILE)) return res.status(404).json({ message: 'Store not found' });
    const db = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    if (!Array.isArray(db['agent-applications'])) db['agent-applications'] = [];
    
    let index = db['agent-applications'].findIndex(a => a.id === req.params.id);
    if (index === -1 && req.body.application) {
      db['agent-applications'].push({ ...req.body.application, id: req.params.id });
      index = db['agent-applications'].length - 1;
    }
    if (index === -1) return res.status(404).json({ message: 'Application not found' });
    
    db['agent-applications'][index] = { ...db['agent-applications'][index], ...req.body, updatedAt: new Date().toISOString() };
    fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2), 'utf-8');

    // If status is updated to Rejected, send notification email
    if (req.body.status === 'Rejected') {
      const appRecord = db['agent-applications'][index];
      const { sendAgentRejectedEmail } = require('../services/emailService');
      sendAgentRejectedEmail({
        to: appRecord.email,
        name: appRecord.name,
        reason: req.body.reason || 'Application does not meet current regional depot capacity criteria.'
      }).catch(e => console.warn('Agent rejection email error:', e.message));
    }

    res.json({ success: true, application: db['agent-applications'][index] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─── DELETE /api/admin/agent-applications/clear ──────────────────────────────────
// Admin clears all completed (Approved/Rejected) or all applications from the queue
router.delete('/agent-applications/clear', verifyToken, verifyRole(['admin']), async (req, res) => {
  try {
    const fs = require('fs');
    const path = require('path');
    const DATA_FILE = path.resolve(__dirname, '../data/local-db.json');
    if (!fs.existsSync(DATA_FILE)) return res.json({ success: true, count: 0 });
    const db = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    const beforeCount = (db['agent-applications'] || []).length;
    
    const scope = req.query.scope; // 'processed' (default) or 'all'
    if (scope === 'all') {
      db['agent-applications'] = [];
    } else {
      // Clear only processed (Approved or Rejected) entries, keep Pending
      db['agent-applications'] = (db['agent-applications'] || []).filter(a => a.status === 'Pending');
    }
    
    fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2), 'utf-8');
    const cleared = beforeCount - db['agent-applications'].length;
    res.json({ success: true, cleared, remaining: db['agent-applications'].length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─── DELETE /api/admin/agent-applications/:id ───────────────────────────────────
// Admin deletes a single application record from queue
router.delete('/agent-applications/:id', verifyToken, verifyRole(['admin']), async (req, res) => {
  try {
    const fs = require('fs');
    const path = require('path');
    const DATA_FILE = path.resolve(__dirname, '../data/local-db.json');
    if (!fs.existsSync(DATA_FILE)) return res.status(404).json({ message: 'Store not found' });
    const db = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    if (!Array.isArray(db['agent-applications'])) db['agent-applications'] = [];
    
    db['agent-applications'] = db['agent-applications'].filter(a => a.id !== req.params.id);
    fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2), 'utf-8');
    res.json({ success: true, message: 'Application deleted from queue.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/agent-applications/:id/approve', verifyToken, verifyRole(['admin']), async (req, res) => {
  try {
    const fs = require('fs');
    const path = require('path');
    const DATA_FILE = path.resolve(__dirname, '../data/local-db.json');
    if (!fs.existsSync(DATA_FILE)) return res.status(404).json({ message: 'Store not found' });
    const db = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    if (!Array.isArray(db['agent-applications'])) db['agent-applications'] = [];
    
    let index = db['agent-applications'].findIndex(a => a.id === req.params.id || (req.body.email && a.email === req.body.email));
    let application;

    if (index >= 0) {
      application = db['agent-applications'][index];
    } else if (req.body.application) {
      application = { ...req.body.application, id: req.params.id };
      db['agent-applications'].push(application);
      index = db['agent-applications'].length - 1;
    } else {
      return res.status(404).json({ message: 'Application not found' });
    }

    application.status = 'Approved';
    application.approvedAt = new Date().toISOString();
    db['agent-applications'][index] = application;

    const username = (req.body.username || application.name.toLowerCase().replace(/[^a-z0-9]/g, '') || 'agent_' + Date.now().toString().slice(-4)).toLowerCase();
    const tempPassword = req.body.password || 'agent123';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(tempPassword, salt);

    const agentUser = {
      name: application.name,
      username,
      email: application.email,
      password: hashedPassword,
      role: 'agent',
      mobile: application.phone || '9876543210',
      address: application.address || application.city || 'Central E-Waste Depot',
      createdAt: new Date().toISOString()
    };

    await putUser(agentUser);
    fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2), 'utf-8');

    // Send real-time approval email with credentials
    const { sendAgentApprovedEmail } = require('../services/emailService');
    sendAgentApprovedEmail({
      to: application.email,
      name: application.name,
      username: agentUser.username,
      tempPassword
    }).catch(e => console.warn('Agent approval email error:', e.message));

    res.json({ 
      success: true, 
      message: `Application approved! Agent account @${username} has been created and credentials emailed to ${application.email}.`,
      application,
      agent: { name: agentUser.name, username: agentUser.username, email: agentUser.email, tempPassword }
    });
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

    // If an existing user has the same username or email:
    // If it's already an agent with a DIFFERENT username/email conflict, error.
    // If it's the applicant being configured / upgraded to agent, update their account to agent role!
    const conflictUser = existingByUsername || existingByEmail;
    if (conflictUser && conflictUser.username.toLowerCase() !== username.toLowerCase() && conflictUser.email.toLowerCase() !== email.toLowerCase()) {
      return res.status(400).json({ message: 'Username or Email is already taken by another user' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const agent = {
      ...(conflictUser || {}),
      name,
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password: hashedPassword,
      mobile: mobile || conflictUser?.mobile || '9876543210',
      address: address || conflictUser?.address || 'Central E-Waste Collection Depot',
      role: 'agent',
      updatedAt: new Date().toISOString()
    };
    if (!agent.createdAt) {
      agent.createdAt = new Date().toISOString();
    }

    await putUser(agent);

    // Send real-time credentials email to configured agent
    const { sendAgentApprovedEmail } = require('../services/emailService');
    sendAgentApprovedEmail({
      to: agent.email,
      name: agent.name,
      username: agent.username,
      tempPassword: password
    }).catch(e => console.warn('Direct agent creation email error:', e.message));

    const { password: _, ...safeAgent } = agent;
    res.status(201).json({ message: 'Collection agent configured successfully and credentials dispatched via email', agent: safeAgent });
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
