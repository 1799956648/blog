// 导入文章集合的表
const Article = require('../Schema/article');

// 导入userSchema，用于获取操作用户集合的实例对象
const User = require('../Schema/user');
const UserSchema = require('../Schema/userSchema');

// 返回文章发表页
exports.addPage = async (ctx) => {
    await ctx.render('add-article', {
        title: '文章发表页面',
        session: ctx.session,
        avatar: ctx.session.avatar
    })
}

// 文章发表页面
exports.add = async (ctx) => {
    // 用户没登录{}，不需要去查询数据库
    if (ctx.session.isNew) { 
        return ctx.body = {
            status: 0,
            msg: '用户未登录，请登录'
        }
    }

    // 用户登录了undefined,接收post请求的数据
    const data = ctx.request.body;

    // 更新作者信息
    data.author = ctx.session.uid;

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

exports.getList = async (ctx) => {

    // 取动态路由里面的参数,没传默认显示第一页
    let page = ctx.params.id || 1;

    page--;

    const artList = await Article
        .find() // 查询文章
        .sort('-created') // 降序，根据每篇文章的创建时间
        .skip(5 * page) // 跳过多个条数据查询
        .limit(5) // 限制每次查询5条数据

        .populate({
            // 关联用户的表，由于author键已经关联了users，所以关联author就相当于关联users
            path: 'author', // 通过author关联的表，查询到下面选择的数据，多个选择用空格隔开
            select: '_id username avatar' // 用户的信息
        })
        .then(data => data)
        .catch(err => reject(err))

    await ctx.render('index', {
        title: '博客实战首页',
        session: ctx.session,
        artList, // 文章查询列表，是一个数组,数组中每一个对象才是每条文章的信息
        maxNum: 10
    })
}

