let express = require('express')
let db = require("../mysql")
let router = express.Router()

/**
 * 登录
 */
function login(req, resp){
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
                req.session.user = res[0];
                console.log(req.session.user);
                resp.send({ code: 200, message: "登录成功!" })                
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
function register(req, resp){
    let username = req.body.username
    let password = req.body.password
    let email = req.body.email
    let avatar = req.body.avatar
    //resp.send("注册用户名："+username+",email："+email+",avatar:"+avatar);
    db.sql("insert into user(username,password,email,avatar) values (?,?,?,?) ", username, password, email, avatar)
    .then(res => {
        console.log(res);
        resp.send({ code: 200, message:"注册成功！"});
    })
    .catch(err => {
        console.log(err);
        resp.send({ code: 500, err })
    })

}

/**
 * 获取登录用户信息
 */
function profile(req, resp){
    let sessionUser = {}
    console.log(req.session.user);
    Object.assign(sessionUser, req.session.user);//对象复制
    delete sessionUser.password;//删除密码
    resp.send(sessionUser);
}

router.post("/login", login)
router.post("/register", register)
router.get("/profile", profile)

module.exports = router
