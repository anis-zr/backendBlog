// models/Income.js
const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
  budgetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Budget',
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
    enum: ['هكتار','ار','متر مربع'],
    required: true
  },
  date: {
    type: Date,
    required: true
  },
}, { timestamps: true });
//incomeSchema.index({ budgetId: 1, product: 1 }, { unique: true }); 
module.exports = mongoose.model('Income', incomeSchema);



