const express = require('express');
const Transaction = require('../models/Transaction');
const { checkDepartment, checkPermission } = require('../middleware/auth');

const router = express.Router();

// @desc    Get transactions
// @route   GET /api/accounting/transactions
// @access  Private (Accounting department)
router.get('/transactions', checkDepartment(['accounting', 'all']), async (req, res) => {
  try {
    const { 
      type, 
      category, 
      departmentSource, 
      status,
      startDate,
      endDate,
      page = 1, 
      limit = 10 
    } = req.query;
    
    let filter = {};
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (departmentSource) filter.departmentSource = departmentSource;
    if (status) filter.status = status;
    
    if (startDate || endDate) {
      filter.transactionDate = {};
      if (startDate) filter.transactionDate.$gte = new Date(startDate);
      if (endDate) filter.transactionDate.$lte = new Date(endDate);
    }

    const transactions = await Transaction.find(filter)
      .populate('createdBy', 'name username')
      .populate('approvedBy', 'name username')
      .sort({ transactionDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Transaction.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: transactions.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: transactions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Create transaction
// @route   POST /api/accounting/transactions
// @access  Private (Accounting department)
router.post('/transactions',
  checkDepartment(['accounting', 'all']),
  checkPermission('accounting', 'create'),
  async (req, res) => {
    try {
      const transactionData = {
        ...req.body,
        createdBy: req.user._id
      };

      const transaction = await Transaction.create(transactionData);

      res.status(201).json({
        success: true,
        data: transaction
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
);

module.exports = router;