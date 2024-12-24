// 引入 jwt-simple 库
const jwt = require('jwt-simple');
const { SECRET_KEY } = require('../config');

// 生成 JWT
function generateToken(user) {
  const payload = {
    id: user.id,
    username: user.username,
    email: user.email,
  };
  return jwt.encode(payload, SECRET_KEY);
}

// 验证 JWT
function verifyToken(req, res, next) {
  const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ message: '没有提供 token' });
  }

  try {
    const decoded = jwt.decode(token, SECRET_KEY);
    req.session.user = decoded; // 将解码后的用户信息存入请求对象中
    next();
  } catch (err) {
    return res.status(401).json({ message: '无效的 token' });
  }
}


module.exports = { generateToken , verifyToken };
