const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Menu item name is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    enum: ['breakfast', 'lunch', 'dinner', 'beverages', 'desserts', 'appetizers'],
    required: [true, 'Category is required']
  },
  cuisine: {
    type: String,
    enum: ['local', 'continental', 'fusion'],
    required: [true, 'Cuisine type is required']
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
  ingredients: [String],
  allergens: [{
    type: String,
    enum: ['gluten', 'dairy', 'nuts', 'shellfish', 'eggs', 'soy', 'fish']
  }],
  nutritionalInfo: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
    fiber: Number
  },
  dietaryInfo: [{
    type: String,
    enum: ['vegetarian', 'vegan', 'gluten_free', 'dairy_free', 'keto', 'halal']
  }],
  preparationTime: {
    type: Number, // in minutes
    default: 15
  },
  availability: {
    isAvailable: {
      type: Boolean,
      default: true
    },
    availableFrom: {
      type: String, // Time format: "06:00"
      default: "06:00"
    },
    availableTo: {
      type: String, // Time format: "22:00"
      default: "22:00"
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
  reviews: [{
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    reviewedBy: String,
    reviewedAt: {
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

// Pre-defined menu items will be seeded
const menuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    default: 'Heritage 360 Restaurant Menu'
  },
  items: [menuItemSchema],
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
menuSchema.pre('save', function(next) {
  this.lastUpdated = Date.now();
  next();
});

// Index for efficient queries
menuSchema.index({ 'items.category': 1, 'items.cuisine': 1 });
menuSchema.index({ 'items.isActive': 1 });
menuSchema.index({ 'items.name': 'text', 'items.description': 'text' });

module.exports = mongoose.model('Menu', menuSchema);