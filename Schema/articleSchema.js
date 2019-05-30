// 导入Schema
const { Schema } = require('./config');

// 取到ObjectId
const ObjectId = Schema.Types.ObjectId;

const ArticleSchema = new Schema({
    tips: String, 
    title: String,
    content: String,
    // 文章发表时候要显示头像，所以需要关联用户的集合
    author: {
        type: ObjectId,
        ref: 'users' // 要关联的表
    }
}, { // 消除数据库中的版本号， 设置每条数据的创建时间
    versionKey: false, timestamps: {
        createAt: 'created' // 每条数据的创建时间
        // updateAt: ''
    }
})

// 导入articleSchema
module.exports = ArticleSchema;