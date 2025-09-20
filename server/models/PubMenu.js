const mongoose = require('mongoose');

const pubItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Drink name is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    enum: ['beer', 'wine', 'spirits', 'cocktails', 'soft_drinks', 'water', 'juice', 'energy_drinks'],
    required: [true, 'Category is required']
  },
  type: {
    type: String,
    enum: ['local', 'continental', 'imported'],
    required: [true, 'Type is required']
  },
  brand: {
    type: String,
    trim: true
  },
  alcoholContent: {
    type: Number, // Percentage
    min: 0,
    max: 100,
    default: 0
  },
  volume: {
    amount: {
      type: Number,
      required: true
    },
    unit: {
      type: String,
      enum: ['ml', 'cl', 'l', 'oz'],
      default: 'ml'
    }
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  currency: {
    type: String,
    default: 'GHS'
  },
  stockLevel: {
    current: {
      type: Number,
      default: 0
    },
    minimum: {
      type: Number,
      default: 10
    },
    unit: {
      type: String,
      enum: ['bottles', 'cans', 'liters', 'pieces'],
      default: 'bottles'
    }
  },
  supplier: {
    name: String,
    contact: String,
    lastSupplied: Date
  },
  availability: {
    isAvailable: {
      type: Boolean,
      default: true
    },
    availableFrom: {
      type: String, // Time format: "12:00"
      default: "12:00"
    },
    availableTo: {
      type: String, // Time format: "02:00"
      default: "02:00"
    },
    availableDays: [{
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      default: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    }]
  },
  images: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  popularityScore: {
    type: Number,
    default: 0
  },
  tags: [String], // For searching: 'cold', 'hot', 'premium', etc.
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

const pubMenuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    default: 'Heritage 360 Pub Menu'
  },
  items: [pubItemSchema],
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  version: {
    type: Number,
    default: 1
  }
});

// Update timestamp on save
pubMenuSchema.pre('save', function(next) {
  this.lastUpdated = Date.now();
  next();
});

// Index for efficient queries
pubMenuSchema.index({ 'items.category': 1, 'items.type': 1 });
pubMenuSchema.index({ 'items.isActive': 1 });
pubMenuSchema.index({ 'items.name': 'text', 'items.brand': 'text', 'items.description': 'text' });
pubMenuSchema.index({ 'items.stockLevel.current': 1 });

module.exports = mongoose.model('PubMenu', pubMenuSchema);