const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Small helper
function signToken(id) {
  if (!process.env.JWT_SECRET) {
    throw new Error('Missing JWT_SECRET env variable');
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

exports.register = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'username, email, and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'password must be at least 6 characters' });
    }

    email = String(email).toLowerCase().trim();

    // Check both email and username uniqueness
    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      return res.status(409).json({ message: 'Email or username already in use' });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hash });

    const token = signToken(user._id);
    return res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    // Do not leak internal errors
    return res.status(500).json({ message: 'Registration failed' });
  }
};

exports.login = async (req, res) => {
  try {
    let { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required' });
    }

    email = String(email).toLowerCase().trim();

    const user = await User.findOne({ email });
    // Use same message for both cases to avoid user enumeration
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const token = signToken(user._id);
    return res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: 'Login failed' });
  }
};

// Optional: get current user from token
exports.me = async (req, res) => {
  try {
    // req.user.id should be set by auth middleware
    const user = await User.findById(req.user.id).select('_id username email role');
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json({ user });
  } catch {
    return res.status(500).json({ message: 'Failed to fetch user' });
  }
};
