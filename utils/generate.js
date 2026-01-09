 const jwt = require('jsonwebtoken'); 



 generateToken = (user) => {
  const payload = {
    id: user.id || undefined, // موجود فقط في agriculteur
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '7d', // أو أي مدة تريدها
  });
};

module.exports = generateToken