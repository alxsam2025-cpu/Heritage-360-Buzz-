const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import Models
const User = require('../models/User');
const Room = require('../models/Room');
const Menu = require('../models/Menu');
const PubMenu = require('../models/PubMenu');
const Inventory = require('../models/Inventory');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for seeding...');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

const createUsers = async () => {
  try {
    // Check if admin user exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Create initial users
    const users = [
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
          { module: 'reports', actions: ['create', 'read', 'update', 'delete', 'approve'] },
          { module: 'users', actions: ['create', 'read', 'update', 'delete', 'approve'] }
        ]
      },
      {
        name: 'Hotel Manager',
        username: 'hotelmanager',
        password: 'hotel123',
        role: 'manager',
        department: 'hotel',
        permissions: [
          { module: 'hotel', actions: ['create', 'read', 'update', 'approve'] },
          { module: 'reports', actions: ['read'] }
        ]
      },
      {
        name: 'Restaurant Manager',
        username: 'restmanager',
        password: 'restaurant123',
        role: 'manager',
        department: 'restaurant',
        permissions: [
          { module: 'restaurant', actions: ['create', 'read', 'update', 'approve'] },
          { module: 'reports', actions: ['read'] }
        ]
      },
      {
        name: 'John Waiter',
        username: 'waiter1',
        password: 'waiter123',
        role: 'waiter',
        department: 'restaurant',
        permissions: [
          { module: 'restaurant', actions: ['create', 'read', 'update'] }
        ]
      },
      {
        name: 'Mary Receptionist',
        username: 'receptionist1',
        password: 'reception123',
        role: 'receptionist',
        department: 'hotel',
        permissions: [
          { module: 'hotel', actions: ['create', 'read', 'update'] }
        ]
      },
      {
        name: 'David Accountant',
        username: 'accountant1',
        password: 'accounting123',
        role: 'accountant',
        department: 'accounting',
        permissions: [
          { module: 'accounting', actions: ['create', 'read', 'update', 'approve'] },
          { module: 'reports', actions: ['read'] }
        ]
      }
    ];

    await User.insertMany(users);
    console.log('✅ Users created successfully');
  } catch (error) {
    console.error('Error creating users:', error);
  }
};

const createRooms = async () => {
  try {
    const existingRooms = await Room.countDocuments();
    
    if (existingRooms > 0) {
      console.log('Rooms already exist');
      return;
    }

    const admin = await User.findOne({ role: 'admin' });
    
    const rooms = [
      // Floor 1 - Double Rooms
      { roomNumber: '101', roomType: 'Double', floor: 1, capacity: { adults: 2, children: 1 }, amenities: ['air_conditioning', 'wifi', 'tv', 'bathroom'], createdBy: admin._id },
      { roomNumber: '102', roomType: 'Double', floor: 1, capacity: { adults: 2, children: 1 }, amenities: ['air_conditioning', 'wifi', 'tv', 'bathroom'], createdBy: admin._id },
      { roomNumber: '103', roomType: 'Double', floor: 1, capacity: { adults: 2, children: 1 }, amenities: ['air_conditioning', 'wifi', 'tv', 'bathroom'], createdBy: admin._id },
      { roomNumber: '104', roomType: 'Double', floor: 1, capacity: { adults: 2, children: 1 }, amenities: ['air_conditioning', 'wifi', 'tv', 'bathroom'], createdBy: admin._id },
      
      // Floor 2 - Executive Rooms
      { roomNumber: '201', roomType: 'Executive', floor: 2, capacity: { adults: 2, children: 2 }, amenities: ['air_conditioning', 'wifi', 'tv', 'minibar', 'bathroom', 'balcony'], createdBy: admin._id },
      { roomNumber: '202', roomType: 'Executive', floor: 2, capacity: { adults: 2, children: 2 }, amenities: ['air_conditioning', 'wifi', 'tv', 'minibar', 'bathroom', 'balcony'], createdBy: admin._id },
      { roomNumber: '203', roomType: 'Executive', floor: 2, capacity: { adults: 2, children: 2 }, amenities: ['air_conditioning', 'wifi', 'tv', 'minibar', 'bathroom', 'city_view'], createdBy: admin._id },
      
      // Floor 3 - Master Rooms
      { roomNumber: '301', roomType: 'Master', floor: 3, capacity: { adults: 4, children: 2 }, amenities: ['air_conditioning', 'wifi', 'tv', 'minibar', 'safe', 'bathroom', 'bathtub', 'balcony', 'room_service'], createdBy: admin._id },
      { roomNumber: '302', roomType: 'Master', floor: 3, capacity: { adults: 4, children: 2 }, amenities: ['air_conditioning', 'wifi', 'tv', 'minibar', 'safe', 'bathroom', 'bathtub', 'sea_view', 'room_service'], createdBy: admin._id }
    ];

    await Room.insertMany(rooms);
    console.log('✅ Rooms created successfully');
  } catch (error) {
    console.error('Error creating rooms:', error);
  }
};

