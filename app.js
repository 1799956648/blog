const Koa = require('koa');
const views = require('koa-views');
const static = require('koa-static');
const logger = require('koa-logger');
const Router = require('koa-router');
const { join } = require('path');

const router = new Router();

// 生成koa实例
const app = new Koa();

// 注册日志模块
app.use(logger());

// 配置静态资源目录 
app.use(static(join(__dirname, "public")));

// 配置视图模板
app.use(views(join(__dirname, "views"), {
    extension: "pug"
}))

// 渲染首页
router.get('/', async (ctx, next) => {
    await ctx.render('index');
})

// 主要用来处理 用户登录 用户注册
router.get(/^\/user\/(?=reg|login)/, async (ctx, next) => {
    const show = /reg$/.test(ctx.path);
    await ctx.render('register', {
        show
    })
})

// 启动路由
app.use(router.routes());
app.use(router.allowedMethods());

// 监听端口号
app.listen(3000, () => {
    console.log('程序监听在3000端口');
})

/* 
用户
    注册    /user/reg
    登录    /user/login
    退出    /user/logout

超级管理员
    增加用户 post/user/
    删除用户 delete/user/
    修改用户信息 put/user/
    查询用户数据 get/user/
*/