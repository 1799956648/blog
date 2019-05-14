// 获取用户的表
const User = require('../Schema/user');

// 导入加密函数
const encrypt = require('../util/encrypt');

// 用户注册
exports.reg = async (ctx, next) => {
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

            // 返回promise
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
                console.log('注册成功')
                await ctx.render('isOk', {
                    status: '注册成功'
                })
            } else {
                // 用户存在
                console.log('用户存在')
                await render('isOk', {
                    status: '该用户已存在，请重新注册'
                })
            }
        })
        .catch(async err => {
            // 失败
            console.log('用户失败')
            await ctx.render('isOk', {
                status: '登录失败，请重新登录'
            })
        })
}

// 用户登录
exports.login = async (ctx, next) => {
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

            resolve('')
        })
    })

        .then(async data => {
            if (data) {
                await ctx.render('isOk', {
                    status: '登录成功'
                })
            } else {
                await ctx.render('isOk', {
                    status: '密码不正确，请重新登录'
                })
            }
        })
        .catch(async err => {
            await ctx.render('isOk', {
                status: '登录失败'
            })
        })
}
