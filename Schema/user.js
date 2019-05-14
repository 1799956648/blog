// 用户登录注册查询的表

// 获取db对象
const { db } = require('../Schema/config');

// 获取userSchema
const userSchema = require('../Schema/userSchema');

// 创建集合
const User = db.model('users', userSchema);

// 导出用户集合的表
module.exports = User;
