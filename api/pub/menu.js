import jwt from 'jsonwebtoken';

// Demo pub menu data
let pubMenu = [
  { _id: 'pub_001', name: 'Club Beer', price: 8, currency: 'GHS', category: 'Local', stock: 50, available: true, createdAt: new Date('2025-01-01') },
  { _id: 'pub_002', name: 'Guinness', price: 12, currency: 'GHS', category: 'International', stock: 30, available: true, createdAt: new Date('2025-01-01') },
  { _id: 'pub_003', name: 'Akpeteshie', price: 15, currency: 'GHS', category: 'Local', stock: 25, available: true, createdAt: new Date('2025-01-01') },
  { _id: 'pub_004', name: 'Whiskey', price: 80, currency: 'GHS', category: 'International', stock: 10, available: true, createdAt: new Date('2025-01-01') },
  { _id: 'pub_005', name: 'Star Beer', price: 7, currency: 'GHS', category: 'Local', stock: 45, available: true, createdAt: new Date('2025-01-01') },
  { _id: 'pub_006', name: 'Hennessy', price: 150, currency: 'GHS', category: 'International', stock: 5, available: true, createdAt: new Date('2025-01-01') }
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
      // Get pub menu with stock levels
      const { category, lowStock } = req.query;
      let beverages = demoDatabase.pubMenu;
      
      if (category) {
        beverages = beverages.filter(item => 
          item.category.toLowerCase() === category.toLowerCase()
        );
      }
      
      if (lowStock === 'true') {
        beverages = beverages.filter(item => item.stock < 10);
      }

      return res.status(200).json({
        success: true,
        count: beverages.length,
        data: beverages,
        categories: ['Local', 'International', 'Wine', 'Cocktails', 'Non-Alcoholic'],
        lowStockCount: demoDatabase.pubMenu.filter(item => item.stock < 10).length
      });

    case 'POST':
      // Add beverage item
      const { 
        name, 
        price, 
        currency = 'GHS', 
        category, 
        stock = 0, 
        description,
        alcoholContent = 0 
      } = req.body;
      
      if (!name || !price || !category) {
        return res.status(400).json({
          success: false,
          message: 'Please provide beverage name, price, and category'
        });
      }

      const newBeverage = {
        _id: `pub_${Date.now()}`,
        name,
        price: parseFloat(price),
        currency,
        category,
        stock: parseInt(stock),
        description: description || '',
        alcoholContent: parseFloat(alcoholContent),
        available: parseInt(stock) > 0,
        createdAt: new Date()
      };

      demoDatabase.pubMenu.push(newBeverage);

      return res.status(201).json({
        success: true,
        data: newBeverage,
        message: 'Beverage added successfully'
      });

    case 'PUT':
      // Update beverage or adjust stock
      const { id } = req.query;
      const updateData = req.body;
      
      const beverageIndex = demoDatabase.pubMenu.findIndex(item => item._id === id);
      
      if (beverageIndex === -1) {
        return res.status(404).json({
          success: false,
          message: 'Beverage not found'
        });
      }

      // Special handling for stock adjustment
      if (updateData.stockAdjustment) {
        const currentStock = demoDatabase.pubMenu[beverageIndex].stock;
        const newStock = currentStock + parseInt(updateData.stockAdjustment);
        
        demoDatabase.pubMenu[beverageIndex].stock = Math.max(0, newStock);
        demoDatabase.pubMenu[beverageIndex].available = newStock > 0;
        demoDatabase.pubMenu[beverageIndex].lastStockUpdate = new Date();
        
        return res.status(200).json({
          success: true,
          data: demoDatabase.pubMenu[beverageIndex],
          message: `Stock ${updateData.stockAdjustment > 0 ? 'added' : 'reduced'} successfully`
        });
      }

      // Regular update
      demoDatabase.pubMenu[beverageIndex] = {
        ...demoDatabase.pubMenu[beverageIndex],
        ...updateData,
        available: updateData.stock !== undefined ? updateData.stock > 0 : demoDatabase.pubMenu[beverageIndex].available,
        updatedAt: new Date()
      };

      return res.status(200).json({
        success: true,
        data: demoDatabase.pubMenu[beverageIndex],
        message: 'Beverage updated successfully'
      });

    case 'DELETE':
      // Delete beverage item
      const { id: deleteId } = req.query;
      
      const deleteIndex = demoDatabase.pubMenu.findIndex(item => item._id === deleteId);
      
      if (deleteIndex === -1) {
        return res.status(404).json({
          success: false,
          message: 'Beverage not found'
        });
      }

      const deletedBeverage = demoDatabase.pubMenu.splice(deleteIndex, 1)[0];

      return res.status(200).json({
        success: true,
        data: deletedBeverage,
        message: 'Beverage deleted successfully'
      });

    default:
      return res.status(405).json({
        success: false,
        message: 'Method not allowed'
      });
  }
}