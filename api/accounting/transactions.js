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
      // Get transactions with filtering
      const { department, type, currency, status, fromDate, toDate } = req.query;
      let transactions = [...demoDatabase.transactions];
      
      // Apply filters
      if (department) {
        transactions = transactions.filter(txn => txn.department === department);
      }
      
      if (type) {
        transactions = transactions.filter(txn => txn.type === type);
      }
      
      if (currency) {
        transactions = transactions.filter(txn => txn.currency === currency);
      }
      
      if (status) {
        transactions = transactions.filter(txn => txn.status === status);
      }
      
      if (fromDate) {
        const from = new Date(fromDate);
        transactions = transactions.filter(txn => new Date(txn.date) >= from);
      }
      
      if (toDate) {
        const to = new Date(toDate);
        transactions = transactions.filter(txn => new Date(txn.date) <= to);
      }

      // Calculate summary
      const summary = {
        totalTransactions: transactions.length,
        totalIncome: {
          USD: transactions.filter(t => t.type === 'income' && t.currency === 'USD').reduce((sum, t) => sum + t.amount, 0),
          GHS: transactions.filter(t => t.type === 'income' && t.currency === 'GHS').reduce((sum, t) => sum + t.amount, 0)
        },
        totalExpenses: {
          USD: transactions.filter(t => t.type === 'expense' && t.currency === 'USD').reduce((sum, t) => sum + t.amount, 0),
          GHS: transactions.filter(t => t.type === 'expense' && t.currency === 'GHS').reduce((sum, t) => sum + t.amount, 0)
        },
        byDepartment: {
          hotel: transactions.filter(t => t.department === 'hotel').length,
          restaurant: transactions.filter(t => t.department === 'restaurant').length,
          pub: transactions.filter(t => t.department === 'pub').length,
          administration: transactions.filter(t => t.department === 'administration').length
        }
      };

      return res.status(200).json({
        success: true,
        count: transactions.length,
        data: transactions.sort((a, b) => new Date(b.date) - new Date(a.date)),
        summary
      });

    case 'POST':
      // Create new transaction
      const { 
        type, 
        amount, 
        currency, 
        department, 
        description, 
        category,
        reference 
      } = req.body;
      
      if (!type || !amount || !currency || !department || !description) {
        return res.status(400).json({
          success: false,
          message: 'Please provide type, amount, currency, department, and description'
        });
      }

      const newTransaction = {
        _id: `txn_${Date.now()}`,
        transactionId: `TXN${Date.now().toString().slice(-8).toUpperCase()}`,
        type: type, // income, expense, transfer
        amount: parseFloat(amount),
        currency: currency, // USD, GHS
        department: department, // hotel, restaurant, pub, administration
        category: category || 'General',
        description: description,
        reference: reference || '',
        status: 'completed',
        date: new Date(),
        createdBy: 'demo_user', // In real app, get from token
        createdAt: new Date()
      };

      demoDatabase.transactions.push(newTransaction);

      return res.status(201).json({
        success: true,
        data: newTransaction,
        message: 'Transaction recorded successfully'
      });

    case 'PUT':
      // Update transaction
      const { id } = req.query;
      const updateData = req.body;
      
      const txnIndex = demoDatabase.transactions.findIndex(txn => txn._id === id);
      
      if (txnIndex === -1) {
        return res.status(404).json({
          success: false,
          message: 'Transaction not found'
        });
      }

      demoDatabase.transactions[txnIndex] = {
        ...demoDatabase.transactions[txnIndex],
        ...updateData,
        updatedAt: new Date()
      };

      return res.status(200).json({
        success: true,
        data: demoDatabase.transactions[txnIndex],
        message: 'Transaction updated successfully'
      });

    case 'DELETE':
      // Void transaction (don't actually delete, mark as voided)
      const { id: voidId } = req.query;
      const { reason } = req.body;
      
      const voidIndex = demoDatabase.transactions.findIndex(txn => txn._id === voidId);
      
      if (voidIndex === -1) {
        return res.status(404).json({
          success: false,
          message: 'Transaction not found'
        });
      }

      demoDatabase.transactions[voidIndex].status = 'voided';
      demoDatabase.transactions[voidIndex].voidReason = reason || 'No reason provided';
      demoDatabase.transactions[voidIndex].voidedAt = new Date();

      return res.status(200).json({
        success: true,
        data: demoDatabase.transactions[voidIndex],
        message: 'Transaction voided successfully'
      });

    default:
      return res.status(405).json({
        success: false,
        message: 'Method not allowed'
      });
  }
}