// 获取用户集合的表
const User = require('../Schema/user');

// 导入加密函数
const encrypt = require('../util/encrypt');

// 用户注册
exports.reg = async (ctx) => {
    const userData = ctx.request.body;

    // 用户输入的用户名和密码
    const username = userData.username;
    const password = userData.password;

    // 去用户的表里查找,查找的过程是 I/O操作，是异步的，所以要带上 await
    await new Promise((resolve, reject) => {

        // 查找用户名,查找成功就是一个null，失败就是一个错误对象
        User.find({ username }, (err, data) => {
            if (err) {
                return reject(err);
            }

            if (data.length !== 0) { // 用户已存在
                return resolve('');
            }

            // 用于名不存在，注册，传进去的密码要加密
            const user = new User({
                username,
                password: encrypt(password) // 第二个参数为加密签名，不传有默认值
            })

            // 返回promise，将数据保存到数据库
            user.save((err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            })
        })
    })
        .then(async data => {
            if (data) {
                // 注册成功
                // console.log('注册成功')
                await ctx.render('isOk', {
                    status: '注册成功'
                })
            } else {
                // 用户存在
                // console.log('用户存在')
                await render('isOk', {
                    status: '该用户已存在，请重新注册'
                })
            }
        })
        .catch(async err => {
            // 失败
            // console.log('用户失败')
            await ctx.render('isOk', {
                status: '注册失败，请重新注册'
            })
        })
}

// 用户登录
exports.login = async (ctx) => {
    const userData = ctx.request.body;

    // 用户输入的用户名和密码
    const username = userData.username;
    const password = userData.password;

    // 去数据库对比，判断用户名和密码是否相同
    await new Promise((resolve, reject) => {
        User.find({ username }, (err, data) => {
            // 查找失败
            if (err) {
                return reject(err);
            }

            // 找不到用户名
            if (data.length === 0) {
                return reject('此用户不存在');
            }

            // 两次密码输入正确
            if (data[0].password === encrypt(password)) {
                return resolve(data);
            }

            // 找得到用户，密码不正确
            resolve('')
        })
    })

        .then(async data => {
            if (!data) { // 找得到用户名，但是密码比对错误
                return ctx.render('isOk', {
                    status: '密码不正确，请重新登录'
                })
            }

            // 在用户的 cookies 里设置 username 和 password(加密后的密码)、ID值 权限
            ctx.cookies.set('username', username, {
                domian: 'localhost', // cookies域名
                path: '/', // 当前路径下生效
                maxAge: 36e5, // cookies的过期时间，1天
                httpOnly: true, // 不让前端访问这条cookies
                overWrite: false, // 不能覆盖
            })

            // 用户在数据库的_id值            
            ctx.cookies.set('uid', data[0]._id, {
                domian: 'localhost', // cookies域名
                path: '/', // 当前路径下生效
                maxAge: 36e5, // cookies的过期时间，1天
                httpOnly: true, // 不让前端访问这条cookies
                overWrite: false, // 不能覆盖
            })

            // 把用户的数据存到后台的session，便于与前端的cookie对比，检测用户的登录状态
            ctx.session = {
                username,
                uid: data[0]._id, // 必须存用户的id
                avatar: data[0].avatar // 保存头像路径
            }

            // 找得到用户名，密码比对正确
            await ctx.render('isOk', {
                status: '登录成功'
            })

        })
        .catch(async err => { // 找不到用户名
            await ctx.render('isOk', {
                status: '找不到该用户，请注册'
            })
        })
}

// 确定用户的登录状态 保持用户的状态
exports.keepLog = async (ctx, next) => {
    // session 里面没有值
    // undefined 为用户登录了，true 为没登录
    // console.log(ctx.session.isNew)
    if (ctx.session.isNew) { // session 没值
        if (ctx.cookies.get('username')) { // 前端cookies有值
            let uid = ctx.cookies.get('uid');

            // 更新后台的session
            ctx.session = {
                username: ctx.cookies.get('username'),
                uid
            }
        }
    }
    await next()
}

// 用户退出
exports.logout = async (ctx) => {
    // 清空后台session
    ctx.session = null;

    // 清空前端cookie
    ctx.cookies.set('username', null, {
        maxAge: 0
    })

    ctx.cookies.set('uid', null, {
        maxAge: 0
    })

    // 后台的重定向到首页
    ctx.redirect('/');
}