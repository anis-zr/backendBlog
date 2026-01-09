const Budgett = require('../models/bugett');

// إنشاء ميزانية
exports.createBudgett = async (req, res) => {
  const { wilaya, quantite, unit } = req.body;
  try {
    if (!quantite || !unit || !wilaya) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const newBudgett = new Budgett({
      userId: req.user._id,
      wilaya,
      quantite,
      unit
    });
    await newBudgett.save();
    res.status(200).json({ message: 'Budget created successfully' });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// جلب ميزانيات المستخدم فقط
exports.getBudgetts = async (req, res) => {
  try {
    // جلب فقط سجلات المستخدم الحالي
    const budgetts = await Budgett.find({ userId: req.user._id });
    res.status(200).json(budgetts);
  } catch (err) {
    res.status(500).json({ message: "فشل في جلب الميزانيات", error: err.message });
  }
};

// جلب ميزانية واحدة
exports.getBudgettById = async (req, res) => {
  try {
    const budgett = await Budgett.findOne({
      _id: req.params.id,
      userId: req.user._id
    });
    if (!budgett) return res.status(404).json({ message: "الميزانية غير موجودة" });
    res.status(200).json(budgett);
  } catch (err) {
    res.status(500).json({ message: "خطأ في جلب الميزانية", error: err.message });
  }
};

// تحديث ميزانية
exports.updateBudgett = async (req, res) => {
  try {
    const budgett = await Budgett.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );
    if (!budgett) return res.status(404).json({ message: "الميزانية غير موجودة" });
    res.status(200).json(budgett);
  } catch (err) {
    res.status(500).json({ message: "فشل في التعديل", error: err.message });
  }
};

// حذف ميزانية
exports.deleteBudgett = async (req, res) => {
  try {
    const budgett = await Budgett.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });
    if (!budgett) return res.status(404).json({ message: "الميزانية غير موجودة" });
    res.status(200).json({ message: "تم الحذف بنجاح" });
  } catch (err) {
    res.status(500).json({ message: "فشل في الحذف", error: err.message });
  }
};