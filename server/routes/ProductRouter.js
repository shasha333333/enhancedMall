let express = require('express')
let router = express.Router()
let db = require("../mysql")


/**
 * 获取商品列表
 */
function list(req, resp){
    console.log(req.query);
    let categoryId =  req.query.categoryId;
    let keyWord =  req.query.keyWord;
    let sql = "SELECT *,a.id AS aid,a.name AS aname FROM product a, product_detail b WHERE a.id = b.product_id"
    
    if (categoryId) 
        sql = sql + " and  a.category_id = " + categoryId
    if (keyWord && keyWord != "")
        sql = sql + " and  a.name like '%" + keyWord + "%'"
    console.log(sql)
    let lastObj = null;
    db.sql(sql).then(res => {
        //console.log(res);
        let data = [] ;
        for (let i=0;i<res.length;i++){
            //判断是否和前一条记录是同一个商品    
            if (lastObj && lastObj.id == res[i].aid ){
                lastObj.details.push({
                        id : res[i].id,
                        name : res[i].name,
                        image : res[i].image,
                        stock : res[i].stock,
                        price : res[i].price,
                        salePrice : res[i].sale_price, 
                })
            }else{
                let obj = {
                    id : res[i].aid,
                    name : res[i].aname,
                    description : res[i].description,
                    categoryId : res[i].category_id,
                    showIndex : res[i].show_index,
                    details : [{
                        id : res[i].id,
                        name : res[i].name,
                        image : res[i].image,
                        stock : res[i].stock,
                        price : res[i].price,
                        salePrice : res[i].sale_price,
                    }]
                }
                lastObj = obj;
                data.push(obj);
            }
        }
        resp.send(data);
    }).catch(err => {
        console.log(err);
        resp.send({ code: 500, err })
    })
}

/**
 * 获取单个商品
 */
function getById(req, resp){
    let id =  req.query.id
    let sql = "SELECT *,a.id AS aid,a.name AS aname FROM product a, product_detail b WHERE a.id = b.product_id and a.id = ?"
    db.sql(sql, id).then(res => {
        //console.log(res);
        let product;
        for (let i=0;i<res.length;i++){
            //判断是否和前一条记录是同一个商品    
            if (i > 0){
                product.details.push({
                        id : res[i].id,
                        name : res[i].name,
                        image : res[i].image,
                        stock : res[i].stock,
                        price : res[i].price,
                        salePrice : res[i].sale_price, 
                })
            }else{
                product = {
                    id : res[i].aid,
                    name : res[i].aname,
                    description : res[i].description,
                    categoryId : res[i].category_id,
                    showIndex : res[i].show_index,
                    details : [{
                        id : res[i].id,
                        name : res[i].name,
                        image : res[i].image,
                        stock : res[i].stock,
                        price : res[i].price,
                        salePrice : res[i].sale_price,
                    }]
                }                
            }
        }
        resp.send(product);
    }).catch(err => {
        console.log(err);
        resp.send({ code: 500, err })
    })
}

router.get("/getById", getById)


router.get("/list", list)


module.exports = router
