// routes/targett.js
const express = require("express");
const router = express.Router();
const { setTarget } = require("../controllers/targettController");

router.post("/targetts", setTarget);      // إنشاء أو تحديث هدف
//router.put("/targets/:product", setTarget); // (اختياري) نفس الشيء بالتعديل حسب المنتج

module.exports = router;
