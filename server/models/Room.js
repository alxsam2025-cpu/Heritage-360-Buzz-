const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomNumber: {
    type: String,
    required: [true, 'Room number is required'],
    unique: true,
    trim: true
  },
  roomType: {
    type: String,
    enum: ['Double', 'Executive', 'Master'],
    required: [true, 'Room type is required']
  },
  floor: {
    type: Number,
    required: [true, 'Floor number is required']
  },
  baseRate: {
    type: Number,
    required: [true, 'Base rate is required']
  },
  currency: {
    type: String,
    default: 'USD'
  },
  capacity: {
    adults: {
      type: Number,
      required: true
    },
    children: {
      type: Number,
      default: 0
    }
  },
  amenities: [{
    type: String,
    enum: [
      'air_conditioning', 'wifi', 'tv', 'minibar', 'safe', 'balcony',
      'sea_view', 'city_view', 'bathroom', 'shower', 'bathtub',
      'room_service', 'breakfast', 'parking', 'gym_access'
    ]
  }],
  status: {
    type: String,
    enum: ['available', 'occupied', 'maintenance', 'out_of_order', 'cleaning'],
    default: 'available'
  },
  housekeeping: {
    lastCleaned: Date,
    cleanedBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    cleaningStatus: {
      type: String,
      enum: ['clean', 'dirty', 'in_progress', 'inspected'],
      default: 'clean'
    }
  },
  maintenance: [{
    issue: {
      type: String,
      required: true
    },
    reportedBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
    reportedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed'],
      default: 'pending'
    },
    resolvedBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    resolvedAt: Date,
    cost: Number,
    notes: String
  }],
  description: String,
  images: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Set base rate based on room type
roomSchema.pre('save', function(next) {
  if (this.isNew || this.isModified('roomType')) {
    switch (this.roomType) {
      case 'Double':
        this.baseRate = process.env.DOUBLE_ROOM_RATE || 40;
        break;
      case 'Executive':
        this.baseRate = process.env.EXECUTIVE_ROOM_RATE || 60;
        break;
      case 'Master':
        this.baseRate = process.env.MASTER_ROOM_RATE || 120;
        break;
    }
  }
  
  this.updatedAt = Date.now();
  next();
});

// Index for efficient queries
roomSchema.index({ roomNumber: 1 });
roomSchema.index({ roomType: 1, status: 1 });
roomSchema.index({ floor: 1 });

module.exports = mongoose.model('Room', roomSchema);