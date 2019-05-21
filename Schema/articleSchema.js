// 导入Schema
const { Schema } = require('./config');

const ArticleSchema = new Schema({
    tips: String,
    title: String,
    content: String,
    author: String
}, {
    versionKey: false, timestamps: {
        createAt: 'created'
    }
})

// 导入articleSchema
module.exports = ArticleSchema;``