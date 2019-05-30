// 获取Schema
const { Schema } = require('./config');

const UserSchema = new Schema({
    username: String, // 用户名
    password: String, // 密码
    avatar: { // 头像
        type: String, // 路径
        default: '/avatar/default.jpg' // 用户登录默认头像
    }
}, { // 消除数据库中的版本号， 设置每条数据的创建时间
    versionKey: false, timestamps: {
        createdAt: 'created' // 每条数据的创建时间
    } 
})

// 导出 UserSchema
module.exports = UserSchema