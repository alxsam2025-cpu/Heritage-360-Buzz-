const express = require('express');
const Inventory = require('../models/Inventory');
const { checkDepartment, checkPermission } = require('../middleware/auth');

const router = express.Router();

// @desc    Get inventory items
// @route   GET /api/inventory/items
// @access  Private (Store department)
router.get('/items', checkDepartment(['store', 'all']), async (req, res) => {
  try {
    const { category, lowStock, page = 1, limit = 10 } = req.query;
    
    let filter = {};
    if (category) filter.category = category;
    if (lowStock === 'true') {
      filter.$expr = { $lte: ['$currentStock', '$minimumStock'] };
    }

    const items = await Inventory.find(filter)
      .populate('createdBy', 'name username')
      .sort({ name: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Inventory.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: items.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: items
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Create inventory item
// @route   POST /api/inventory/items
// @access  Private (Store department)
router.post('/items',
  checkDepartment(['store', 'all']),
  checkPermission('store', 'create'),
  async (req, res) => {
    try {
      const itemData = {
        ...req.body,
        createdBy: req.user._id
      };

      const item = await Inventory.create(itemData);

      res.status(201).json({
        success: true,
        data: item
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
);

// @desc    Get alerts
// @route   GET /api/inventory/alerts
// @access  Private (Store department)
router.get('/alerts', checkDepartment(['store', 'all']), async (req, res) => {
  try {
    const items = await Inventory.find({
      'alerts.isActive': true
    }).select('name alerts itemCode category');

    const alerts = [];
    items.forEach(item => {
      item.alerts.filter(alert => alert.isActive).forEach(alert => {
        alerts.push({
          itemId: item._id,
          itemName: item.name,
          itemCode: item.itemCode,
          category: item.category,
          alertType: alert.type,
          message: alert.message,
          createdAt: alert.createdAt
        });
      });
    });

    res.status(200).json({
      success: true,
      count: alerts.length,
      data: alerts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;