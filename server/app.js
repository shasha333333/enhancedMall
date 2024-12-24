//引入express库
const express = require('express')
//创建服务端对象
const app = express()
//定义监听端口号
const port = 3000
// 引入验证中间件
const { verifyToken } = require('./middlewares/authUtils');

//公开静态资源
app.use('/public/',express.static('./public/'))


//引入session对象
const session = require("express-session")
//配置session
app.use(session({
  secret : 'keyboard cat',  //由服务器生成session的签名
  resave : false,           //强制保存session
  saveUninitialized: true,  //强制未初始化的session存储
  cookie : {
    maxAge : 1000 * 60 * 10,      //过期时间10分钟
    secure : false,         //不需要https协议也能使用
  }
}))

// 定义需要登录的路径
const protectedPaths = ['/cart/', '/contact/', '/order/'];

// 让express处理json数据
app.use(express.json())


let router = express.Router()

//定义轮播图数据
let pics = [
  "http://127.0.0.1:3000/public/images/pic1.png",
  "http://127.0.0.1:3000/public/images/pic2.png",
  "http://127.0.0.1:3000/public/images/pic3.png",
  "http://127.0.0.1:3000/public/images/pic4.png",
  "http://127.0.0.1:3000/public/images/pic5.png",
];
//安装mysql数据库

//解析请求
router.get("/pics", (req, resp) => {
  resp.send(pics);
})

let avatars = [
  "http://127.0.0.1:3000/public/images/avatar.jpg",
  "http://127.0.0.1:3000/public/images/head_0.png",
  "http://127.0.0.1:3000/public/images/head_2.png",
  "http://127.0.0.1:3000/public/images/head_3.png",
  "http://127.0.0.1:3000/public/images/head_7.png",
];

//解析请求
router.get("/avatars", (req, resp) => {
  resp.send(avatars);
})



//路由生效
app.use("/home", router);
//引入UserRouter.js文件
let userRouter = require("./routes/UserRouter")
//使用路由
app.use("/user", userRouter);
//分类信息路由
let categoryRouter = require("./routes/CategoryRouter")
app.use("/category", categoryRouter);
//商品信息路由
let productRouter = require("./routes/ProductRouter")
app.use("/product", productRouter);


// 中间件：验证是否登录
app.use((req, res, next) => {
  // 判断当前路径是否需要登录验证
  const isProtectedPath = protectedPaths.some(path => req.path.includes(path));

  // 如果是需要登录的路径，进行验证
  if (isProtectedPath) {
    // 先使用 Token 验证
    return verifyToken(req, res, () => {
      console.log("Token 验证通过");
      next();
    });
  }

  // 如果不是需要验证的路径，继续处理请求
  next();
});

let cartRouter = require("./routes/CartRouter")

app.use("/cart", cartRouter);

let contactRouter = require("./routes/ContactRouter");

app.use("/contact", contactRouter);

let orderRouter = require("./routes/OrderRouter");

app.use("/order", orderRouter);







//启动服务
app.listen(port, () => {
  //启动成功后的提示
  console.log(`启动服务端成功，端口号为：${port}`)
})
