const crypto = require('crypto');

// 加密函数，key为加密签名
module.exports = function (password, key = 'da shuai bi') {
    const hmac = crypto.createHmac('sha256', key);
    hmac.update(password);
    const passwordHmac = hmac.digest('hex');
    return passwordHmac
}