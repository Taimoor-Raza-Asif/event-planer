const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { users } = require('../data/store');

const JWT_SECRET = 'secret'; 

exports.register = (req, res) => {
  const { id, email, password } = req.body;

  if (!id || !email || !password) {
    return res.status(400).json({ message: 'ID, email, and password are required' });
  }

  const existingUser = users.find(u => u.email === email || u.id === id);
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists with same email or ID' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = {
    id,
    email,
    password: hashedPassword,
  };
  users.push(newUser);

  res.status(201).json({ message: 'User registered successfully' });
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const isMatch = bcrypt.compareSync(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
};
