/*const jwt = require('jsonwebtoken')
const User = require ('../models/User')

exports.protect = async (req,res,next)=>{
    let token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({message:"Not autorized , no token"})
        try{
    
    const decoded  = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id).select('-password')
    next();

    } catch(err){
        res.status(401).json({message:"Not autorized , token failed"})
    }
}



*/

// تأكد أنك تستعمل التوكن وتتحقق منه
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// middleware للتحقق من التوكن
const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  } else {
    return res.status(401).json({ message: 'Token not found' });
  }
};

exports.protect = protect;