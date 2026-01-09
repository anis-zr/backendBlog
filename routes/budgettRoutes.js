const express = require("express");
const {
  createBudgett,
  getBudgetts,
  getBudgettById,
  updateBudgett,
  deleteBudgett,
} = require("../controllers/budgettController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/add", protect, createBudgett);
router.get("/get", protect, getBudgetts);
router.get("/:id", protect, getBudgettById);
router.put("/updatee/:id", protect, updateBudgett);
router.delete("/deletee/:id", protect, deleteBudgett);

module.exports = router;