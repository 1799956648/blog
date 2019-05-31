// 获取Schema
const { Schema } = require('./config');
// 拿到mongodb的ObjectId
const ObjectId = Schema.Types.ObjectId;

// 评论发表Schema
// 发表内容，发表时间，发表作者，头像
const Comment = new Schema({
    content: String,

    // 评论的用户
    from: {
        type: ObjectId,
        ref: 'users' // 关联用户集合
    },

    // 评论的文章
    article: {
        type: ObjectId,
        ref: 'articles' // 关联文章集合
    }

}, { // 用户评论时间
    versionKey: false, timestamps: {
        createdAt: 'created' // 用户评论时间
    }
})

// 导出控制评论的Schema
module.exports = Comment;