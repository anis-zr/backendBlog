const express = require('express'); 
const router = express.Router();
 const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');


 router.post("/register", authController.registerUser);
  router.post("/registerr", authController.register);
  router.post("/login", authController.loginUser);
    //router.post("/loginn", authController.login);
  router.get('/me',protect,  authController.getCurrentUser);
  router.post('/forgot-password',protect, authController.forgotPassword);
  router.post('/reset-password/:token',protect, authController.resetPassword);

module.exports = router;