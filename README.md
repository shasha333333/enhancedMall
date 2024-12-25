# enhancedMall

## 项目简介

本项目是一个基于Vue2 + Node.js + Mysql的商城项目

### 前端项目运行

```
npm run install         安装依赖
npm run serve           运行
npm run build           打包
```

### 后端项目运行
npm init -y
npm install express jwt-simple body-parser cors
node app.js             运行


### 数据库

server/mysql.js         数据库连接


### 新增接口&修改接口
1. 退出登录
2. 权限相关接口添加jwt验证
3. 个人信息相关接口添加改操作
4. 地址相关接口添加增删改查操作


### 新增页面&修改页面
1. 个人主页
2. 个人信息管理
3. 安全设置管理
4. 购物车与我的订单到主页
5. 联系我们
6. 地址管理
7. 同步验证规则（登录，注册，修改）

### git命令
git diff --shortstat origin/main..origin/dev -- '*.js'
git diff --shortstat origin/main..origin/dev -- '*.vue'
git diff origin/main..origin/dev -- '*.vue' | sed -n '/<script>/,/<\/script>/p' | grep '^-' | wc -l
git diff origin/main..origin/dev -- '*.vue' | sed -n '/<script>/,/<\/script>/p' | grep '^+' | wc -l
