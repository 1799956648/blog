const { db } = require('./config');

// 导入控制用户评论的Schema
const CommentSchema = require('./commentSchema');

// 控制用户评论的集合
const Comment = db.model('comments', CommentSchema);

// 导出评论的集合
module.exports = Comment;