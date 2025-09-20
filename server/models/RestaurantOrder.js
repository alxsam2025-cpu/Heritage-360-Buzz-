const mongoose = require('mongoose');

const restaurantOrderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true,
    required: true
  },
  orderType: {
    type: String,
    enum: ['dine_in', 'takeaway', 'room_service'],
    required: [true, 'Order type is required']
  },
  tableNumber: {
    type: String,
    required: function() {
      return this.orderType === 'dine_in';
    }
  },
  roomNumber: {
    type: String,
    required: function() {
      return this.orderType === 'room_service';
    }
  },
  customerInfo: {
    name: String,
    phone: String,
    email: String,
    roomNumber: String // For hotel guests
  },
  items: [{
    menuItemId: {
      type: mongoose.Schema.ObjectId,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1']
    },
    specialInstructions: String,
    subtotal: {
      type: Number,
      required: true
    }
  }],
  pricing: {
    subtotal: {
      type: Number,
      required: true
    },
    vat: {
      type: Number,
      default: 0
    },
    vatRate: {
      type: Number,
      default: 0.125 // 12.5% VAT
    },
    serviceCharge: {
      type: Number,
      default: 0
    },
    serviceChargeRate: {
      type: Number,
      default: 0.10 // 10% service charge
    },
    discount: {
      type: Number,
      default: 0
    },
    discountType: {
      type: String,
      enum: ['percentage', 'fixed'],
      default: 'percentage'
    },
    total: {
      type: Number,
      required: true
    }
  },
  currency: {
    type: String,
    default: 'GHS'
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'ready', 'served', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'paid', 'refunded', 'partial'],
    default: 'unpaid'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'mobile_money', 'room_charge']
  },
  orderTime: {
    type: Date,
    default: Date.now
  },
  estimatedTime: {
    type: Date
  },
  servedTime: {
    type: Date
  },
  waiterAssigned: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  chefAssigned: {
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

// Generate order ID
restaurantOrderSchema.pre('save', function(next) {
  if (this.isNew) {
    const now = new Date();
    const year = now.getFullYear().toString().substr(-2);
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.orderId = `RO${year}${month}${day}${random}`;
  }
  
  this.updatedAt = Date.now();
  next();
});

// Calculate pricing
restaurantOrderSchema.pre('save', function(next) {
  // Calculate item subtotals
  this.items.forEach(item => {
    item.subtotal = item.price * item.quantity;
  });
  
  // Calculate order subtotal
  this.pricing.subtotal = this.items.reduce((sum, item) => sum + item.subtotal, 0);
  
  // Calculate VAT
  this.pricing.vat = this.pricing.subtotal * this.pricing.vatRate;
  
  // Calculate service charge
  this.pricing.serviceCharge = this.pricing.subtotal * this.pricing.serviceChargeRate;
  
  // Calculate discount
  let discountAmount = 0;
  if (this.pricing.discount > 0) {
    if (this.pricing.discountType === 'percentage') {
      discountAmount = this.pricing.subtotal * (this.pricing.discount / 100);
    } else {
      discountAmount = this.pricing.discount;
    }
  }
  
  // Calculate total
  this.pricing.total = this.pricing.subtotal + this.pricing.vat + this.pricing.serviceCharge - discountAmount;
  
  next();
});

// Calculate estimated time
restaurantOrderSchema.pre('save', function(next) {
  if (this.isNew) {
    // Estimate preparation time based on items (simple logic)
    const totalPrepTime = this.items.reduce((sum, item) => sum + (item.preparationTime || 15), 0);
    const averagePrepTime = totalPrepTime / this.items.length;
    
    this.estimatedTime = new Date(Date.now() + averagePrepTime * 60000); // Add minutes in milliseconds
  }
  
  next();
});

// Index for efficient queries
restaurantOrderSchema.index({ orderId: 1 });
restaurantOrderSchema.index({ status: 1, orderTime: -1 });
restaurantOrderSchema.index({ orderType: 1 });
restaurantOrderSchema.index({ createdAt: -1 });

module.exports = mongoose.model('RestaurantOrder', restaurantOrderSchema);