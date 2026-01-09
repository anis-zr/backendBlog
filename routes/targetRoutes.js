// routes/target.js
const express = require("express");
const router = express.Router();
const { setTarget } = require("../controllers/targetController");

router.post("/targets", setTarget);      // إنشاء أو تحديث هدف
//router.put("/targets/:product", setTarget); // (اختياري) نفس الشيء بالتعديل حسب المنتج

module.exports = router;