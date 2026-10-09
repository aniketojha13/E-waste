const express = require('express');
const router = express.Router();
const { getByPid, putProduct, queryByUsername, listAll } = require('../models/Product');
const { putPayment, getByPids, updateStatus } = require('../models/Payment');
const { getByUsername, listByRole } = require('../models/User');
const { verifyToken, verifyRole } = require('../middleware/auth');
const { getPresignedGetUrl } = require('./uploads');

// ─── GET /api/products/agents ─────────────────────────────────────────────────
// Returns list of available collection agents for customer selection
router.get('/agents', verifyToken, async (req, res) => {
  try {
    const agents = await listByRole('agent');
    const safeAgents = agents.map(a => ({
      name: a.name,
      username: a.username,
      mobile: a.mobile || '9876543210',
      address: a.address || 'Central E-Waste Depot',
      email: a.email
    }));
    res.json(safeAgents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─── POST /api/products ───────────────────────────────────────────────────────
// Submit product for sale / collection (Customer)
router.post('/', verifyToken, verifyRole(['customer', 'admin']), async (req, res) => {
  try {
    const { 
      productName, 
      productAge, 
      productPrice, 
      imageKey,
      category,
      brand,
      model,
      yearOfManufacture,
      condition,
      specs,
      accessories,
      assignedAgent,
      customerNotes,
      imeiOrSerial,
      isVerifiedClean,
      ram,
      storage
    } = req.body;

    if (!productName || !productPrice) {
      return res.status(400).json({ message: 'Product name and estimated price are required.' });
    }

    const cleanModel = (model || productName).toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 10);
    const yearTag = yearOfManufacture || productAge || 'item';
    const pid = `EW_${cleanModel}_${yearTag}_${Date.now().toString().slice(-4)}`.toUpperCase();

    // Fetch submitting customer profile for verified contact & pickup address
    const customerUser = await getByUsername(req.user.username);

    const product = {
      pid,
      username: req.user.username,
      productName,
      productAge: productAge || `${yearOfManufacture || ''} Model`,
      productPrice: Number(productPrice),
      imageKey: imageKey || null,
      category: category || 'Electronics',
      brand: brand || '',
      model: model || productName,
      yearOfManufacture: yearOfManufacture || '',
      condition: condition || 'Functional',
      specs: specs || '',
      ram: ram || '',
      storage: storage || '',
      imeiOrSerial: imeiOrSerial || '',
      isVerifiedClean: isVerifiedClean !== undefined ? Boolean(isVerifiedClean) : false,
      accessories: Array.isArray(accessories) ? accessories : (accessories ? [accessories] : []),
      assignedAgent: assignedAgent || 'agent1',
      customerNotes: customerNotes || '',
      customerDetails: {
        name: customerUser?.name || req.user.name || req.user.username,
        email: customerUser?.email || '',
        mobile: customerUser?.mobile || '',
        address: customerUser?.address || ''
      },
      createdAt: new Date().toISOString()
    };

    const payment = {
      pid,
      username: req.user.username,
      productName,
      amount: Number(productPrice),
      assignedAgent: product.assignedAgent,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    await Promise.all([putProduct(product), putPayment(payment)]);

    res.status(201).json({
      message: 'Product listed successfully. Collection agent assigned.',
      product,
      payment
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─── GET /api/products/my-products ───────────────────────────────────────────
// Products submitted by the logged-in customer (includes assigned agent contact info)
router.get('/my-products', verifyToken, async (req, res) => {
  try {
    const products = await queryByUsername(req.user.username);
    const payments = await getByPids(products.map(p => p.pid));

    const paymentMap = {};
    payments.forEach(p => { paymentMap[p.pid] = p.status; });

    // Pre-fetch assigned agents details so customer can contact their agent directly
    const agentUsernames = [...new Set(products.map(p => p.assignedAgent).filter(Boolean))];
    const agentRecords = await Promise.all(agentUsernames.map(u => getByUsername(u)));
    const agentMap = {};
    agentRecords.forEach(a => {
      if (a) {
        agentMap[a.username] = {
          name: a.name,
          username: a.username,
          mobile: a.mobile || '9876543210',
          address: a.address || 'Local Collection Depot'
        };
      }
    });

    const results = await Promise.all(products.map(async p => {
      const agentInfo = agentMap[p.assignedAgent] || {
        name: 'John Agent (Downtown Center)',
        username: 'agent1',
        mobile: '9876543210',
        address: 'City E-Waste Collection Hub'
      };

      return {
        pid: p.pid,
        username: p.username,
        productName: p.productName,
        productAge: p.productAge,
        productPrice: p.productPrice,
        category: p.category,
        brand: p.brand,
        model: p.model,
        yearOfManufacture: p.yearOfManufacture,
        condition: p.condition,
        specs: p.specs,
        ram: p.ram,
        storage: p.storage,
        imeiOrSerial: p.imeiOrSerial,
        isVerifiedClean: p.isVerifiedClean,
        accessories: p.accessories,
        assignedAgent: p.assignedAgent,
        assignedAgentDetails: agentInfo,
        customerNotes: p.customerNotes,
        imageUrl: p.imageKey ? await getPresignedGetUrl(p.imageKey) : null,
        status: paymentMap[p.pid] || 'Pending',
        createdAt: p.createdAt
      };
    }));

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─── GET /api/products/agent-orders ──────────────────────────────────────────
// Orders assigned to the currently logged-in agent only
router.get('/agent-orders', verifyToken, verifyRole(['agent']), async (req, res) => {
  try {
    const agentUsername = req.user.username;
    const allProducts = await listAll();
    const assigned = allProducts.filter(p => p.assignedAgent === agentUsername);

    const payments = await getByPids(assigned.map(p => p.pid));
    const paymentMap = {};
    payments.forEach(p => { paymentMap[p.pid] = p.status; });

    // Get customer details for each order
    const usernames = [...new Set(assigned.map(p => p.username))];
    const userRecords = await Promise.all(usernames.map(u => getByUsername(u)));
    const userMap = {};
    userRecords.forEach(u => {
      if (u) {
        userMap[u.username] = {
          name: u.name,
          email: u.email,
          mobile: u.mobile || 'Not provided',
          address: u.address || 'Not provided'
        };
      }
    });

    const results = await Promise.all(assigned.map(async p => ({
      pid: p.pid,
      username: p.username,
      productName: p.productName,
      productAge: p.productAge,
      productPrice: p.productPrice,
      category: p.category,
      brand: p.brand,
      model: p.model,
      yearOfManufacture: p.yearOfManufacture,
      condition: p.condition,
      specs: p.specs,
      ram: p.ram,
      storage: p.storage,
      imeiOrSerial: p.imeiOrSerial,
      isVerifiedClean: p.isVerifiedClean,
      accessories: p.accessories,
      assignedAgent: p.assignedAgent,
      customerNotes: p.customerNotes,
      customerDetails: userMap[p.username] || null,
      customerName: userMap[p.username]?.name || p.username,
      customerMobile: userMap[p.username]?.mobile || null,
      customerAddress: userMap[p.username]?.address || null,
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
// All products (Admin only) with customer contact info
router.get('/', verifyToken, verifyRole(['admin']), async (req, res) => {
  try {
    const products = await listAll();
    const payments = await getByPids(products.map(p => p.pid));

    const paymentMap = {};
    payments.forEach(p => { paymentMap[p.pid] = p.status; });

    // Lookup customer details for each product
    const usernames = [...new Set(products.map(p => p.username))];
    const userRecords = await Promise.all(usernames.map(u => getByUsername(u)));
    const userMap = {};
    userRecords.forEach(u => {
      if (u) {
        userMap[u.username] = { 
          name: u.name, 
          email: u.email, 
          mobile: u.mobile || 'Not provided', 
          address: u.address || 'Not provided' 
        };
      }
    });

    const results = await Promise.all(products.map(async p => ({
      pid: p.pid,
      username: p.username,
      productName: p.productName,
      productAge: p.productAge,
      productPrice: p.productPrice,
      category: p.category,
      brand: p.brand,
      model: p.model,
      yearOfManufacture: p.yearOfManufacture,
      condition: p.condition,
      specs: p.specs,
      ram: p.ram,
      storage: p.storage,
      imeiOrSerial: p.imeiOrSerial,
      isVerifiedClean: p.isVerifiedClean,
      accessories: p.accessories,
      assignedAgent: p.assignedAgent,
      customerNotes: p.customerNotes,
      customerDetails: p.customerDetails || userMap[p.username] || null,
      imageUrl: p.imageKey ? await getPresignedGetUrl(p.imageKey) : null,
      status: paymentMap[p.pid] || 'Pending',
      createdAt: p.createdAt
    })));

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─── PUT /api/products/:pid/assign-agent ─────────────────────────────────────
// Admin re-assigns / transfers order from one collection agent to another
router.put('/:pid/assign-agent', verifyToken, verifyRole(['admin']), async (req, res) => {
  try {
    const { pid } = req.params;
    const { newAgentUsername } = req.body;

    if (!newAgentUsername) {
      return res.status(400).json({ message: 'New agent username is required.' });
    }

    const [product, newAgent] = await Promise.all([
      getByPid(pid),
      getByUsername(newAgentUsername.toLowerCase())
    ]);

    if (!product) {
      return res.status(404).json({ message: 'Product order not found.' });
    }

    if (!newAgent || newAgent.role !== 'agent') {
      return res.status(400).json({ message: 'Target user is not a registered collection agent.' });
    }

    const previousAgent = product.assignedAgent;
    const updatedProduct = {
      ...product,
      assignedAgent: newAgentUsername.toLowerCase(),
      updatedAt: new Date().toISOString()
    };

    await putProduct(updatedProduct);

    res.json({
      success: true,
      message: `Order ${pid} transferred successfully from @${previousAgent || 'unassigned'} to agent @${newAgentUsername} (${newAgent.name}).`,
      product: updatedProduct
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
