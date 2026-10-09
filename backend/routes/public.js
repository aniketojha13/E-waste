const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.resolve(__dirname, '../data/local-db.json');

function readDb() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    }
  } catch (e) {
    console.error('Error reading local-db.json:', e);
  }
  return { 'agent-applications': [] };
}

function writeDb(data) {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error writing to local-db.json:', e);
  }
}

// POST /public/send-agent-otp (Dispatches OTP for agent joining form)
router.post('/send-agent-otp', async (req, res) => {
  try {
    const { email, name } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ message: 'Valid email address is required.' });
    }

    const { sendOtpEmail } = require('../services/emailService');
    const result = await sendOtpEmail({
      to: email.trim().toLowerCase(),
      name: name || 'Agent Applicant',
      purpose: 'Field Collection Agent Application'
    });

    res.json({
      success: true,
      message: `Verification code dispatched to ${email}.`,
      testPreview: process.env.SMTP_HOST ? undefined : result.otp
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to dispatch verification code: ' + error.message });
  }
});

// POST /agent-applications (Public endpoint for collection agent applications)
router.post('/agent-applications', async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      city,
      address,
      experience,
      vehicleType,
      availability,
      motivation
    } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ message: 'Name, email, and phone number are required.' });
    }

    const db = readDb();
    if (!Array.isArray(db['agent-applications'])) {
      db['agent-applications'] = [];
    }

    const application = {
      id: 'app_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      city: (city || '').trim(),
      address: (address || '').trim(),
      experience: experience || 'Beginner (0-1 years)',
      vehicleType: vehicleType || 'Motorcycle / Scooter',
      availability: availability || 'Full Time',
      motivation: (motivation || '').trim(),
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    db['agent-applications'].push(application);
    writeDb(db);

    // Send real-time email notification to the applicant
    const { sendAgentApplicationReceivedEmail } = require('../services/emailService');
    sendAgentApplicationReceivedEmail({
      to: application.email,
      name: application.name,
      phone: application.phone,
      city: application.city
    }).catch(e => console.warn('Agent application email error:', e.message));

    return res.status(201).json({
      success: true,
      message: 'Agent application received successfully. A confirmation email has been dispatched and our team will review within 24 hours.',
      application
    });
  } catch (error) {
    console.error('Submit application error:', error);
    return res.status(500).json({ message: 'Failed to submit application: ' + error.message });
  }
});

// GET /agent-applications (Get all agent applications)
router.get('/agent-applications', async (req, res) => {
  try {
    const db = readDb();
    const apps = db['agent-applications'] || [];
    return res.json(apps);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
