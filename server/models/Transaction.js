const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    unique: true,
    required: true
  },
  type: {
    type: String,
    enum: ['income', 'expense', 'transfer'],
    required: [true, 'Transaction type is required']
  },
  category: {
    type: String,
    enum: [
      // Income categories
      'hotel_booking', 'restaurant_sales', 'pub_sales', 'room_service', 
      'laundry', 'other_income',
      // Expense categories  
      'inventory_purchase', 'supplies', 'utilities', 'salaries', 'rent',
      'maintenance', 'marketing', 'insurance', 'taxes', 'bank_charges',
      'equipment', 'fuel', 'transportation', 'other_expense'
    ],
    required: [true, 'Category is required']
  },
  subCategory: String,
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount cannot be negative']
  },
  currency: {
    type: String,
    enum: ['USD', 'GHS'],
    required: true
  },
  exchangeRate: {
    type: Number,
    default: 1
  },
  amountInBaseCurrency: Number, // Always in GHS
  paymentMethod: {
    type: String,
    enum: ['cash', 'bank_transfer', 'mobile_money', 'card', 'cheque'],
    required: true
  },
  account: {
    type: String,
    enum: ['cash_in_hand', 'bank_account_1', 'bank_account_2', 'mobile_money', 'petty_cash'],
    required: true
  },
  referenceNumber: String,
  relatedDocuments: [{
    documentType: {
      type: String,
      enum: ['invoice', 'receipt', 'voucher', 'booking', 'order']
    },
    documentId: String,
    documentNumber: String
  }],
  vendor: {
    name: String,
    contact: String,
    address: String
  },
  customer: {
    name: String,
    contact: String,
    address: String
  },
  departmentSource: {
    type: String,
    enum: ['hotel', 'restaurant', 'pub', 'administration'],
    required: true
  },
  taxInfo: {
    isTaxable: {
      type: Boolean,
      default: false
    },
    taxType: {
      type: String,
      enum: ['VAT', 'NHIL', 'GETFund', 'COVID_Levy']
    },
    taxRate: Number,
    taxAmount: Number
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled', 'reconciled'],
    default: 'pending'
  },
  approvedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  approvedAt: Date,
  reconciledBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  reconciledAt: Date,
  notes: String,
  attachments: [String], // File paths
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  transactionDate: {
    type: Date,
    required: true,
    default: Date.now
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

// Generate transaction ID
transactionSchema.pre('save', function(next) {
  if (this.isNew) {
    const now = new Date();
    const year = now.getFullYear().toString().substr(-2);
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    
    let prefix = 'TR';
    if (this.type === 'income') prefix = 'IN';
    else if (this.type === 'expense') prefix = 'EX';
    
    this.transactionId = `${prefix}${year}${month}${day}${random}`;
  }
  
  // Convert to base currency (GHS)
  if (this.currency !== 'GHS') {
    this.amountInBaseCurrency = this.amount * this.exchangeRate;
  } else {
    this.amountInBaseCurrency = this.amount;
  }
  
  this.updatedAt = Date.now();
  next();
});

// Index for efficient queries
transactionSchema.index({ transactionId: 1 });
transactionSchema.index({ type: 1, transactionDate: -1 });
transactionSchema.index({ category: 1, transactionDate: -1 });
transactionSchema.index({ departmentSource: 1, transactionDate: -1 });
transactionSchema.index({ status: 1 });
transactionSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Transaction', transactionSchema);