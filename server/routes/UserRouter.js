let express = require('express')
let db = require("../mysql")
let router = express.Router()
// 引入 jwt-simple 库
const jwt = require('jwt-simple');

// 密钥，用于生成和验证 JWT
const SECRET_KEY = 'your-secret-key';


/**
 * 登录
 */
function login(req, resp) {
    let username = req.body.username
    let password = req.body.password
    if (username && password) {
        db.sql("select * from user where username = ?", username)
            .then(res => {
                //console.log(res);
                if (res.length == 0)
                    resp.send({ code: 400, message: "用户名不存在!" })
                else if (res[0].password != password)
                    resp.send({ code: 400, message: "密码错误!" })
                else {
                    console.log(res[0]);

                    const token = jwt.encode({ id: res[0].id, username: res[0].username }, SECRET_KEY);

                    resp.send({
                        code: 200,
                        message: '登录成功！',
                        token: token
                    })
                }
            })
            .catch(err => {
                console.log(err);
                resp.send({ code: 500, err })
            })
    } else
        resp.send({ code: 500, message: "登录信息不完整!" })
}

/**
 * 注册
 */
function register(req, resp) {
    let username = req.body.username
    let password = req.body.password
    let email = req.body.email
    let avatar = req.body.avatar
    //resp.send("注册用户名："+username+",email："+email+",avatar:"+avatar);
    db.sql("insert into user(username,password,email,avatar) values (?,?,?,?) ", username, password, email, avatar)
        .then(res => {
            console.log(res);
            resp.send({ code: 200, message: "注册成功！" });
        })
        .catch(err => {
            console.log(err);
            resp.send({ code: 500, err })
        })

}

/**
 * 获取登录用户信息
 */
function profile(req, res) {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ message: '没有提供 token，无法访问用户信息' });
    }

    try {
        // 验证 token 并解码
        const decoded = jwt.decode(token.split(' ')[1], SECRET_KEY);

        // 查找用户
        db.sql("select * from user where id =?", decoded.id)
            .then(result => { // 将内部的 res 重命名为 result
                console.log(result[0]);
                const user = result[0];
                if (user) {
                    res.send({ code: 200, message: user });
                } else {
                    res.send({ code: 404, message: '用户不存在' });
                }
            })
            .catch(err => {
                console.log(err);
                res.status(500).send({ code: 500, message: '数据库查询失败', error: err });
            });
    } catch (error) {
        return res.status(401).json({ message: '无效的 token' });
    }
}

/**
 * 退出登录
 */
function logout(req, res) {
    res.send({ code: 200, message: '退出成功' });
}


/**
 * 修改头像
 */
function updateAvatar(req, resp) {
    let avatar = req.body.avatar
    let userId = req.session.user.id
    db.sql("update user set avatar = ? where id = ?", avatar, userId)
        .then(res => {
            console.log(res);
            resp.send({ code: 200, message: "修改头像成功!" });
        })
        .catch(err => {
            console.log(err);
            resp.send({ code: 500, err })
        })
}

/**
 * 修改密码
 */
function updatePassword(req, resp) {
    let oldPassword = req.body.oldPassword
    let newPassword = req.body.newPassword
    let userId = req.session.user.id
    db.sql("select * from user where id = ?", userId)
        .then(res => {
            console.log(res);
            if (res[0].password != oldPassword)
                resp.send({ code: 400, message: "旧密码错误!" })
            else {
                db.sql("update user set password = ? where id = ?", newPassword, userId)
                    .then(res => {
                        console.log(res);
                        resp.send({ code: 200, message: "修改密码成功!" });
                    })
                    .catch(err => {
                        console.log(err);
                        resp.send({ code: 500, err })
                    })
            }
        })
        .catch(err => {
            console.log(err);
            resp.send({ code: 500, err })
        })
}

/**
 * 修改邮箱
 */
function updateEmail(req, resp) {
    let email = req.body.email
    let userId = req.session.user.id
    db.sql("update user set email = ? where id = ?", email, userId)
        .then(res => {
            resp.send({ code: 200, message: "修改邮箱成功!" });
        })
        .catch(err => {
            console.log(err);
            resp.send({ code: 500, err })
        })
}

router.post("/login", login)
router.post("/register", register)
router.get("/profile", profile)
router.post("/updateAvatar", updateAvatar)
router.post("/updatePassword", updatePassword)
router.post("/updateEmail", updateEmail)
router.post("/logout", logout)

module.exports = router
