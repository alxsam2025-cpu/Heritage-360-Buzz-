import jwt from 'jsonwebtoken';

// Demo data for all business modules
const businessData = {
  // Hotel rooms
  rooms: [
    { _id: 'room_001', number: '101', type: 'Double', rate: 40, currency: 'USD', status: 'Available', floor: 1 },
    { _id: 'room_002', number: '102', type: 'Double', rate: 40, currency: 'USD', status: 'Available', floor: 1 },
    { _id: 'room_003', number: '201', type: 'Executive', rate: 60, currency: 'USD', status: 'Available', floor: 2 },
    { _id: 'room_004', number: '202', type: 'Executive', rate: 60, currency: 'USD', status: 'Available', floor: 2 },
    { _id: 'room_005', number: '301', type: 'Master', rate: 120, currency: 'USD', status: 'Available', floor: 3 }
  ],
  
  // Restaurant menu
  restaurantMenu: [
    { _id: 'menu_001', name: 'Jollof Rice', price: 25, currency: 'GHS', category: 'Local', available: true },
    { _id: 'menu_002', name: 'Fried Chicken', price: 30, currency: 'GHS', category: 'Continental', available: true },
    { _id: 'menu_003', name: 'Banku with Tilapia', price: 35, currency: 'GHS', category: 'Local', available: true },
    { _id: 'menu_004', name: 'Pizza Margherita', price: 45, currency: 'GHS', category: 'Continental', available: true },
    { _id: 'menu_005', name: 'Grilled Tilapia', price: 40, currency: 'GHS', category: 'Local', available: true },
    { _id: 'menu_006', name: 'Chicken & Chips', price: 35, currency: 'GHS', category: 'Continental', available: true }
  ],
  
  // Pub beverages
  pubMenu: [
    { _id: 'pub_001', name: 'Club Beer', price: 8, currency: 'GHS', category: 'Local', stock: 50 },
    { _id: 'pub_002', name: 'Guinness', price: 12, currency: 'GHS', category: 'International', stock: 30 },
    { _id: 'pub_003', name: 'Akpeteshie', price: 15, currency: 'GHS', category: 'Local', stock: 25 },
    { _id: 'pub_004', name: 'Whiskey', price: 80, currency: 'GHS', category: 'International', stock: 10 },
    { _id: 'pub_005', name: 'Star Beer', price: 7, currency: 'GHS', category: 'Local', stock: 45 },
    { _id: 'pub_006', name: 'Hennessy', price: 150, currency: 'GHS', category: 'International', stock: 5 }
  ],
  
  // Transactions
  transactions: [
    { _id: 'txn_001', type: 'income', amount: 120, currency: 'USD', department: 'hotel', description: 'Room booking', date: new Date() },
    { _id: 'txn_002', type: 'income', amount: 45, currency: 'GHS', department: 'restaurant', description: 'Food order', date: new Date() },
    { _id: 'txn_003', type: 'income', amount: 24, currency: 'GHS', department: 'pub', description: 'Drinks sale', date: new Date() },
    { _id: 'txn_004', type: 'expense', amount: 500, currency: 'GHS', department: 'administration', description: 'Staff salaries', date: new Date() }
  ],
  
  // Inventory
  inventory: [
    { _id: 'inv_001', name: 'Rice (50kg)', category: 'Food', quantity: 25, minStock: 10, unit: 'bags', supplier: 'Golden Harvest', cost: 180, currency: 'GHS' },
    { _id: 'inv_002', name: 'Cooking Oil (5L)', category: 'Food', quantity: 15, minStock: 8, unit: 'bottles', supplier: 'Frytol', cost: 45, currency: 'GHS' },
    { _id: 'inv_003', name: 'Toilet Paper', category: 'Supplies', quantity: 12, minStock: 20, unit: 'packs', supplier: 'Softcare', cost: 25, currency: 'GHS' },
    { _id: 'inv_004', name: 'Bed Sheets', category: 'Amenities', quantity: 30, minStock: 15, unit: 'sets', supplier: 'Hotel Linens Co', cost: 120, currency: 'GHS' },
    { _id: 'inv_005', name: 'Club Beer Crates', category: 'Beverages', quantity: 8, minStock: 12, unit: 'crates', supplier: 'Ghana Breweries', cost: 85, currency: 'GHS' }
  ],
  
  // Bookings
  bookings: [],
  
  // Orders  
  orders: []
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

  // Authentication check for protected routes
  const publicRoutes = ['GET /business/status'];
  const routeKey = `${req.method} ${req.url}`;
  
  if (!publicRoutes.includes(routeKey)) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    try {
      const token = authHeader.substring(7);
      jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.'
      });
    }
  }

  // Parse the URL to determine the module and action
  const urlPath = req.url.replace('/api/business', '').replace(/^\?.*/, '');
  const pathParts = urlPath.split('/').filter(part => part.length > 0);
  const [module, action] = pathParts;

  try {
    switch (module) {
      case 'hotel':
        return handleHotel(req, res, action);
      case 'restaurant':
        return handleRestaurant(req, res, action);
      case 'pub':
        return handlePub(req, res, action);
      case 'accounting':
        return handleAccounting(req, res, action);
      case 'inventory':
        return handleInventory(req, res, action);
      case 'status':
        return handleStatus(req, res);
      default:
        return res.status(404).json({
          success: false,
          message: 'Module not found. Available: hotel, restaurant, pub, accounting, inventory'
        });
    }
  } catch (error) {
    console.error('Business API error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
}

function handleStatus(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      message: 'Heritage 360 Buzz Business API',
      modules: {
        hotel: { rooms: businessData.rooms.length, bookings: businessData.bookings.length },
        restaurant: { menuItems: businessData.restaurantMenu.length, orders: businessData.orders.length },
        pub: { beverages: businessData.pubMenu.length },
        accounting: { transactions: businessData.transactions.length },
        inventory: { items: businessData.inventory.length, lowStock: businessData.inventory.filter(item => item.quantity <= item.minStock).length }
      },
      timestamp: new Date().toISOString()
    });
  }
  return res.status(405).json({ success: false, message: 'Method not allowed' });
}

