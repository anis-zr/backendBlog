const Budget = require('../models/budget')
const xlsx = require('xlsx')

exports.createBudget = async (req, res) => {
  const { wilaya, quantite, unit } = req.body;
  try {
    if (!quantite || !unit || !wilaya) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newBudget = new Budget({
       userId: req.user._id,
      wilaya,
      quantite,
      unit
    });

    await newBudget.save();

    res.status(200).json({ message: 'Budget created successfully' });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.getBudgets = async (req, res) => {
 try {
     // جلب فقط سجلات المستخدم الحالي
     const budgets = await Budget.find({ userId: req.user._id });
     res.status(200).json(budgets);
   } catch (err) {
     res.status(500).json({ message: "فشل في جلب الميزانيات", error: err.message });
   }
};


exports.getBudgetById = async (req, res) => {
  try {
    const budget = await Budget.findOne({ _id: req.params.id,
      userId: req.user._id });
    if (!budget) return res.status(404).json({ message: "الميزانية غير موجودة" });
    res.status(200).json(budget);
  } catch (err) {
    res.status(500).json({ message: "خطأ في جلب الميزانية", error: err.message });
  }
};


exports.updateBudget = async (req, res) => {
  try {
    const budget = await Budget.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );
    if (!budget) return res.status(404).json({ message: "الميزانية غير موجودة" });
    res.status(200).json(budget);
  } catch (err) {
    res.status(500).json({ message: "فشل في التعديل", error: err.message });
  }
};

exports.deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!budget) return res.status(404).json({ message: "الميزانية غير موجودة" });
    res.status(200).json({ message: "تم الحذف بنجاح" });
  } catch (err) {
    res.status(500).json({ message: "فشل في الحذف", error: err.message });
  }
};