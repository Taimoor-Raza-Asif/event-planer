const jwt = require('jsonwebtoken');
const { users } = require('../data/store');

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token' });

  try {
    const decoded = jwt.verify(token, 'secret');
    const user = users.find(u => u.id === decoded.id);
    if (!user) throw new Error();
    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};
