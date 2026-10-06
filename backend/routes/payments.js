const express = require('express');
const router = express.Router();
const { listAll, updateStatus } = require('../models/Payment');
const { verifyToken, verifyRole } = require('../middleware/auth');

// ─── GET /api/payments ────────────────────────────────────────────────────────
// All payment records (Agent & Admin)

router.get('/', verifyToken, verifyRole(['agent', 'admin']), async (req, res) => {
  try {
    const payments = await listAll();
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─── PUT /api/payments/update-status ─────────────────────────────────────────
// Update pickup / payment status (Agent & Admin)

router.put('/update-status', verifyToken, verifyRole(['agent', 'admin']), async (req, res) => {
  try {
    const { pid, status } = req.body;

    if (!pid || !status) {
      return res.status(400).json({ message: 'PID and status are required' });
    }

    const validStatuses = ['Pending', 'Collected', 'Paid', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: `Status must be one of: ${validStatuses.join(', ')}` });
    }

    let payment;
    try {
      payment = await updateStatus(pid, status);
    } catch (err) {
      if (err.name === 'ConditionalCheckFailedException') {
        return res.status(404).json({ message: 'Payment record not found for PID: ' + pid });
      }
      throw err;
    }

    res.json({ message: 'Status updated successfully', payment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
