// 拿到评论的集合
const Comment = require('../Schema/comment');

// 文章集合
const Article = require('../Schema/article');

// 用户集合
const User = require('../Schema/user');

// 评论发表
exports.save = async (ctx) => {
    let message = {
        status: 1,
        msg: '用户未登录，请登录才能发表'
    }

    // 用户没登录
    if (ctx.session.inNew) {
        // 用户没登陆
        ctx.body = message
    }

    // 用户有登录
    // 拿到用户输入的数据
    const data = ctx.request.body;

    // 给评论的文章加ID，评论用户和评论文章的ID
    data.from = ctx.session.uid;

    // 保存评论到数据库
    const _comment = new Comment(data);
    
    await _comment
        .save()
        .then(data => {
            message = {
                status: 1,
                msg: '评论成功'
            }
        })
        .catch(err => {
            message = {
                status: 0,
                msg: '评论失败，请重新发表评论'
            }
        })
    // 把评论发表的结果返回出来
    ctx.body = message;
}