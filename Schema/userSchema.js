// 获取Schema
const { Schema } = require('./config');

const UserSchema = new Schema({
    username: String,
    password: String
})

// 导出 UserSchema
module.exports = UserSchema