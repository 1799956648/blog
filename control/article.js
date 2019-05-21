// 导入文章集合的表
const Article = require('../Schema/article');

// 返回文章发表页
exports.addPage = async (ctx) => {
    await ctx.render('add-article', {
        title: '文章发表页面',
        session: ctx.session
    })
}

// 文章发表页面
exports.add = async (ctx) => {
    // 用户没登录，不需要去查询数据库
    if (ctx.session.isNew) { 
        return ctx.body = {
            status: 0,
            msg: '用户未登录，请登录'
        }
    }

    // 用户登录了,接收post请求的数据
    const data = ctx.request.body;

    // 更新作者信息
    data.author = ctx.session.username;

    await new Promise((resolve, reject) => {
        new Article(data).save((err, data) => {
            // 保存失败
            if (err) {
                return reject(err);
            }

            // 保存成功
            resolve(data);
        })
    })
    .then(data => {
        return ctx.body = {
            msg: '发表成功',
            status: 1
        }
    })
    .catch(err => {
        return ctx.body = {
            msg: '发表失败',
            status: 0
        }
    })
}

