/*const express = require("express")

const{
    addIncome,
    getAllIncome,
    downloadIncomeExcel,
    deleteIncome,
    updateIncome

}= require("../controllers/incomeController")

const{protect} = require("../middleware/authMiddleware")

const router = express.Router();

router.post("/add",addIncome);
router.get("/get", getAllIncome);
router.post("/downloadexcel", protect,downloadIncomeExcel);
router.delete("/:id", protect,deleteIncome);
router.put("/update", protect,updateIncome);

module.exports = router;*/

// routes/incomeRoutes.js

const express = require('express');
const router = express.Router();
const {
  createIncome,
  getIncomesByBudget,
  updateIncome,
  deleteIncome
} = require('../controllers/incomeController');
//const{protect} = require("../middleware/authMiddleware");

router.post('/add', createIncome);


router.get('/budget/:budgetId', getIncomesByBudget);


router.put('/:id', updateIncome);


router.delete('/:id', deleteIncome);

module.exports = router;