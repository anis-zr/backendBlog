const Targett = require("../models/targg");

exports.setTarget = async (req, res) => {
  try {
    const { product, quantite, unit, wilaya } = req.body;

    console.log("📥 Payload:", req.body);

    // هذا الأمر سيُحدّث السجل إن وجد (نفس product + wilaya) أو ينشئه إن لم يكن موجودًا
    const result = await Targett.updateOne(
      { product, wilaya },
      { $set: { quantite, unit } },
      { upsert: true }
    );

    // result.upsertedCount===1 أنشأ سجلًا جديدًا
    // result.modifiedCount===1   → حدّث سجلًا موجودً
    return res.json({
      message: result.upsertedCount
        ? "✅ تمت الإضافة بنجاح"
        : "✅ تم التحديث بنجاح"
    });
  } catch (error) {
    console.error("❌ setTarget error:", error);
    res.status(500).json({ error: "فشل في الإضافة/التحديث" });
  }
};