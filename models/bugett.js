const mongoose = require("mongoose")

const BudgettSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    wilaya: {
      type: String,
      required: true,
      enum: ["تبسة", "سوق اهراس", "خنشلة"],
    },
    quantite: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      enum: ["طن", "قنطار"],
      required: true,
    },
  },
  { timestamps: true }
);

BudgettSchema.index({ userId: 1, wilaya: 1 }, { unique: true }); // يمنع تكرار نفس الولاية للمستخدم
 module.exports =mongoose.model("Budgett", BudgettSchema);
