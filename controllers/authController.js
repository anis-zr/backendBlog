const User = require('../models/User');
const generateToken = require('../utils/generate') 
 const crypto = require('crypto'); 
 // const sendEmail = require('../utils/sendmail');
 const jwt = require('jsonwebtoken');
const Store = require('../models/store');


exports.register = async (req, res) => { 
    const {  email, password } = req.body;
     try { const storeExists = await Store.findOne({ email }); 
    if (storeExists) 
        return res.status(400).json({ message: 'Email already exists' });
const store = await Store.create({  email, password}); 
const token = generateToken(store);
 res.status(201).json({ user: { id: store._id,password:store.password, email: store.email}, token }); 
} catch (err) { res.status(500).json({ message: 'Server error' }); } };



exports.registerUser = async (req, res) => { 
    const {  email, password, gender,numCard } = req.body;
     try { const userExists = await User.findOne({ email }); 
    if (userExists) 
        return res.status(400).json({ message: 'Email already exists' });
const user = await User.create({  email, password, gender,numCard}); 
const token = generateToken(user);
 res.status(201).json({ user: { id: user._id,password:user.password, email: user.email,numCard:user.numCard, gender:user.gender}, token }); 
} catch (err) { res.status(500).json({ message: 'Server error' }); } };

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // تحقق أولاً إذا كان المستخدم هو الوزير
    if (
      email === process.env.MINISTER_EMAIL &&
      password === process.env.MINISTER_PASSWORD
    ) {
      const token = generateToken({ email, role: 'minister' });
      return res.json({
        user: { email, role: 'minister' },
        token,
      });
    }

    // إذا لم يكن الوزير، فابحث في قاعدة البيانات كـ agriculteur
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user);
    res.json({
      user: { id: user._id, email: user.email, role: user.role },
      token,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// تأكد أنك تستعمل التوكن وتتحقق منه


// middleware للتحقق من التوكن


exports.getCurrentUser = async (req, res) => {
  try {
    if (req.user.role === 'minister') {
      return res.json({
        user: {
          email: req.user.email,
          role: 'minister',
        }
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};




exports.forgotPassword = async (req, res) =>
     { const { email } = req.body; try 
{ const user = await User.findOne({ email });
 if (!user) return res.status(404).json({ message: 'User not found' });


const resetToken = crypto.randomBytes(20).toString('hex'); user.resetPasswordToken = resetToken; user.resetPasswordExpire = Date.now() + 3600000; // 1 hour await user.save(); const resetUrl = ${process.env.FRONTEND_URL}/reset-password/${resetToken}; const message = Click here to reset your password: ${resetUrl}; await sendEmail(user.email, 'Password Reset Request', message); res.status(200).json({ message: 'Email sent' }); 
} catch (err) { res.status(500).json({ message: 'Server error' }); } };

exports.resetPassword = async (req, res) => { const { token } = req.params; const { password } = req.body; try { const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpire: { $gt: Date.now() }, });
 if (!user) return res.status(400).json({ message: 'Invalid or expired token' });
user.password = password; user.resetPasswordToken = undefined; user.resetPasswordExpire = undefined; await user.save(); res.status(200).json({ message: 'Password updated successfully' }); 
} catch (err) { res.status(500).json({ message: 'Server error' }); } };

