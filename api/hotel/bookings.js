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
      // Get all bookings
      return res.status(200).json({
        success: true,
        count: demoDatabase.bookings.length,
        data: demoDatabase.bookings
      });

    case 'POST':
      // Create new booking
      const { 
        guestName, 
        guestEmail, 
        guestPhone, 
        roomType, 
        checkIn, 
        checkOut, 
        guests = 1 
      } = req.body;
      
      if (!guestName || !guestEmail || !roomType || !checkIn || !checkOut) {
        return res.status(400).json({
          success: false,
          message: 'Please provide all required booking information'
        });
      }

      // Find available room of requested type
      const availableRoom = demoDatabase.rooms.find(
        room => room.type === roomType && room.status === 'Available'
      );

      if (!availableRoom) {
        return res.status(400).json({
          success: false,
          message: `No ${roomType} rooms available`
        });
      }

      // Calculate nights and total amount
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
      const totalAmount = nights * availableRoom.rate;

      const newBooking = {
        _id: `booking_${Date.now()}`,
        bookingId: `HB${Date.now().toString().slice(-6)}`,
        guest: {
          name: guestName,
          email: guestEmail,
          phone: guestPhone,
          guests: parseInt(guests)
        },
        room: {
          roomId: availableRoom._id,
          roomNumber: availableRoom.number,
          roomType: availableRoom.type,
          rate: availableRoom.rate
        },
        dates: {
          checkIn: checkInDate,
          checkOut: checkOutDate,
          nights
        },
        payment: {
          totalAmount,
          currency: 'USD',
          status: 'pending'
        },
        status: 'confirmed',
        createdAt: new Date()
      };

      // Update room status to occupied
      const roomIndex = demoDatabase.rooms.findIndex(room => room._id === availableRoom._id);
      demoDatabase.rooms[roomIndex].status = 'Occupied';

      demoDatabase.bookings.push(newBooking);

      return res.status(201).json({
        success: true,
        data: newBooking,
        message: 'Booking created successfully'
      });

    case 'PUT':
      // Update booking status (check-in/check-out)
      const { id } = req.query;
      const { action, status } = req.body;
      
      const bookingIndex = demoDatabase.bookings.findIndex(booking => booking._id === id);
      
      if (bookingIndex === -1) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }

      if (action === 'checkin') {
        demoDatabase.bookings[bookingIndex].status = 'checked_in';
        demoDatabase.bookings[bookingIndex].actualCheckIn = new Date();
      } else if (action === 'checkout') {
        demoDatabase.bookings[bookingIndex].status = 'checked_out';
        demoDatabase.bookings[bookingIndex].actualCheckOut = new Date();
        
        // Make room available again
        const roomId = demoDatabase.bookings[bookingIndex].room.roomId;
        const roomIndex = demoDatabase.rooms.findIndex(room => room._id === roomId);
        if (roomIndex !== -1) {
          demoDatabase.rooms[roomIndex].status = 'Cleaning';
          
          // Auto-set to available after "cleaning" (demo purposes)
          setTimeout(() => {
            if (demoDatabase.rooms[roomIndex]) {
              demoDatabase.rooms[roomIndex].status = 'Available';
            }
          }, 5000);
        }
      }

      return res.status(200).json({
        success: true,
        data: demoDatabase.bookings[bookingIndex],
        message: `Booking ${action} successful`
      });

    default:
      return res.status(405).json({
        success: false,
        message: 'Method not allowed'
      });
  }
}