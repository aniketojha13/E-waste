const express = require('express');
const router = express.Router();
const { getByPid, putProduct, queryByUsername, listAll } = require('../models/Product');
const { putPayment, getByPids } = require('../models/Payment');
const { getByUsername } = require('../models/User');
const { verifyToken, verifyRole } = require('../middleware/auth');
const { getPresignedGetUrl } = require('./uploads');

// ─── POST /api/products ───────────────────────────────────────────────────────
// Add new product (Customer or Admin)

router.post('/', verifyToken, verifyRole(['customer', 'admin']), async (req, res) => {
  try {
    const { productName, productAge, productPrice, imageKey } = req.body;

    if (!productName || !productAge || !productPrice) {
      return res.status(400).json({ message: 'Product name, age, and price are required' });
    }

    const pid = `${productName.toLowerCase().replace(/\s+/g, '')}_${productAge}_${Date.now().toString().slice(-4)}`;

    const product = {
      pid,
      username: req.user.username,
      productName,
      productAge,
      productPrice: Number(productPrice),
      imageKey: imageKey || null,
      createdAt: new Date().toISOString()
    };

    const payment = {
      pid,
      username: req.user.username,
      productName,
      amount: Number(productPrice),
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    await Promise.all([putProduct(product), putPayment(payment)]);

    res.status(201).json({
      message: 'Product added successfully',
      product,
      payment
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─── GET /api/products/my-products ───────────────────────────────────────────
// Products for the logged-in customer

router.get('/my-products', verifyToken, async (req, res) => {
  try {
    const products = await queryByUsername(req.user.username);
    const payments = await getByPids(products.map(p => p.pid));

    const paymentMap = {};
    payments.forEach(p => { paymentMap[p.pid] = p.status; });

    const results = await Promise.all(products.map(async p => ({
      pid: p.pid,
      username: p.username,
      productName: p.productName,
      productAge: p.productAge,
      productPrice: p.productPrice,
      imageUrl: p.imageKey ? await getPresignedGetUrl(p.imageKey) : null,
      status: paymentMap[p.pid] || 'Pending',
      createdAt: p.createdAt
    })));

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─── GET /api/products ────────────────────────────────────────────────────────
// All products (Agent & Admin), with customer details via manual lookup

router.get('/', verifyToken, verifyRole(['agent', 'admin']), async (req, res) => {
  try {
    const products = await listAll();
    const payments = await getByPids(products.map(p => p.pid));

    const paymentMap = {};
    payments.forEach(p => { paymentMap[p.pid] = p.status; });

    // Manual "populate": batch-fetch unique customer records
    const usernames = [...new Set(products.map(p => p.username))];
    const userRecords = await Promise.all(usernames.map(u => getByUsername(u)));
    const userMap = {};
    userRecords.forEach(u => {
      if (u) userMap[u.username] = { name: u.name, email: u.email, mobile: u.mobile, address: u.address };
    });

    const results = await Promise.all(products.map(async p => ({
      pid: p.pid,
      username: p.username,
      productName: p.productName,
      productAge: p.productAge,
      productPrice: p.productPrice,
      imageUrl: p.imageKey ? await getPresignedGetUrl(p.imageKey) : null,
      customerDetails: userMap[p.username] || null,
      status: paymentMap[p.pid] || 'Pending',
      createdAt: p.createdAt
    })));

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
