const express = require("express")
const {
  createBudget,
  getBudgets,
  getBudgetById,
  updateBudget,
  deleteBudget,
} = require("../controllers/budgetController")

const{protect} = require("../middleware/authMiddleware");


const router = express.Router();

router.post("/add",protect, createBudget);
router.get("/get",protect, getBudgets);

router.get("/:id",protect, getBudgetById)
 router.put("/update/:id",protect, updateBudget);
 router.delete("/delete/:id",protect, deleteBudget);

  module.exports = router;