function handleHotel(req, res, action) {
  if (action === 'rooms') {
    if (req.method === 'GET') {
      return res.status(200).json({
        success: true,
        count: businessData.rooms.length,
        data: businessData.rooms
      });
    }
  }
  
  if (action === 'bookings') {
    if (req.method === 'GET') {
      return res.status(200).json({
        success: true,
        count: businessData.bookings.length,
        data: businessData.bookings
      });
    }
  }
  
  return res.status(404).json({ success: false, message: 'Hotel endpoint not found' });
}

function handleRestaurant(req, res, action) {
  if (action === 'menu') {
    if (req.method === 'GET') {
      return res.status(200).json({
        success: true,
        count: businessData.restaurantMenu.length,
        data: businessData.restaurantMenu,
        categories: ['Local', 'Continental', 'Beverages', 'Desserts']
      });
    }
  }
  
  if (action === 'orders') {
    if (req.method === 'GET') {
      return res.status(200).json({
        success: true,
        count: businessData.orders.length,
        data: businessData.orders
      });
    }
  }
  
  return res.status(404).json({ success: false, message: 'Restaurant endpoint not found' });
}

function handlePub(req, res, action) {
  if (action === 'menu') {
    if (req.method === 'GET') {
      const lowStockCount = businessData.pubMenu.filter(item => item.stock < 10).length;
      return res.status(200).json({
        success: true,
        count: businessData.pubMenu.length,
        data: businessData.pubMenu,
        categories: ['Local', 'International', 'Wine', 'Cocktails'],
        lowStockCount
      });
    }
  }
  
  return res.status(404).json({ success: false, message: 'Pub endpoint not found' });
}

function handleAccounting(req, res, action) {
  if (action === 'transactions') {
    if (req.method === 'GET') {
      const summary = {
        totalIncome: {
          USD: businessData.transactions.filter(t => t.type === 'income' && t.currency === 'USD').reduce((sum, t) => sum + t.amount, 0),
          GHS: businessData.transactions.filter(t => t.type === 'income' && t.currency === 'GHS').reduce((sum, t) => sum + t.amount, 0)
        },
        totalExpenses: {
          USD: businessData.transactions.filter(t => t.type === 'expense' && t.currency === 'USD').reduce((sum, t) => sum + t.amount, 0),
          GHS: businessData.transactions.filter(t => t.type === 'expense' && t.currency === 'GHS').reduce((sum, t) => sum + t.amount, 0)
        }
      };
      
      return res.status(200).json({
        success: true,
        count: businessData.transactions.length,
        data: businessData.transactions.sort((a, b) => new Date(b.date) - new Date(a.date)),
        summary
      });
    }
  }
  
  return res.status(404).json({ success: false, message: 'Accounting endpoint not found' });
}

function handleInventory(req, res, action) {
  if (action === 'items') {
    if (req.method === 'GET') {
      const lowStockItems = businessData.inventory.filter(item => item.quantity <= item.minStock);
      const alerts = {
        lowStock: lowStockItems.length,
        outOfStock: businessData.inventory.filter(item => item.quantity === 0).length,
        totalValue: businessData.inventory.reduce((sum, item) => sum + (item.quantity * item.cost), 0)
      };
      
      return res.status(200).json({
        success: true,
        count: businessData.inventory.length,
        data: businessData.inventory,
        alerts,
        lowStockItems: lowStockItems.map(item => ({
          name: item.name,
          quantity: item.quantity,
          minStock: item.minStock
        }))
      });
    }
  }
  
  return res.status(404).json({ success: false, message: 'Inventory endpoint not found' });
}