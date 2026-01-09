const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  budgettId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Budgett',
    required: true
  },
  product: {
    type: String,
    required: true,
    enum: ['طماطم', 'جزر','قمح', 'بطاطا',"تمر","بطيخ","خوخ","بصل","ثوم"],
  },
  quantite: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    enum: ['طن', 'قنطار'],
    required: true
  },
  date: {
    type: Date,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);



