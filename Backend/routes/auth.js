// routes/auth.js

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// @route   POST /api/users/signup
// @desc    Register a new user
// @access  Public
router.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Create new user
    user = new User({ username, password });
    await user.save();

    // Prepare payload for JWT
    const payload = { user: { id: user.id } };

    // Sign JWT and return token along with user data
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '100h' }, // Token expires in 10 hours
      (err, token) => {
        if (err) {
          console.error('JWT Sign Error:', err);
          return res.status(500).json({ msg: 'Token generation failed' });
        }
        // Send response with user data and token
        res.json({ user, token });
      }
    );
  } catch (err) {
    console.error('Signup Error:', err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/users/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // Prepare payload for JWT
    const payload = { user: { id: user.id } };

    // Sign JWT and return token along with user data
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' }, // Token expires in 1 hour
      (err, token) => {
        if (err) {
          console.error('JWT Sign Error:', err);
          return res.status(500).json({ msg: 'Token generation failed' });
        }
        // Send response with user data and token
        res.json({ user, token });
      }
    );
  } catch (err) {
    console.error('Login Error:', err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
