import { demoDatabase } from '../demo-data.js';
import jwt from 'jsonwebtoken';

// Initialize inventory if not exists
if (!demoDatabase.inventory) {
  demoDatabase.inventory = [
    { _id: 'inv_001', name: 'Rice (50kg)', category: 'Food', quantity: 25, minStock: 10, unit: 'bags', supplier: 'Golden Harvest', lastRestocked: new Date(), cost: 180, currency: 'GHS' },
    { _id: 'inv_002', name: 'Cooking Oil (5L)', category: 'Food', quantity: 15, minStock: 8, unit: 'bottles', supplier: 'Frytol', lastRestocked: new Date(), cost: 45, currency: 'GHS' },
    { _id: 'inv_003', name: 'Toilet Paper', category: 'Supplies', quantity: 12, minStock: 20, unit: 'packs', supplier: 'Softcare', lastRestocked: new Date(), cost: 25, currency: 'GHS' },
    { _id: 'inv_004', name: 'Bed Sheets', category: 'Amenities', quantity: 30, minStock: 15, unit: 'sets', supplier: 'Hotel Linens Co', lastRestocked: new Date(), cost: 120, currency: 'GHS' },
    { _id: 'inv_005', name: 'Club Beer Crates', category: 'Beverages', quantity: 8, minStock: 12, unit: 'crates', supplier: 'Ghana Breweries', lastRestocked: new Date(), cost: 85, currency: 'GHS' }
  ];
}

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
      // Get inventory items with alerts
      const { category, lowStock, search } = req.query;
      let items = [...demoDatabase.inventory];
      
      // Apply filters
      if (category) {
        items = items.filter(item => item.category.toLowerCase() === category.toLowerCase());
      }
      
      if (lowStock === 'true') {
        items = items.filter(item => item.quantity <= item.minStock);
      }
      
      if (search) {
        items = items.filter(item => 
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.supplier.toLowerCase().includes(search.toLowerCase())
        );
      }

      // Calculate alerts
      const lowStockItems = demoDatabase.inventory.filter(item => item.quantity <= item.minStock);
      const outOfStockItems = demoDatabase.inventory.filter(item => item.quantity === 0);
      
      const alerts = {
        lowStock: lowStockItems.length,
        outOfStock: outOfStockItems.length,
        totalValue: demoDatabase.inventory.reduce((sum, item) => sum + (item.quantity * item.cost), 0),
        categories: [...new Set(demoDatabase.inventory.map(item => item.category))]
      };

      return res.status(200).json({
        success: true,
        count: items.length,
        data: items,
        alerts,
        lowStockItems: lowStockItems.map(item => ({
          name: item.name,
          quantity: item.quantity,
          minStock: item.minStock,
          category: item.category
        }))
      });

    case 'POST':
      // Add inventory item
      const { 
        name, 
        category, 
        quantity, 
        minStock, 
        unit, 
        supplier, 
        cost, 
        currency = 'GHS',
        expiryDate,
        description 
      } = req.body;
      
      if (!name || !category || quantity === undefined || !unit || !supplier) {
        return res.status(400).json({
          success: false,
          message: 'Please provide name, category, quantity, unit, and supplier'
        });
      }

      const newItem = {
        _id: `inv_${Date.now()}`,
        name,
        category,
        quantity: parseInt(quantity),
        minStock: parseInt(minStock) || 5,
        unit,
        supplier,
        cost: parseFloat(cost) || 0,
        currency,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        description: description || '',
        lastRestocked: new Date(),
        createdAt: new Date()
      };

      demoDatabase.inventory.push(newItem);

      return res.status(201).json({
        success: true,
        data: newItem,
        message: 'Inventory item added successfully'
      });

    case 'PUT':
      // Update inventory item or adjust stock
      const { id } = req.query;
      const updateData = req.body;
      
      const itemIndex = demoDatabase.inventory.findIndex(item => item._id === id);
      
      if (itemIndex === -1) {
        return res.status(404).json({
          success: false,
          message: 'Inventory item not found'
        });
      }

      // Handle stock adjustment
      if (updateData.stockAdjustment !== undefined) {
        const currentQuantity = demoDatabase.inventory[itemIndex].quantity;
        const newQuantity = currentQuantity + parseInt(updateData.stockAdjustment);
        
        demoDatabase.inventory[itemIndex].quantity = Math.max(0, newQuantity);
        demoDatabase.inventory[itemIndex].lastUpdated = new Date();
        
        if (updateData.stockAdjustment > 0) {
          demoDatabase.inventory[itemIndex].lastRestocked = new Date();
        }
        
        // Create transaction record for stock adjustment
        const adjustmentTxn = {
          _id: `txn_${Date.now()}`,
          type: updateData.stockAdjustment > 0 ? 'expense' : 'adjustment',
          amount: Math.abs(updateData.stockAdjustment * demoDatabase.inventory[itemIndex].cost),
          currency: demoDatabase.inventory[itemIndex].currency,
          department: 'administration',
          description: `Inventory ${updateData.stockAdjustment > 0 ? 'restock' : 'adjustment'}: ${demoDatabase.inventory[itemIndex].name}`,
          category: 'Inventory',
          reference: updateData.reference || '',
          status: 'completed',
          date: new Date()
        };
        
        demoDatabase.transactions.push(adjustmentTxn);
        
        return res.status(200).json({
          success: true,
          data: demoDatabase.inventory[itemIndex],
          message: `Stock ${updateData.stockAdjustment > 0 ? 'added' : 'adjusted'} successfully`
        });
      }

      // Regular update
      demoDatabase.inventory[itemIndex] = {
        ...demoDatabase.inventory[itemIndex],
        ...updateData,
        updatedAt: new Date()
      };

      return res.status(200).json({
        success: true,
        data: demoDatabase.inventory[itemIndex],
        message: 'Inventory item updated successfully'
      });

    case 'DELETE':
      // Delete inventory item
      const { id: deleteId } = req.query;
      
      const deleteIndex = demoDatabase.inventory.findIndex(item => item._id === deleteId);
      
      if (deleteIndex === -1) {
        return res.status(404).json({
          success: false,
          message: 'Inventory item not found'
        });
      }

      const deletedItem = demoDatabase.inventory.splice(deleteIndex, 1)[0];

      return res.status(200).json({
        success: true,
        data: deletedItem,
        message: 'Inventory item deleted successfully'
      });

    default:
      return res.status(405).json({
        success: false,
        message: 'Method not allowed'
      });
  }
}