const createRestaurantMenu = async () => {
  try {
    const existingMenu = await Menu.findOne();
    
    if (existingMenu) {
      console.log('Restaurant menu already exists');
      return;
    }

    const admin = await User.findOne({ role: 'admin' });
    
    const menuItems = [
      // Breakfast - Local
      { name: 'Banku with Tilapia', description: 'Traditional Ghanaian fermented corn dish with grilled tilapia', category: 'breakfast', cuisine: 'local', price: 25, ingredients: ['corn flour', 'cassava', 'tilapia', 'pepper'], preparationTime: 20, createdBy: admin._id },
      { name: 'Waakye', description: 'Rice and beans with traditional sides', category: 'breakfast', cuisine: 'local', price: 15, ingredients: ['rice', 'beans', 'millet leaves'], preparationTime: 25, createdBy: admin._id },
      { name: 'Kenkey with Fish', description: 'Fermented corn dumpling with fried fish', category: 'breakfast', cuisine: 'local', price: 20, ingredients: ['corn', 'fish', 'pepper sauce'], preparationTime: 15, createdBy: admin._id },
      
      // Breakfast - Continental
      { name: 'English Breakfast', description: 'Full breakfast with eggs, bacon, sausage, beans', category: 'breakfast', cuisine: 'continental', price: 35, ingredients: ['eggs', 'bacon', 'sausage', 'beans', 'toast'], preparationTime: 15, createdBy: admin._id },
      { name: 'Pancakes with Syrup', description: 'Fluffy pancakes with maple syrup', category: 'breakfast', cuisine: 'continental', price: 20, ingredients: ['flour', 'eggs', 'milk', 'maple syrup'], preparationTime: 10, createdBy: admin._id },
      
      // Lunch - Local
      { name: 'Jollof Rice', description: 'Spicy rice dish with chicken or beef', category: 'lunch', cuisine: 'local', price: 30, ingredients: ['rice', 'tomatoes', 'onions', 'chicken'], preparationTime: 30, createdBy: admin._id },
      { name: 'Fufu with Light Soup', description: 'Pounded cassava with goat meat soup', category: 'lunch', cuisine: 'local', price: 35, ingredients: ['cassava', 'goat meat', 'palm nut'], preparationTime: 45, createdBy: admin._id },
      { name: 'Red Red', description: 'Bean stew with fried plantain', category: 'lunch', cuisine: 'local', price: 18, ingredients: ['beans', 'plantain', 'palm oil'], preparationTime: 25, createdBy: admin._id },
      
      // Lunch - Continental
      { name: 'Grilled Chicken Salad', description: 'Fresh salad with grilled chicken breast', category: 'lunch', cuisine: 'continental', price: 40, ingredients: ['chicken breast', 'lettuce', 'tomatoes', 'cucumber'], preparationTime: 20, createdBy: admin._id },
      { name: 'Beef Burger', description: 'Juicy beef patty with fries', category: 'lunch', cuisine: 'continental', price: 45, ingredients: ['beef', 'bun', 'lettuce', 'tomato', 'potato'], preparationTime: 15, createdBy: admin._id },
      
      // Dinner - Local
      { name: 'Kelewele', description: 'Spicy fried plantain cubes', category: 'dinner', cuisine: 'local', price: 12, ingredients: ['plantain', 'ginger', 'chili'], preparationTime: 15, createdBy: admin._id },
      { name: 'Grilled Tilapia', description: 'Whole grilled tilapia with banku', category: 'dinner', cuisine: 'local', price: 50, ingredients: ['tilapia', 'spices', 'banku'], preparationTime: 25, createdBy: admin._id },
      
      // Dinner - Continental
      { name: 'Steak and Chips', description: 'Grilled beef steak with potato chips', category: 'dinner', cuisine: 'continental', price: 80, ingredients: ['beef steak', 'potatoes', 'vegetables'], preparationTime: 30, createdBy: admin._id },
      { name: 'Pasta Alfredo', description: 'Creamy pasta with chicken', category: 'dinner', cuisine: 'continental', price: 45, ingredients: ['pasta', 'cream', 'chicken', 'cheese'], preparationTime: 20, createdBy: admin._id }
    ];

    const menu = new Menu({
      name: 'Heritage 360 Restaurant Menu',
      items: menuItems
    });

    await menu.save();
    console.log('✅ Restaurant menu created successfully');
  } catch (error) {
    console.error('Error creating restaurant menu:', error);
  }
};

