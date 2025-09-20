const express = require('express');
const PubMenu = require('../models/PubMenu');
const { checkDepartment, checkPermission } = require('../middleware/auth');

const router = express.Router();

// @desc    Get pub menu
// @route   GET /api/pub/menu
// @access  Private (Pub department)
router.get('/menu', checkDepartment(['pub', 'all']), async (req, res) => {
  try {
    const { category, type, isAvailable } = req.query;
    
    let filter = {};
    if (category) filter['items.category'] = category;
    if (type) filter['items.type'] = type;
    if (isAvailable) filter['items.availability.isAvailable'] = isAvailable === 'true';

    const menu = await PubMenu.findOne().populate('items.createdBy', 'name');
    
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

// @desc    Add drink to menu
// @route   POST /api/pub/menu/items
// @access  Private (Pub department with create permission)
router.post('/menu/items', 
  checkDepartment(['pub', 'all']),
  checkPermission('pub', 'create'),
  async (req, res) => {
    try {
      let menu = await PubMenu.findOne();
      
      if (!menu) {
        menu = new PubMenu({ items: [] });
      }

      const newItem = {
        ...req.body,
        createdBy: req.user._id
      };

      menu.items.push(newItem);
      await menu.save();

      res.status(201).json({
        success: true,
        data: menu.items[menu.items.length - 1]
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