const Router = require('koa-router');

// 获取路由中间件控制函数
const user = require('../control/user');

// 获取文章中间件控制函数
const article = require('../control/article');

// 实例router
const router = new Router();

// 渲染首页，首页只能通过get方式访问
router.get('/', user.keepLog, async (ctx, next) => {
    await ctx.render('index', {
        title: '博客实战页面',
        session: ctx.session
    });
})

// 主要用来处理 用户登录 用户注册   /user/reg 或者 /user/login
router.get(/^\/user\/(?=reg|login)/, async (ctx, next) => {
    // show 为真显示 用户注册 ，假显示 用户登录界面
    const show = /reg$/.test(ctx.path);
    await ctx.render('register', {
        show
    })
})

// 用户注册
router.post('/user/reg', user.reg);

// 用户登录
router.post('/user/login', user.login);

// 用户退出
router.get('/user/logout', user.logout);

// 返回文章发表页面
router.get('/article', article.addPage);

// 文章发表页面，确定用户的登录状态
router.post('/article', user.keepLog, article.add);

// 导入路由
module.exports = router;