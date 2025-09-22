import { demoDatabase } from '../demo-data.js';
import jwt from 'jsonwebtoken';

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
      // Get all orders
      const { status, type } = req.query;
      let orders = demoDatabase.orders || [];
      
      if (status) {
        orders = orders.filter(order => order.status.toLowerCase() === status.toLowerCase());
      }
      
      if (type) {
        orders = orders.filter(order => order.type.toLowerCase() === type.toLowerCase());
      }

      return res.status(200).json({
        success: true,
        count: orders.length,
        data: orders
      });

    case 'POST':
      // Create new order
      const { 
        customerName, 
        customerPhone, 
        items, 
        type = 'dine-in', 
        tableNumber, 
        roomNumber 
      } = req.body;
      
      if (!customerName || !items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Please provide customer name and order items'
        });
      }

      // Calculate total amount
      let totalAmount = 0;
      const orderItems = [];

      for (const item of items) {
        const menuItem = demoDatabase.restaurantMenu.find(menu => menu._id === item.itemId);
        if (menuItem) {
          const itemTotal = menuItem.price * (item.quantity || 1);
          totalAmount += itemTotal;
          
          orderItems.push({
            itemId: menuItem._id,
            name: menuItem.name,
            price: menuItem.price,
            quantity: item.quantity || 1,
            total: itemTotal,
            specialInstructions: item.specialInstructions || ''
          });
        }
      }

      const newOrder = {
        _id: `order_${Date.now()}`,
        orderNumber: `RO${Date.now().toString().slice(-6)}`,
        customer: {
          name: customerName,
          phone: customerPhone
        },
        items: orderItems,
        type: type, // dine-in, takeaway, room-service
        tableNumber: tableNumber || null,
        roomNumber: roomNumber || null,
        payment: {
          subtotal: totalAmount,
          tax: totalAmount * 0.125, // 12.5% VAT
          serviceCharge: totalAmount * 0.10, // 10% service charge
          total: totalAmount * 1.225, // subtotal + tax + service charge
          currency: 'GHS',
          status: 'pending'
        },
        status: 'pending', // pending, preparing, ready, served, completed
        createdAt: new Date(),
        estimatedTime: 25 // minutes
      };

      // Initialize orders array if it doesn't exist
      if (!demoDatabase.orders) {
        demoDatabase.orders = [];
      }
      
      demoDatabase.orders.push(newOrder);

      // Add to transactions
      const transaction = {
        _id: `txn_${Date.now()}`,
        type: 'income',
        amount: newOrder.payment.total,
        currency: 'GHS',
        department: 'restaurant',
        description: `Restaurant order ${newOrder.orderNumber}`,
        orderId: newOrder._id,
        date: new Date(),
        status: 'pending'
      };
      
      demoDatabase.transactions.push(transaction);

      return res.status(201).json({
        success: true,
        data: newOrder,
        message: 'Order created successfully'
      });

    case 'PUT':
      // Update order status
      const { id } = req.query;
      const { status: newStatus, paymentStatus } = req.body;
      
      if (!demoDatabase.orders) {
        demoDatabase.orders = [];
      }
      
      const orderIndex = demoDatabase.orders.findIndex(order => order._id === id);
      
      if (orderIndex === -1) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      if (newStatus) {
        demoDatabase.orders[orderIndex].status = newStatus;
        demoDatabase.orders[orderIndex].updatedAt = new Date();
      }

      if (paymentStatus) {
        demoDatabase.orders[orderIndex].payment.status = paymentStatus;
        
        // Update transaction status
        const txnIndex = demoDatabase.transactions.findIndex(
          txn => txn.orderId === id
        );
        if (txnIndex !== -1) {
          demoDatabase.transactions[txnIndex].status = paymentStatus === 'paid' ? 'completed' : 'pending';
        }
      }

      return res.status(200).json({
        success: true,
        data: demoDatabase.orders[orderIndex],
        message: 'Order updated successfully'
      });

    default:
      return res.status(405).json({
        success: false,
        message: 'Method not allowed'
      });
  }
}