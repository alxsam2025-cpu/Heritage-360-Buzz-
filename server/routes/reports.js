const express = require('express');
const HotelBooking = require('../models/HotelBooking');
const RestaurantOrder = require('../models/RestaurantOrder');
const Transaction = require('../models/Transaction');
const { checkPermission } = require('../middleware/auth');

const router = express.Router();

// @desc    Get dashboard overview
// @route   GET /api/reports/dashboard
// @access  Private (Manager/Admin)
router.get('/dashboard', checkPermission('reports', 'read'), async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    // Hotel statistics
    const totalBookingsToday = await HotelBooking.countDocuments({
      createdAt: { $gte: startOfDay, $lte: endOfDay }
    });

    const activeBookings = await HotelBooking.countDocuments({
      status: { $in: ['confirmed', 'checked_in'] }
    });

    // Restaurant statistics
    const restaurantOrdersToday = await RestaurantOrder.countDocuments({
      orderTime: { $gte: startOfDay, $lte: endOfDay }
    });

    // Revenue statistics
    const todaysRevenue = await Transaction.aggregate([
      {
        $match: {
          type: 'income',
          status: 'completed',
          transactionDate: { $gte: startOfDay, $lte: endOfDay }
        }
      },
      {
        $group: {
          _id: null,
          totalUSD: {
            $sum: {
              $cond: [{ $eq: ['$currency', 'USD'] }, '$amount', 0]
            }
          },
          totalGHS: {
            $sum: {
              $cond: [{ $eq: ['$currency', 'GHS'] }, '$amount', 0]
            }
          }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        hotel: {
          bookingsToday: totalBookingsToday,
          activeBookings: activeBookings
        },
        restaurant: {
          ordersToday: restaurantOrdersToday
        },
        revenue: {
          today: todaysRevenue[0] || { totalUSD: 0, totalGHS: 0 }
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Get revenue report
// @route   GET /api/reports/revenue
// @access  Private (Manager/Admin/Accountant)
router.get('/revenue', checkPermission('reports', 'read'), async (req, res) => {
  try {
    const { startDate, endDate, department } = req.query;
    
    let filter = {
      type: 'income',
      status: 'completed'
    };

    if (startDate && endDate) {
      filter.transactionDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    if (department) {
      filter.departmentSource = department;
    }

    const revenueData = await Transaction.aggregate([
      { $match: filter },
      {
        $group: {
          _id: {
            department: '$departmentSource',
            currency: '$currency'
          },
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: '$_id.department',
          currencies: {
            $push: {
              currency: '$_id.currency',
              amount: '$totalAmount',
              count: '$count'
            }
          }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: revenueData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;