import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { findUserByUsername } from '../demo-data.js';

// MongoDB connection
let cachedConnection = null;

const connectDB = async () => {
  if (cachedConnection && cachedConnection.readyState === 1) {
    return cachedConnection;
  }
  
  try {
    // For demo purposes, use a fallback connection string if MONGODB_URI is localhost
    let mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri || mongoUri.includes('localhost')) {
      // Use MongoDB Atlas demo cluster
      mongoUri = 'mongodb+srv://demo:demo123@cluster0.mongodb.net/heritage360buzz?retryWrites=true&w=majority';
    }
    
    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    });
    
    cachedConnection = conn.connection;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return cachedConnection;
  } catch (error) {
    console.error('Database connection error:', error);
    // Return mock connection for demo
    return { readyState: 1 };
  }
};

// User Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  username: {
    type: String,
    required: [true, 'Please provide a username'],
    unique: true,
    trim: true,
    lowercase: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [20, 'Username cannot be more than 20 characters']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  role: {
    type: String,
    enum: ['admin', 'manager', 'waiter', 'receptionist', 'accountant', 'store_keeper'],
    default: 'waiter'
  },
  department: {
    type: String,
    enum: ['hotel', 'restaurant', 'pub', 'accounting', 'store', 'procurement', 'all'],
    default: 'all'
  },
  permissions: [{
    module: {
      type: String,
      enum: ['hotel', 'restaurant', 'pub', 'accounting', 'store', 'procurement', 'reports', 'users']
    },
    actions: [{
      type: String,
      enum: ['create', 'read', 'update', 'delete', 'approve']
    }]
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Match password method
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Update timestamp on save
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

// Demo users data
const demoUsers = [
  {
    name: 'System Administrator',
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    department: 'all',
    permissions: [
      { module: 'hotel', actions: ['create', 'read', 'update', 'delete', 'approve'] },
      { module: 'restaurant', actions: ['create', 'read', 'update', 'delete', 'approve'] },
      { module: 'pub', actions: ['create', 'read', 'update', 'delete', 'approve'] },
      { module: 'accounting', actions: ['create', 'read', 'update', 'delete', 'approve'] },
      { module: 'store', actions: ['create', 'read', 'update', 'delete', 'approve'] },
      { module: 'procurement', actions: ['create', 'read', 'update', 'delete', 'approve'] },
      { module: 'reports', actions: ['create', 'read', 'update', 'delete'] },
      { module: 'users', actions: ['create', 'read', 'update', 'delete'] }
    ],
    isActive: true
  },
  {
    name: 'Hotel Manager',
    username: 'hotelmanager',
    password: 'hotel123',
    role: 'manager',
    department: 'hotel',
    permissions: [
      { module: 'hotel', actions: ['create', 'read', 'update', 'delete'] },
      { module: 'reports', actions: ['read'] }
    ],
    isActive: true
  },
  {
    name: 'Restaurant Manager',
    username: 'restmanager',
    password: 'restaurant123',
    role: 'manager',
    department: 'restaurant',
    permissions: [
      { module: 'restaurant', actions: ['create', 'read', 'update', 'delete'] },
      { module: 'reports', actions: ['read'] }
    ],
    isActive: true
  },
  {
    name: 'Waiter Staff',
    username: 'waiter1',
    password: 'waiter123',
    role: 'waiter',
    department: 'restaurant',
    permissions: [
      { module: 'restaurant', actions: ['read', 'update'] }
    ],
    isActive: true
  },
  {
    name: 'Front Desk Receptionist',
    username: 'receptionist1',
    password: 'reception123',
    role: 'receptionist',
    department: 'hotel',
    permissions: [
      { module: 'hotel', actions: ['read', 'update'] }
    ],
    isActive: true
  },
  {
    name: 'Chief Accountant',
    username: 'accountant1',
    password: 'accounting123',
    role: 'accountant',
    department: 'accounting',
    permissions: [
      { module: 'accounting', actions: ['create', 'read', 'update', 'delete'] },
      { module: 'reports', actions: ['create', 'read'] }
    ],
    isActive: true
  }
];

// Auto-seed users
const seedUsers = async () => {
  try {
    const userCount = await User.countDocuments();
    
    if (userCount === 0) {
      console.log('🌱 Seeding demo users...');
      
      for (const userData of demoUsers) {
        try {
          const user = new User(userData);
          await user.save();
          console.log(`✅ Created user: ${userData.username} (${userData.role})`);
        } catch (error) {
          console.error(`❌ Error creating user ${userData.username}:`, error.message);
        }
      }
    }
  } catch (error) {
    console.error('❌ Auto-seed failed:', error);
  }
};

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  const { username, password } = req.body;

  // Validate username & password
  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide username and password'
    });
  }

  try {
    // Try database connection first
    await connectDB();
    await seedUsers(); // Auto-seed on first connection

    // Check for user in database
    const user = await User.findOne({ username }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User account is deactivated'
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Create token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        role: user.role,
        department: user.department,
        permissions: user.permissions
      }
    });
  } catch (dbError) {
    console.warn('Database connection failed, using demo data fallback:', dbError.message);
    
    // Fallback to demo data
    const demoUser = findUserByUsername(username);
    
    if (!demoUser) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if user is active
    if (!demoUser.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User account is deactivated'
      });
    }

    // For demo, we'll accept the common passwords (admin123, hotel123, etc.)
    const validPasswords = {
      'admin': 'admin123',
      'hotelmanager': 'hotel123', 
      'restmanager': 'restaurant123',
      'waiter1': 'waiter123',
      'receptionist1': 'reception123',
      'accountant1': 'accounting123'
    };

    if (validPasswords[username] !== password) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Create token for demo user
    const token = generateToken(demoUser._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: demoUser._id,
        name: demoUser.name,
        username: demoUser.username,
        role: demoUser.role,
        department: demoUser.department,
        permissions: demoUser.permissions
      },
      demo: true, // Flag to indicate this is demo mode
      message: 'Connected in demo mode - database not available'
    });
  }
}