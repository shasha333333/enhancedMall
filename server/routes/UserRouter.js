let express = require('express')
let db = require("../mysql")
let router = express.Router()

// 引入 Token 生成函数
const { generateToken } = require('../middlewares/authUtils');
// 引入 Token 验证中间件
const { verifyToken } = require('../middlewares/authUtils');


/**
 * 登录
 */
function login(req, resp) {
    const { username, password } = req.body;

    if (username && password) {
        db.sql("select * from user where username = ?", username)
            .then(res => {
                if (res.length == 0) {
                    resp.send({ code: 400, message: "用户名不存在!" });
                } else if (res[0].password != password) {
                    resp.send({ code: 400, message: "密码错误!" });
                } else {
                    console.log(res[0]);

                    // 生成 Token
                    const token = generateToken(res[0]);

                    resp.send({
                        code: 200,
                        message: '登录成功！',
                        token: token
                    });
                }
            })
            .catch(err => {
                console.log(err);
                resp.send({ code: 500, err });
            });
    } 
    else {
        resp.send({ code: 500, message: "登录信息不完整!" });
    }
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
    // 使用 req.user 来访问解码后的用户信息
    const userId = req.session.user.id;  // 解码后的用户 ID
    console.log(userId);

    db.sql("SELECT * FROM user WHERE id = ?", userId)
        .then(result => {
            if (result.length > 0) {
                // 返回用户信息，排除 password 字段
                const user = {
                    id: result[0].id,
                    username: result[0].username,
                    email: result[0].email,
                    avatar: result[0].avatar,
                    // 其他需要返回的字段
                };
                res.send({ code: 200, message: user });
            } else {
                res.send({ code: 404, message: '用户不存在' });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({ code: 500, message: '数据库查询失败', error: err });
        });
}


/**
 * 退出登录
 */
function logout(req, res) {
    res.send({ code: 200, message: '退出成功' });
}

/**
 * 更新用户名
 */
function updateUsername(req, resp) {
    let username = req.body.username
    let userId = req.session.user.id
    db.sql("update user set username =? where id =?", username, userId)
       .then(res => {
            console.log(res);
            resp.send({ code: 200, message: "修改用户名成功!" });
        })
       .catch(err => {
            console.log(err);
            resp.send({ code: 500, err })
        })  
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
router.get("/profile", verifyToken, profile);
router.post("/updateAvatar", verifyToken, updateAvatar)
router.post("/updatePassword", verifyToken, updatePassword)
router.post("/updateEmail", verifyToken, updateEmail)
router.post("/updateUsername", verifyToken, updateUsername)
router.post("/logout", logout)

module.exports = router
