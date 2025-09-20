const mongoose = require('mongoose');

const hotelBookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    unique: true,
    required: true
  },
  guestInfo: {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required']
    },
    idType: {
      type: String,
      enum: ['passport', 'national_id', 'drivers_license'],
      required: true
    },
    idNumber: {
      type: String,
      required: [true, 'ID number is required']
    },
    nationality: {
      type: String,
      required: true
    },
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      zipCode: String
    }
  },
  roomDetails: {
    roomType: {
      type: String,
      enum: ['Double', 'Executive', 'Master'],
      required: [true, 'Room type is required']
    },
    roomNumber: {
      type: String,
      required: [true, 'Room number is required']
    },
    rate: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'USD'
    }
  },
  bookingDates: {
    checkIn: {
      type: Date,
      required: [true, 'Check-in date is required']
    },
    checkOut: {
      type: Date,
      required: [true, 'Check-out date is required']
    },
    nights: {
      type: Number,
      required: true
    }
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled', 'no_show'],
    default: 'pending'
  },
  payment: {
    totalAmount: {
      type: Number,
      required: true
    },
    depositAmount: {
      type: Number,
      default: 0
    },
    balanceAmount: {
      type: Number,
      required: true
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'partial', 'paid', 'refunded'],
      default: 'unpaid'
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'card', 'mobile_money', 'bank_transfer', 'online']
    },
    transactions: [{
      transactionId: String,
      amount: Number,
      method: String,
      date: { type: Date, default: Date.now },
      reference: String
    }]
  },
  specialRequests: {
    type: String
  },
  source: {
    type: String,
    enum: ['walk_in', 'phone', 'email', 'online', 'agent'],
    default: 'walk_in'
  },
  assignedTo: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
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
  notes: [{
    note: String,
    addedBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Generate booking ID
hotelBookingSchema.pre('save', function(next) {
  if (this.isNew) {
    const now = new Date();
    const year = now.getFullYear().toString().substr(-2);
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.bookingId = `HB${year}${month}${day}${random}`;
  }
  
  this.updatedAt = Date.now();
  next();
});

// Calculate nights
hotelBookingSchema.pre('save', function(next) {
  if (this.bookingDates.checkIn && this.bookingDates.checkOut) {
    const diffTime = Math.abs(this.bookingDates.checkOut - this.bookingDates.checkIn);
    this.bookingDates.nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Calculate total amount
    this.payment.totalAmount = this.roomDetails.rate * this.bookingDates.nights;
    this.payment.balanceAmount = this.payment.totalAmount - this.payment.depositAmount;
  }
  next();
});

module.exports = mongoose.model('HotelBooking', hotelBookingSchema);