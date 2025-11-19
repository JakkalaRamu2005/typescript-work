import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';  // ✅ Remove .js extension

const router = Router();

// Register
router.post('/register', async (req, res) => {
  console.log('=== REGISTRATION ATTEMPT ===');
  console.log('Request body:', req.body);
  
  const { username, email, password } = req.body;
  
  try {
    // Validate input
    if (!username || !email || !password) {
      console.log(' Missing fields');
      return res.status(400).json({ message: 'All fields are required' });
    }
    console.log('All fields present');

    // Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log(' User already exists:', email);
      return res.status(400).json({ message: 'User already exists' });
    }
    console.log(' User does not exist');

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(' Password hashed');

    // Create user
    const newUser = new User({ username, email, password: hashedPassword });
    console.log('User object created');

    // Save to database
    await newUser.save();
    console.log('User saved successfully');

    res.status(201).json({ message: 'User created successfully' });
  } catch (err: any) {
    console.error('REGISTRATION ERROR:');
    console.error('Error message:', err.message);
    console.error('Full error:', err);
    
    res.status(500).json({ 
      message: 'Server error during registration',
      error: err.message 
    });
  }
});

// Login
router.post('/login', async (req, res) => {
  console.log('=== LOGIN ATTEMPT ===');
  const { email, password } = req.body;
  
  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log(' User not found:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Invalid password');
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id }, 
      process.env.JWT_SECRET || 'secret', 
      { expiresIn: '1d' }
    );
    
    console.log('Login successful');
    res.json({ token, username: user.username });
  } catch (err: any) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