const createPubMenu = async () => {
  try {
    const existingMenu = await PubMenu.findOne();
    
    if (existingMenu) {
      console.log('Pub menu already exists');
      return;
    }

    const admin = await User.findOne({ role: 'admin' });
    
    const pubItems = [
      // Local Beers
      { name: 'Star Beer', category: 'beer', type: 'local', brand: 'Star', alcoholContent: 5.0, volume: { amount: 650, unit: 'ml' }, price: 8, stockLevel: { current: 100, minimum: 20, unit: 'bottles' }, createdBy: admin._id },
      { name: 'Club Beer', category: 'beer', type: 'local', brand: 'Club', alcoholContent: 5.0, volume: { amount: 650, unit: 'ml' }, price: 8, stockLevel: { current: 80, minimum: 20, unit: 'bottles' }, createdBy: admin._id },
      { name: 'Stone Beer', category: 'beer', type: 'local', brand: 'Stone', alcoholContent: 5.5, volume: { amount: 650, unit: 'ml' }, price: 10, stockLevel: { current: 60, minimum: 15, unit: 'bottles' }, createdBy: admin._id },
      
      // Continental Beers
      { name: 'Heineken', category: 'beer', type: 'continental', brand: 'Heineken', alcoholContent: 5.0, volume: { amount: 330, unit: 'ml' }, price: 15, stockLevel: { current: 50, minimum: 10, unit: 'bottles' }, createdBy: admin._id },
      { name: 'Guinness', category: 'beer', type: 'continental', brand: 'Guinness', alcoholContent: 4.2, volume: { amount: 330, unit: 'ml' }, price: 18, stockLevel: { current: 40, minimum: 10, unit: 'bottles' }, createdBy: admin._id },
      
      // Local Spirits
      { name: 'Akpeteshie', category: 'spirits', type: 'local', brand: 'Local', alcoholContent: 40, volume: { amount: 750, unit: 'ml' }, price: 80, stockLevel: { current: 20, minimum: 5, unit: 'bottles' }, createdBy: admin._id },
      
      // Continental Spirits
      { name: 'Johnny Walker Black', category: 'spirits', type: 'continental', brand: 'Johnny Walker', alcoholContent: 40, volume: { amount: 750, unit: 'ml' }, price: 300, stockLevel: { current: 15, minimum: 3, unit: 'bottles' }, createdBy: admin._id },
      { name: 'Smirnoff Vodka', category: 'spirits', type: 'continental', brand: 'Smirnoff', alcoholContent: 40, volume: { amount: 750, unit: 'ml' }, price: 180, stockLevel: { current: 25, minimum: 5, unit: 'bottles' }, createdBy: admin._id },
      
      // Wines
      { name: '4th Street Wine', category: 'wine', type: 'continental', brand: '4th Street', alcoholContent: 7.5, volume: { amount: 750, unit: 'ml' }, price: 35, stockLevel: { current: 30, minimum: 5, unit: 'bottles' }, createdBy: admin._id },
      
      // Soft Drinks
      { name: 'Coca Cola', category: 'soft_drinks', type: 'continental', brand: 'Coca Cola', alcoholContent: 0, volume: { amount: 350, unit: 'ml' }, price: 5, stockLevel: { current: 200, minimum: 50, unit: 'cans' }, createdBy: admin._id },
      { name: 'Fanta', category: 'soft_drinks', type: 'continental', brand: 'Fanta', alcoholContent: 0, volume: { amount: 350, unit: 'ml' }, price: 5, stockLevel: { current: 150, minimum: 50, unit: 'cans' }, createdBy: admin._id },
      { name: 'Sprite', category: 'soft_drinks', type: 'continental', brand: 'Sprite', alcoholContent: 0, volume: { amount: 350, unit: 'ml' }, price: 5, stockLevel: { current: 150, minimum: 50, unit: 'cans' }, createdBy: admin._id },
      
      // Water
      { name: 'Voltic Water', category: 'water', type: 'local', brand: 'Voltic', alcoholContent: 0, volume: { amount: 750, unit: 'ml' }, price: 3, stockLevel: { current: 300, minimum: 100, unit: 'bottles' }, createdBy: admin._id }
    ];

    const pubMenu = new PubMenu({
      name: 'Heritage 360 Pub Menu',
      items: pubItems
    });

    await pubMenu.save();
    console.log('✅ Pub menu created successfully');
  } catch (error) {
    console.error('Error creating pub menu:', error);
  }
};

