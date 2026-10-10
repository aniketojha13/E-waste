const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getByUsername, getByEmail, putUser } = require('../models/User');
const { verifyToken } = require('../middleware/auth');

// ─── helpers ────────────────────────────────────────────────────────────────

const JWT_SECRET = process.env.JWT_SECRET || 'ewaste-jwt-secret-key-production-fallback-2026';

function requireJwtSecret(res) {
  return true;
}

function signToken(user) {
  return jwt.sign(
    { id: user.username, username: user.username, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
}

function safeUser(user) {
  const { password, ...rest } = user; // eslint-disable-line no-unused-vars
  return rest;
}

// ─── POST /auth/send-otp ─────────────────────────────────────────────────────
// Dispatches 6-digit verification code to the requested email address
router.post('/send-otp', async (req, res) => {
  try {
    const { email, name, purpose } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ message: 'Valid email address is required.' });
    }

    const { sendOtpEmail } = require('../services/emailService');
    const result = await sendOtpEmail({
      to: email.trim().toLowerCase(),
      name: name || 'User',
      purpose: purpose || 'Account Verification'
    });

    res.json({
      success: true,
      message: `Verification code dispatched to ${email}. Please check your inbox.`,
      // For testing/preview if live SMTP is not active, also send testPreview
      testPreview: process.env.SMTP_HOST ? undefined : result.otp
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send verification code: ' + error.message });
  }
});

// ─── POST /auth/verify-otp ───────────────────────────────────────────────────
// Validates whether the submitted OTP matches for the given email
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP code are required.' });
    }

    const { verifyOtp } = require('../services/emailService');
    const check = verifyOtp(email, otp);
    if (!check.valid) {
      return res.status(400).json({ message: check.message });
    }

    res.json({ success: true, message: 'Email verified successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─── POST /auth/register ─────────────────────────────────────────────────────

router.post('/register', async (req, res) => {
  try {
    if (!requireJwtSecret(res)) return;

    const { name, username, email, password, mobile, address } = req.body;
    // role is intentionally ignored — all self-registrations are customers

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

    const user = {
      name,
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password: hashedPassword,
      mobile: mobile || '',
      address: address || '',
      role: 'customer', // always customer on self-registration
      createdAt: new Date().toISOString()
    };

    await putUser(user);

    const token = signToken(user);

    // Send real-time welcome email confirmation
    const { sendWelcomeEmail } = require('../services/emailService');
    sendWelcomeEmail({
      to: user.email,
      name: user.name,
      username: user.username,
      role: user.role
    }).catch(e => console.warn('Welcome email error:', e.message));

    res.status(201).json({
      message: 'Account created successfully',
      token,
      user: safeUser(user)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─── POST /auth/login ────────────────────────────────────────────────────────

router.post('/login', async (req, res) => {
  try {
    if (!requireJwtSecret(res)) return;

    const { username, password, role } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const user = await getByUsername(username.toLowerCase());
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials or user role' });
    }

    // Optional role filtering (admin / agent login pages pass a role)
    if (role && user.role !== role) {
      return res.status(401).json({ message: 'Invalid credentials or user role' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = signToken(user);

    res.json({
      message: 'Login successful',
      token,
      user: safeUser(user)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─── GET /auth/me ────────────────────────────────────────────────────────────

router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await getByUsername(req.user.username);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(safeUser(user));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─── PUT /auth/me ────────────────────────────────────────────────────────────
// Allows any authenticated user (admin, agent, customer) to edit their profile
router.put('/me', verifyToken, async (req, res) => {
  try {
    const existing = await getByUsername(req.user.username);
    if (!existing) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { name, email, mobile, address, password } = req.body;

    const updated = {
      ...existing,
      name: name !== undefined ? name : existing.name,
      email: email !== undefined ? email.toLowerCase() : existing.email,
      mobile: mobile !== undefined ? mobile : (existing.mobile || ''),
      address: address !== undefined ? address : (existing.address || ''),
      updatedAt: new Date().toISOString()
    };

    if (password && password.trim().length >= 4) {
      const salt = await bcrypt.genSalt(10);
      updated.password = await bcrypt.hash(password, salt);
    }

    await putUser(updated);

    res.json({
      message: 'Profile updated successfully',
      user: safeUser(updated)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
