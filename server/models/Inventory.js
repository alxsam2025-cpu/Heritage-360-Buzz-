const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  itemCode: {
    type: String,
    unique: true,
    required: true,
    uppercase: true
  },
  name: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true
  },
  description: String,
  category: {
    type: String,
    enum: [
      'food_ingredients', 'beverages', 'cleaning_supplies', 'kitchen_equipment',
      'hotel_amenities', 'office_supplies', 'maintenance_tools', 'furniture',
      'electronics', 'linens', 'toiletries', 'safety_equipment'
    ],
    required: [true, 'Category is required']
  },
  subCategory: String,
  unit: {
    type: String,
    enum: ['pieces', 'kg', 'g', 'liters', 'ml', 'boxes', 'cartons', 'bottles', 'cans', 'packets'],
    required: [true, 'Unit is required']
  },
  currentStock: {
    type: Number,
    required: [true, 'Current stock is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  minimumStock: {
    type: Number,
    required: [true, 'Minimum stock level is required'],
    min: [0, 'Minimum stock cannot be negative'],
    default: 10
  },
  maximumStock: {
    type: Number,
    default: 1000
  },
  reorderPoint: {
    type: Number,
    default: 20
  },
  pricing: {
    costPrice: {
      type: Number,
      required: [true, 'Cost price is required'],
      min: [0, 'Cost price cannot be negative']
    },
    sellingPrice: {
      type: Number,
      min: [0, 'Selling price cannot be negative']
    },
    currency: {
      type: String,
      enum: ['USD', 'GHS'],
      default: 'GHS'
    }
  },
  supplier: {
    name: String,
    contact: String,
    email: String,
    address: String
  },
  storage: {
    location: {
      type: String,
      required: [true, 'Storage location is required']
    },
    conditions: {
      type: String,
      enum: ['room_temperature', 'refrigerated', 'frozen', 'dry', 'controlled_environment']
    },
    shelfLife: {
      duration: Number,
      unit: {
        type: String,
        enum: ['days', 'weeks', 'months', 'years']
      }
    }
  },
  tracking: {
    serialNumbers: [String],
    batchNumbers: [String],
    expiryDates: [Date]
  },
  movements: [{
    type: {
      type: String,
      enum: ['purchase', 'sale', 'transfer', 'adjustment', 'waste', 'return'],
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    },
    reference: String,
    notes: String,
    performedBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }
  }],
  alerts: [{
    type: {
      type: String,
      enum: ['low_stock', 'expired', 'expiring_soon', 'out_of_stock'],
      required: true
    },
    message: String,
    isActive: {
      type: Boolean,
      default: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  tags: [String],
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

// Generate item code if not provided
inventorySchema.pre('save', function(next) {
  if (this.isNew && !this.itemCode) {
    const categoryCode = this.category.substring(0, 3).toUpperCase();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.itemCode = `${categoryCode}${random}`;
  }
  
  this.updatedAt = Date.now();
  next();
});

// Check for low stock and create alerts
inventorySchema.pre('save', function(next) {
  // Clear existing alerts
  this.alerts = this.alerts.filter(alert => !alert.isActive);
  
  // Check for low stock
  if (this.currentStock <= this.minimumStock) {
    this.alerts.push({
      type: 'low_stock',
      message: `${this.name} is running low. Current stock: ${this.currentStock}`,
      isActive: true
    });
  }
  
  // Check for out of stock
  if (this.currentStock === 0) {
    this.alerts.push({
      type: 'out_of_stock',
      message: `${this.name} is out of stock`,
      isActive: true
    });
  }
  
  // Check for expiring items
  if (this.tracking.expiryDates && this.tracking.expiryDates.length > 0) {
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + (7 * 24 * 60 * 60 * 1000));
    
    const expiringSoon = this.tracking.expiryDates.some(date => date <= sevenDaysFromNow && date > now);
    const expired = this.tracking.expiryDates.some(date => date <= now);
    
    if (expired) {
      this.alerts.push({
        type: 'expired',
        message: `${this.name} has expired items`,
        isActive: true
      });
    } else if (expiringSoon) {
      this.alerts.push({
        type: 'expiring_soon',
        message: `${this.name} has items expiring within 7 days`,
        isActive: true
      });
    }
  }
  
  next();
});

// Index for efficient queries
inventorySchema.index({ itemCode: 1 });
inventorySchema.index({ name: 'text', description: 'text' });
inventorySchema.index({ category: 1, subCategory: 1 });
inventorySchema.index({ currentStock: 1 });
inventorySchema.index({ 'alerts.isActive': 1, 'alerts.type': 1 });
inventorySchema.index({ isActive: 1 });

module.exports = mongoose.model('Inventory', inventorySchema);