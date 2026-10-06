const express = require('express');
const router = express.Router();
const { listByRole, countByRole } = require('../models/User');
const { countAll: countProducts } = require('../models/Product');
const { countByStatus } = require('../models/Payment');
const { verifyToken, verifyRole } = require('../middleware/auth');

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