const createInventoryItems = async () => {
  try {
    const existingItems = await Inventory.countDocuments();
    
    if (existingItems > 0) {
      console.log('Inventory items already exist');
      return;
    }

    const admin = await User.findOne({ role: 'admin' });
    
    const inventoryItems = [
      // Food Ingredients
      { name: 'Rice (Local)', category: 'food_ingredients', unit: 'kg', currentStock: 100, minimumStock: 20, pricing: { costPrice: 8, sellingPrice: 12, currency: 'GHS' }, storage: { location: 'Dry Store A' }, createdBy: admin._id },
      { name: 'Tomatoes', category: 'food_ingredients', unit: 'kg', currentStock: 50, minimumStock: 10, pricing: { costPrice: 5, sellingPrice: 8, currency: 'GHS' }, storage: { location: 'Cold Store' }, createdBy: admin._id },
      { name: 'Chicken (Whole)', category: 'food_ingredients', unit: 'kg', currentStock: 30, minimumStock: 10, pricing: { costPrice: 25, sellingPrice: 35, currency: 'GHS' }, storage: { location: 'Freezer A' }, createdBy: admin._id },
      
      // Hotel Amenities
      { name: 'Bed Sheets (Double)', category: 'hotel_amenities', unit: 'pieces', currentStock: 50, minimumStock: 20, pricing: { costPrice: 80, sellingPrice: 100, currency: 'GHS' }, storage: { location: 'Linen Room' }, createdBy: admin._id },
      { name: 'Towels (Bath)', category: 'hotel_amenities', unit: 'pieces', currentStock: 100, minimumStock: 30, pricing: { costPrice: 25, sellingPrice: 35, currency: 'GHS' }, storage: { location: 'Linen Room' }, createdBy: admin._id },
      { name: 'Toiletries Kit', category: 'toiletries', unit: 'packets', currentStock: 200, minimumStock: 50, pricing: { costPrice: 8, sellingPrice: 15, currency: 'GHS' }, storage: { location: 'Housekeeping Store' }, createdBy: admin._id },
      
      // Cleaning Supplies
      { name: 'Detergent (Industrial)', category: 'cleaning_supplies', unit: 'liters', currentStock: 20, minimumStock: 5, pricing: { costPrice: 15, sellingPrice: 25, currency: 'GHS' }, storage: { location: 'Cleaning Store' }, createdBy: admin._id },
      { name: 'Disinfectant', category: 'cleaning_supplies', unit: 'liters', currentStock: 15, minimumStock: 5, pricing: { costPrice: 20, sellingPrice: 30, currency: 'GHS' }, storage: { location: 'Cleaning Store' }, createdBy: admin._id },
      
      // Office Supplies
      { name: 'A4 Paper', category: 'office_supplies', unit: 'boxes', currentStock: 10, minimumStock: 3, pricing: { costPrice: 35, sellingPrice: 50, currency: 'GHS' }, storage: { location: 'Office Store' }, createdBy: admin._id },
      { name: 'Printer Ink (Black)', category: 'office_supplies', unit: 'pieces', currentStock: 5, minimumStock: 2, pricing: { costPrice: 120, sellingPrice: 150, currency: 'GHS' }, storage: { location: 'Office Store' }, createdBy: admin._id }
    ];

    await Inventory.insertMany(inventoryItems);
    console.log('✅ Inventory items created successfully');
  } catch (error) {
    console.error('Error creating inventory items:', error);
  }
};

const seedDatabase = async () => {
  try {
    await connectDB();
    
    console.log('🌱 Starting database seeding...');
    
    await createUsers();
    await createRooms();
    await createRestaurantMenu();
    await createPubMenu();
    await createInventoryItems();
    
    console.log('✅ Database seeding completed successfully!');
    
    console.log('\n🔐 Login Credentials:');
    console.log('Admin: username=admin, password=admin123');
    console.log('Hotel Manager: username=hotelmanager, password=hotel123');
    console.log('Restaurant Manager: username=restmanager, password=restaurant123');
    console.log('Waiter: username=waiter1, password=waiter123');
    console.log('Receptionist: username=receptionist1, password=reception123');
    console.log('Accountant: username=accountant1, password=accounting123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeder if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;