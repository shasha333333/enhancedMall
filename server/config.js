// 导入dotenv，确保在项目中使用环境变量
require('dotenv').config();

// 从环境变量中获取密钥
const SECRET_KEY = process.env.SECRET_KEY || 'default_secret_key';

module.exports = { SECRET_KEY };
