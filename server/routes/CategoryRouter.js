let express = require('express')
let router = express.Router()
let db = require("../mysql")

/**
 * 获取商品分类列表
 */
function list(req, resp){
    db.sql("SELECT * FROM product_category").then(res => {
        resp.send(res);
    }).catch(err => {
        console.log(err);
        resp.send({ code: 500, err })
    })
}

router.get("/list", list)

module.exports = router
