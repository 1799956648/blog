const Koa = require('koa');
const views = require('koa-views');
const static = require('koa-static');
const logger = require('koa-logger');
const body = require('koa-body');
const router = require('./routers/router');
const { join } = require('path');
const session = require('koa-session');

// 对session的配置对象
const CONFIG = {
    key: 'Sid', // cookies 密钥
    maxAge: 36e5, // 过期时间
    overwrite: false, // 不覆盖
    httpOnly: true, // 不让前端访问
    signed: true, // 对session签名
    rolling: true // 每操作一次，就在当前的时间往后延长 过期时间(maxAge) 的时间
}

// 生成koa实例
const app = new Koa();

// 注册日志模块
app.use(logger());

// 解析post请求的数据
app.use(body())

// 配置静态资源目录 
app.use(static(join(__dirname, "public")));

// 配置视图模板
app.use(views(join(__dirname, "views"), {
    extension: "pug"
}))

// 对session的签名
app.keys = ['黄楚鑫是个大帅比']

// 注册session
app.use(session(CONFIG, app))

// 启动路由
app.use(router.routes());
app.use(router.allowedMethods());

// 监听端口号
app.listen(3000, () => {
    console.log('程序监听在3000端口');
})

/*
用户
    注册    /user/reg 发送数据，
    登录    /user/login
    退出    /user/logout

超级管理员
    增加用户 post/user/
    删除用户 delete/user/
    修改用户信息 put/user/
    查询用户数据 get/user/
*/