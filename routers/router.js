const Router = require('koa-router');

// 获取路由中间件控制函数
const user = require('../control/user');

// 实例router
const router = new Router();

// 渲染首页，首页只能通过get方式访问
router.get('/', async (ctx, next) => {
    await ctx.render('index');
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

// 导入路由
module.exports = router;