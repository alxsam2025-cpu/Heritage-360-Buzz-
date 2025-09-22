import { demoRooms, demoDatabase } from '../demo-data.js';
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
      // Get all rooms
      return res.status(200).json({
        success: true,
        count: demoDatabase.rooms.length,
        data: demoDatabase.rooms
      });

    case 'POST':
      // Create new room
      const { number, type, rate, currency = 'USD', floor } = req.body;
      
      if (!number || !type || !rate) {
        return res.status(400).json({
          success: false,
          message: 'Please provide room number, type, and rate'
        });
      }

      const newRoom = {
        _id: `room_${Date.now()}`,
        number,
        type,
        rate: parseFloat(rate),
        currency,
        status: 'Available',
        floor: floor || 1,
        createdAt: new Date()
      };

      demoDatabase.rooms.push(newRoom);

      return res.status(201).json({
        success: true,
        data: newRoom,
        message: 'Room created successfully'
      });

    case 'PUT':
      // Update room (requires room ID in query)
      const { id } = req.query;
      const updateData = req.body;
      
      const roomIndex = demoDatabase.rooms.findIndex(room => room._id === id);
      
      if (roomIndex === -1) {
        return res.status(404).json({
          success: false,
          message: 'Room not found'
        });
      }

      demoDatabase.rooms[roomIndex] = {
        ...demoDatabase.rooms[roomIndex],
        ...updateData,
        updatedAt: new Date()
      };

      return res.status(200).json({
        success: true,
        data: demoDatabase.rooms[roomIndex],
        message: 'Room updated successfully'
      });

    default:
      return res.status(405).json({
        success: false,
        message: 'Method not allowed'
      });
  }
}