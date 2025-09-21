const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

// Demo users matching frontend credentials
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

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/heritage360buzz');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

const seedUsers = async () => {
  try {
    await connectDB();
    
    console.log('🌱 Seeding demo users...');
    
    // Clear existing users
    await User.deleteMany({});
    console.log('✅ Cleared existing users');
    
    // Create demo users
    for (const userData of demoUsers) {
      try {
        const user = new User(userData);
        await user.save();
        console.log(`✅ Created user: ${userData.username} (${userData.role})`);
      } catch (error) {
        console.error(`❌ Error creating user ${userData.username}:`, error.message);
      }
    }
    
    console.log('🎉 Demo users seeded successfully!');
    console.log('\n📋 Available Login Credentials:');
    console.log('===============================');
    
    demoUsers.forEach(user => {
      console.log(`👤 ${user.role.toUpperCase()}: ${user.username} / ${user.password}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

// Auto-seed on production deployment
const autoSeed = async () => {
  try {
    await connectDB();
    
    // Check if users already exist
    const userCount = await User.countDocuments();
    
    if (userCount === 0) {
      console.log('🔍 No users found, auto-seeding demo users...');
      await seedUsers();
    } else {
      console.log(`✅ Found ${userCount} existing users, skipping auto-seed`);
    }
  } catch (error) {
    console.error('❌ Auto-seed failed:', error);
  }
};

// Run based on environment
if (require.main === module) {
  // Direct execution - force seed
  seedUsers();
} else {
  // Required as module - auto-seed if no users exist
  module.exports = { autoSeed, seedUsers };
}