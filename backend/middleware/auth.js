const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ message: 'Server misconfiguration: JWT_SECRET not set' });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token required' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

const verifyRole = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied: Unauthorized role' });
    }
    next();
  };
};

module.exports = {
  verifyToken,
  verifyRole
};
