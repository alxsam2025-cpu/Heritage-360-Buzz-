import jwt from 'jsonwebtoken';

// Demo restaurant menu data
let restaurantMenu = [
  { _id: 'menu_001', name: 'Jollof Rice', price: 25, currency: 'GHS', category: 'Local', available: true, createdAt: new Date('2025-01-01') },
  { _id: 'menu_002', name: 'Fried Chicken', price: 30, currency: 'GHS', category: 'Continental', available: true, createdAt: new Date('2025-01-01') },
  { _id: 'menu_003', name: 'Banku with Tilapia', price: 35, currency: 'GHS', category: 'Local', available: true, createdAt: new Date('2025-01-01') },
  { _id: 'menu_004', name: 'Pizza Margherita', price: 45, currency: 'GHS', category: 'Continental', available: true, createdAt: new Date('2025-01-01') },
  { _id: 'menu_005', name: 'Grilled Tilapia', price: 40, currency: 'GHS', category: 'Local', available: true, createdAt: new Date('2025-01-01') },
  { _id: 'menu_006', name: 'Chicken & Chips', price: 35, currency: 'GHS', category: 'Continental', available: true, createdAt: new Date('2025-01-01') }
];

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

  // Authentication check
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

  switch (req.method) {
    case 'GET':
      // Get restaurant menu
      const { category } = req.query;
      let menuItems = [...restaurantMenu];
      
      if (category) {
        menuItems = menuItems.filter(item => 
          item.category.toLowerCase() === category.toLowerCase()
        );
      }

      return res.status(200).json({
        success: true,
        count: menuItems.length,
        data: menuItems,
        categories: ['Local', 'Continental', 'Beverages', 'Desserts']
      });

    case 'POST':
      // Add menu item
      const { name, price, currency = 'GHS', category, description, available = true } = req.body;
      
      if (!name || !price || !category) {
        return res.status(400).json({
          success: false,
          message: 'Please provide item name, price, and category'
        });
      }

      const newMenuItem = {
        _id: `menu_${Date.now()}`,
        name,
        price: parseFloat(price),
        currency,
        category,
        description: description || '',
        available: Boolean(available),
        createdAt: new Date()
      };

      restaurantMenu.push(newMenuItem);

      return res.status(201).json({
        success: true,
        data: newMenuItem,
        message: 'Menu item added successfully'
      });

    case 'PUT':
      // Update menu item
      const { id } = req.query;
      const updateData = req.body;
      
      const itemIndex = restaurantMenu.findIndex(item => item._id === id);
      
      if (itemIndex === -1) {
        return res.status(404).json({
          success: false,
          message: 'Menu item not found'
        });
      }

      restaurantMenu[itemIndex] = {
        ...restaurantMenu[itemIndex],
        ...updateData,
        updatedAt: new Date()
      };

      return res.status(200).json({
        success: true,
        data: restaurantMenu[itemIndex],
        message: 'Menu item updated successfully'
      });

    case 'DELETE':
      // Delete menu item
      const { id: deleteId } = req.query;
      
      const deleteIndex = restaurantMenu.findIndex(item => item._id === deleteId);
      
      if (deleteIndex === -1) {
        return res.status(404).json({
          success: false,
          message: 'Menu item not found'
        });
      }

      const deletedItem = restaurantMenu.splice(deleteIndex, 1)[0];

      return res.status(200).json({
        success: true,
        data: deletedItem,
        message: 'Menu item deleted successfully'
      });

    default:
      return res.status(405).json({
        success: false,
        message: 'Method not allowed'
      });
  }
}