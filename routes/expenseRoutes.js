// routes/expenseRoutes.js
const express = require('express');
const router = express.Router();
const {
  createExpense,
  getExpensesByBudget,
  updateExpense,
  deleteExpense
} = require('../controllers/expenseController');

// middleware للحماية (اختياري)
const { protect } = require("../middleware/authMiddleware");

router.post('/add', protect, createExpense);
router.get('/budgett/:budgettId', protect, getExpensesByBudget);
router.put('/:id', protect, updateExpense);
router.delete('/:id', protect, deleteExpense);

module.exports = router;