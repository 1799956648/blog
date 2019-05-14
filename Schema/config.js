const mongoose = require('mongoose');

const db = mongoose.createConnection('mongodb://localhost:27017/blogProject', {useNewUrlParser: true})

// 监听状态
db.on('err', () => {
    console.log('数据库连接失败');
})

db.on('open', () => {
    console.log('数据库连接成功');
})

// 获取Schema
const Schema = mongoose.Schema;

// 导入 db 对象和 Schema
module.exports = {
    db,
    Schema
}