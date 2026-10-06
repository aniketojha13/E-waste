const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getByUsername, getByEmail, putUser } = require('../models/User');
const { verifyToken } = require('../middleware/auth');

// ─── helpers ────────────────────────────────────────────────────────────────

function requireJwtSecret(res) {
  if (!process.env.JWT_SECRET) {
    res.status(500).json({ message: 'Server misconfiguration: JWT_SECRET not set' });
    return false;
  }
  return true;
}

function signToken(user) {
  return jwt.sign(
    { id: user.username, username: user.username, role: user.role, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
}

function safeUser(user) {
  const { password, ...rest } = user; // eslint-disable-line no-unused-vars
  return rest;
}

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

module.exports = router;
