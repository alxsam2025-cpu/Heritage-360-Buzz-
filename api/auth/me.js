import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { findUserById } from '../demo-data.js';

// MongoDB connection
let cachedConnection = null;

const connectDB = async () => {
  if (cachedConnection && cachedConnection.readyState === 1) {
    return cachedConnection;
  }
  
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    cachedConnection = conn.connection;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return cachedConnection;
  } catch (error) {
    console.error('Database connection error:', error);
    throw new Error('Database connection failed');
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

const User = mongoose.models.User || mongoose.model('User', userSchema);

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

  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  // Get token from header
  let token;
  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    try {
      // Try database first
      await connectDB();
      
      // Find user and exclude password
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user || !user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'User not found or inactive'
        });
      }

      res.status(200).json({
        success: true,
        data: {
          id: user._id,
          name: user.name,
          username: user.username,
          role: user.role,
          department: user.department,
          permissions: user.permissions,
          isActive: user.isActive,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt
        }
      });
    } catch (dbError) {
      console.warn('Database connection failed, using demo data fallback:', dbError.message);
      
      // Fallback to demo data
      const demoUser = findUserById(decoded.id);
      
      if (!demoUser || !demoUser.isActive) {
        return res.status(401).json({
          success: false,
          message: 'User not found or inactive'
        });
      }

      res.status(200).json({
        success: true,
        data: {
          id: demoUser._id,
          name: demoUser.name,
          username: demoUser.username,
          role: demoUser.role,
          department: demoUser.department,
          permissions: demoUser.permissions,
          isActive: demoUser.isActive,
          lastLogin: demoUser.lastLogin,
          createdAt: demoUser.createdAt
        },
        demo: true
      });
    }

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
}