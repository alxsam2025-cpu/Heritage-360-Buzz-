const express = require('express');
const Room = require('../models/Room');
const HotelBooking = require('../models/HotelBooking');
const { checkPermission, checkDepartment } = require('../middleware/auth');

const router = express.Router();

// ROOM MANAGEMENT ROUTES

// @desc    Get all rooms
// @route   GET /api/hotel/rooms
// @access  Private (Hotel department)
router.get('/rooms', checkDepartment(['hotel', 'all']), async (req, res) => {
  try {
    const { status, roomType, floor, isActive } = req.query;
    
    let filter = {};
    if (status) filter.status = status;
    if (roomType) filter.roomType = roomType;
    if (floor) filter.floor = parseInt(floor);
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const rooms = await Room.find(filter)
      .populate('createdBy', 'name username')
      .populate('updatedBy', 'name username')
      .sort({ roomNumber: 1 });

    res.status(200).json({
      success: true,
      count: rooms.length,
      data: rooms
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Get single room
// @route   GET /api/hotel/rooms/:id
// @access  Private (Hotel department)
router.get('/rooms/:id', checkDepartment(['hotel', 'all']), async (req, res) => {
  try {
    const room = await Room.findById(req.params.id)
      .populate('createdBy', 'name username')
      .populate('updatedBy', 'name username');

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    res.status(200).json({
      success: true,
      data: room
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Create room
// @route   POST /api/hotel/rooms
// @access  Private (Hotel department with create permission)
router.post('/rooms', 
  checkDepartment(['hotel', 'all']), 
  checkPermission('hotel', 'create'), 
  async (req, res) => {
    try {
      const roomData = {
        ...req.body,
        createdBy: req.user._id
      };

      const room = await Room.create(roomData);

      res.status(201).json({
        success: true,
        data: room
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
);

// @desc    Update room
// @route   PUT /api/hotel/rooms/:id
// @access  Private (Hotel department with update permission)
router.put('/rooms/:id', 
  checkDepartment(['hotel', 'all']), 
  checkPermission('hotel', 'update'), 
  async (req, res) => {
    try {
      const room = await Room.findByIdAndUpdate(
        req.params.id,
        { ...req.body, updatedBy: req.user._id },
        { new: true, runValidators: true }
      );

      if (!room) {
        return res.status(404).json({
          success: false,
          message: 'Room not found'
        });
      }

      res.status(200).json({
        success: true,
        data: room
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
);

// @desc    Delete room
// @route   DELETE /api/hotel/rooms/:id
// @access  Private (Admin only)
router.delete('/rooms/:id', checkPermission('hotel', 'delete'), async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    await room.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Room deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// BOOKING MANAGEMENT ROUTES

// @desc    Get all bookings
// @route   GET /api/hotel/bookings
// @access  Private (Hotel department)
router.get('/bookings', checkDepartment(['hotel', 'all']), async (req, res) => {
  try {
    const { 
      status, 
      roomType, 
      checkIn, 
      checkOut, 
      page = 1, 
      limit = 10,
      search 
    } = req.query;

    let filter = {};
    
    if (status) filter.status = status;
    if (roomType) filter['roomDetails.roomType'] = roomType;
    if (search) {
      filter.$or = [
        { 'guestInfo.firstName': { $regex: search, $options: 'i' } },
        { 'guestInfo.lastName': { $regex: search, $options: 'i' } },
        { 'guestInfo.email': { $regex: search, $options: 'i' } },
        { bookingId: { $regex: search, $options: 'i' } }
      ];
    }

    if (checkIn || checkOut) {
      filter['bookingDates'] = {};
      if (checkIn) filter['bookingDates.checkIn'] = { $gte: new Date(checkIn) };
      if (checkOut) filter['bookingDates.checkOut'] = { $lte: new Date(checkOut) };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const bookings = await HotelBooking.find(filter)
      .populate('createdBy', 'name username')
      .populate('assignedTo', 'name username')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await HotelBooking.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: bookings.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Get single booking
// @route   GET /api/hotel/bookings/:id
// @access  Private (Hotel department)
router.get('/bookings/:id', checkDepartment(['hotel', 'all']), async (req, res) => {
  try {
    const booking = await HotelBooking.findById(req.params.id)
      .populate('createdBy', 'name username')
      .populate('assignedTo', 'name username')
      .populate('updatedBy', 'name username');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Create booking
// @route   POST /api/hotel/bookings
// @access  Private (Hotel department with create permission)
router.post('/bookings', 
  checkDepartment(['hotel', 'all']), 
  checkPermission('hotel', 'create'), 
  async (req, res) => {
    try {
      // Check room availability
      const { roomDetails, bookingDates } = req.body;
      
      const conflictingBookings = await HotelBooking.find({
        'roomDetails.roomNumber': roomDetails.roomNumber,
        status: { $in: ['confirmed', 'checked_in'] },
        $or: [
          {
            'bookingDates.checkIn': { 
              $gte: new Date(bookingDates.checkIn),
              $lt: new Date(bookingDates.checkOut)
            }
          },
          {
            'bookingDates.checkOut': {
              $gt: new Date(bookingDates.checkIn),
              $lte: new Date(bookingDates.checkOut)
            }
          },
          {
            'bookingDates.checkIn': { $lte: new Date(bookingDates.checkIn) },
            'bookingDates.checkOut': { $gte: new Date(bookingDates.checkOut) }
          }
        ]
      });

      if (conflictingBookings.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Room is not available for the selected dates'
        });
      }

      const bookingData = {
        ...req.body,
        createdBy: req.user._id
      };

      const booking = await HotelBooking.create(bookingData);

      res.status(201).json({
        success: true,
        data: booking
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
);

// @desc    Update booking
// @route   PUT /api/hotel/bookings/:id
// @access  Private (Hotel department with update permission)
router.put('/bookings/:id', 
  checkDepartment(['hotel', 'all']), 
  checkPermission('hotel', 'update'), 
  async (req, res) => {
    try {
      const booking = await HotelBooking.findByIdAndUpdate(
        req.params.id,
        { ...req.body, updatedBy: req.user._id },
        { new: true, runValidators: true }
      );

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }

      res.status(200).json({
        success: true,
        data: booking
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
);

// @desc    Check-in guest
// @route   PUT /api/hotel/bookings/:id/checkin
// @access  Private (Hotel department)
router.put('/bookings/:id/checkin', checkDepartment(['hotel', 'all']), async (req, res) => {
  try {
    const booking = await HotelBooking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.status !== 'confirmed') {
      return res.status(400).json({
        success: false,
        message: 'Booking must be confirmed before check-in'
      });
    }

    booking.status = 'checked_in';
    booking.updatedBy = req.user._id;
    await booking.save();

    // Update room status to occupied
    await Room.findOneAndUpdate(
      { roomNumber: booking.roomDetails.roomNumber },
      { status: 'occupied', updatedBy: req.user._id }
    );

    res.status(200).json({
      success: true,
      data: booking,
      message: 'Guest checked in successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Check-out guest
// @route   PUT /api/hotel/bookings/:id/checkout
// @access  Private (Hotel department)
router.put('/bookings/:id/checkout', checkDepartment(['hotel', 'all']), async (req, res) => {
  try {
    const booking = await HotelBooking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.status !== 'checked_in') {
      return res.status(400).json({
        success: false,
        message: 'Guest must be checked in before checkout'
      });
    }

    booking.status = 'checked_out';
    booking.updatedBy = req.user._id;
    await booking.save();

    // Update room status to cleaning
    await Room.findOneAndUpdate(
      { roomNumber: booking.roomDetails.roomNumber },
      { 
        status: 'cleaning',
        'housekeeping.cleaningStatus': 'dirty',
        updatedBy: req.user._id 
      }
    );

    res.status(200).json({
      success: true,
      data: booking,
      message: 'Guest checked out successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Get room availability
// @route   GET /api/hotel/availability
// @access  Private (Hotel department)
router.get('/availability', checkDepartment(['hotel', 'all']), async (req, res) => {
  try {
    const { checkIn, checkOut, roomType } = req.query;

    if (!checkIn || !checkOut) {
      return res.status(400).json({
        success: false,
        message: 'Check-in and check-out dates are required'
      });
    }

    let roomFilter = { isActive: true, status: { $ne: 'out_of_order' } };
    if (roomType) roomFilter.roomType = roomType;

    const allRooms = await Room.find(roomFilter);

    const bookedRooms = await HotelBooking.find({
      status: { $in: ['confirmed', 'checked_in'] },
      $or: [
        {
          'bookingDates.checkIn': {
            $gte: new Date(checkIn),
            $lt: new Date(checkOut)
          }
        },
        {
          'bookingDates.checkOut': {
            $gt: new Date(checkIn),
            $lte: new Date(checkOut)
          }
        },
        {
          'bookingDates.checkIn': { $lte: new Date(checkIn) },
          'bookingDates.checkOut': { $gte: new Date(checkOut) }
        }
      ]
    }).select('roomDetails.roomNumber');

    const bookedRoomNumbers = bookedRooms.map(booking => booking.roomDetails.roomNumber);
    const availableRooms = allRooms.filter(room => !bookedRoomNumbers.includes(room.roomNumber));

    res.status(200).json({
      success: true,
      data: {
        availableRooms,
        totalAvailable: availableRooms.length,
        totalRooms: allRooms.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;