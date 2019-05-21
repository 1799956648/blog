// 导入 articleSchema 和 db 对象
const ArticleSchema = require('./articleSchema');
const { db } = require('./config');

// 创建文章集合
const Article = db.model('articles', ArticleSchema);

// 导出文章集合的表
module.exports = Article;