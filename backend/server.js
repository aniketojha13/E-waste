const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes (Supports both /api/* and /* so it works across local, AWS SAM, and Vercel)
app.use(['/api/auth', '/auth'], require('./routes/auth'));
app.use(['/api/products', '/products'], require('./routes/products'));
app.use(['/api/payments', '/payments'], require('./routes/payments'));
app.use(['/api/admin', '/admin'], require('./routes/admin'));
app.use(['/api/uploads', '/uploads'], require('./routes/uploads'));
app.use(['/api/public', '/public'], require('./routes/public'));

// Healthcheck
app.get(['/api/health', '/health'], (req, res) => {
  res.json({ status: 'OK', message: 'e-Amrit E-Waste Management Backend API is running' });
});

// Export app for Lambda and Vercel
module.exports = app;

// ─── Local-only: start the HTTP server when run directly ─────────────────────
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}
