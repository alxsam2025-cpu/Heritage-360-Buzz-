const express = require('express');
const Menu = require('../models/Menu');
const RestaurantOrder = require('../models/RestaurantOrder');
const { checkDepartment, checkPermission } = require('../middleware/auth');

const router = express.Router();

// @desc    Get menu
// @route   GET /api/restaurant/menu
// @access  Private (Restaurant department)
router.get('/menu', checkDepartment(['restaurant', 'all']), async (req, res) => {
  try {
    const menu = await Menu.findOne().populate('items.createdBy', 'name');
    
    res.status(200).json({
      success: true,
      data: menu
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Get orders
// @route   GET /api/restaurant/orders
// @access  Private (Restaurant department)
router.get('/orders', checkDepartment(['restaurant', 'all']), async (req, res) => {
  try {
    const { status, orderType, page = 1, limit = 10 } = req.query;
    
    let filter = {};
    if (status) filter.status = status;
    if (orderType) filter.orderType = orderType;

    const orders = await RestaurantOrder.find(filter)
      .populate('createdBy', 'name username')
      .populate('waiterAssigned', 'name')
      .sort({ orderTime: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await RestaurantOrder.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Create order
// @route   POST /api/restaurant/orders
// @access  Private (Restaurant department)
router.post('/orders', 
  checkDepartment(['restaurant', 'all']),
  checkPermission('restaurant', 'create'),
  async (req, res) => {
    try {
      const orderData = {
        ...req.body,
        createdBy: req.user._id
      };

      const order = await RestaurantOrder.create(orderData);

      res.status(201).json({
        success: true,
        data: order
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