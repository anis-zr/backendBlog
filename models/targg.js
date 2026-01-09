const mongoose = require("mongoose");

const targSchema = new mongoose.Schema({
  product: {
    type: String,
    required: true,
    enum: ['طماطم', 'جزر', 'بطاطا',"تمر","بطيخ","خوخ","بصل","ثوم"],
    
  },
  quantite: { 
    type: Number,
    required: true,
    min: 1
  },
  unit: {
    type: String,
    enum: ['طن'], // حسب ما تستخدمه
    required: true
  },
  wilaya: {
    type: String,
    required: true
  }
}, { timestamps: true });

// ✅ السماح بوجود نفس المنتج في ولايات مختلفة
targSchema.index({ product: 1, wilaya: 1 });

module.exports = mongoose.model("Targett", targSchema);

