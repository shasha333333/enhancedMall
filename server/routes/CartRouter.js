let express = require('express')
let router = express.Router()
let db = require("../mysql")

/**
 * 商品加入购物车
 */
function addCart(req, resp) {
    console.log(req.body);
    let productId = req.body.productId;     //商品id
    let detailId = req.body.detailId;       //具体商品id
    let number = req.body.quantity;         //商品数量
    let userId = req.session.user.id;       //当前登录用户id    
    // 这里应该要验证数据的合法性，比如用户id是否存在，储存是否足够等信息
    
    // 这里暂时不做验证
    db.sql("select * from cart where product_id = ? and detail_id = ? and user_id = ?", productId, detailId, userId)
        .then(res => {
            let now = new Date()
            // 如果已经存在了这条记录，只要添加就数量就好了
            if (res.length > 0) {
                let cartId = res[0].id;
                db.sql("update cart set quantity = quantity + ?, update_time = ? where id = ? ", number, now, cartId)
                    .then(res => {
                        resp.send({ code: 200, message: "更新成功！" })
                    })
                    .catch(err => {
                        console.log(err);
                        resp.send({ code: 500, err })
                    })
            }
            // 否则就是新增
            else {
                db.sql("insert into cart(quantity, checked, product_id, detail_id, user_id, create_time, update_time) values(?, ?, ?, ?, ?, ?, ?)",
                    number, true, productId, detailId, userId, now, now)
                    .then(res => {
                        resp.send({ code: 200, message: "添加成功！" })
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
 * 查询用户购物车中的商品
 */
function listByUserId(req, resp) {
    let userId = req.session.user.id;
    db.sql(`SELECT *, a.id AS pid,b.id AS pdid,a.name AS pname
FROM product a,product_detail b,cart c 
WHERE c.product_id = a.id AND c.detail_id = b.id AND c.user_id = ?`, userId)
        .then(res => {
            resp.send(res);
        })
        .catch(err => {
            console.log(err);
            resp.send({ code: 500, err })
        })
}

/**
 * 移除购物车中的某个商品
 */
function deleteById(req, resp) {
    let cartId = req.body.id
    db.sql("delete from cart where id = ?", cartId)
        .then(res => {
            resp.send({ code: 200, message: "删除成功！" })
        })
        .catch(err => {
            console.log(err);
            resp.send({ code: 500, err })
        })
}

/**
 * 改变购物车中商品的选中状态
 */
function changeChecked(req, resp) {
    let userId = req.session.user.id
    let checked = req.body.checked
    let cartId = req.body.cartId
    let sql = "update cart set checked = ? where user_id = ? "
    if (cartId) sql += " and id = ?"
    db.sql(sql, checked, userId, cartId)
        .then(res => {
            resp.send({ code: 200, message: "更新选中状态成功" })
        })
        .catch(err => {
            console.log(err);
            resp.send({ code: 500, err })
        })
}

/**
 * 改变购物车中商品的数量
 */
function changeQuantity (req, resp) {
    let userId = req.session.user.id
    let number = req.body.number
    let cartId = req.body.cartId
    db.sql("update cart set quantity = ? where user_id = ? and id = ?", number, userId, cartId)
        .then(res => {
            resp.send({ code: 200, message: "更新数量成功" })
        })
        .catch(err => {
            console.log(err);
            resp.send({ code: 500, err })
        })
}

router.post("/add", addCart)
router.get("/list", listByUserId)
router.post("/delete", deleteById)
router.post("/checked", changeChecked)
router.post("/quantity", changeQuantity)

module.exports = router
