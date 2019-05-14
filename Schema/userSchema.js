// 获取Schema
const { Schema } = require('./config');

const userSchema = new Schema({
    username: String,
    password: String
})

// 导出 userSchema
module.exports = userSchema