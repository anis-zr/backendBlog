// controllers/expenseController.js
const Expense = require("../models/expense");
const Budgett = require("../models/bugett");

// 1) إنشاء سجل Expense جديد
exports.createExpense = async (req, res) => {
  const { product, quantite, unit, date, budgettId } = req.body;

  try {
    const budget = await Budgett.findById(budgettId);
    if (!budget) {
      return res.status(404).json({ message: "الميزانية المطلوبة غير موجودة" });
    }

    const expense = await Expense.create({
      product,
      quantite,
      unit,
      date,
      budgettId,
      // OPTIONAL: userId: req.user._id
    });

    return res.status(201).json(expense);
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      return res.status(400).json({ message: "هذا المنتج موجود بالفعل ضمن هذه الميزانية" });
    }
    return res.status(500).json({ message: "خطأ في إنشاء المصروف (Expense)" });
  }
};


exports.getExpensesByBudget = async (req, res) => {
  const { budgettId } = req.params;
  try {
    const budgett = await Budgett.findById(budgettId);
    if (!budgett) {
      return res.status(404).json({ message: "الميزانية المطلوبة غير موجودة" });
    }

    const expenses = await Expense.find({ budgettId }).sort({ date: -1 });
    return res.status(200).json(expenses);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "فشل في جلب بيانات المصروفات" });
  }
};

// 3) تعديل مصروف
exports.updateExpense = async (req, res) => {
  const { id } = req.params;
  const { product, quantite, unit, date } = req.body;
  try {
    const expense = await Expense.findByIdAndUpdate(
      id,
      { product, quantite, unit, date },
      { new: true }
    );
    if (!expense) {
      return res.status(404).json({ message: "سجل المصروف غير موجود" });
    }
    return res.status(200).json(expense);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "فشل في تعديل المصروف" });
  }
};

// 4) حذف مصروف
exports.deleteExpense = async (req, res) => {
  const { id } = req.params;
  try {
    const expense = await Expense.findByIdAndDelete(id);
    if (!expense) {
      return res.status(404).json({ message: "سجل المصروف غير موجود" });
    }
    return res.status(200).json({ message: "تم حذف المصروف بنجاح" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "فشل في حذف المصروف" });
  }
};