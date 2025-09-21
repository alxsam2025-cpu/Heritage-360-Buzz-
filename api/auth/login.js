import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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

  try {
    await connectDB();
    await seedUsers(); // Auto-seed on first connection

    const { username, password } = req.body;

    // Validate email & password
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide username and password'
      });
    }

    // Check for user
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
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
}