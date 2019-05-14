const Koa = require('koa');
const views = require('koa-views');
const static = require('koa-static');
const logger = require('koa-logger');
const body = require('koa-body');
const router = require('./routers/router')
const { join } = require('path');


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