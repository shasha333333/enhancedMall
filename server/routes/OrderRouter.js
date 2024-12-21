let express = require('express')
let router = express.Router()
let db = require("../mysql")
const moment = require('moment')
function buy(req, resp){
    let contactId = req.body.contactId
    let products = req.body.products
    let userId = req.session.user.id
    let totalPrice = 0;
    for ( let p of products ) {
        if (p.checked)
            totalPrice += p.sale_price * p.quantity
    }
    let orderId = moment().format("YYYYMMDDHHmmssSSS");
    db.sql("insert into `order` values(?, ?, 0, now(), now(), ?, ?)", orderId, totalPrice, contactId, userId)
     .then(res => {
        // 非0为真，则插入成功
        if ( !res.affectedRows ) {
            resp.send({code:500, message:"生成订单失败"});
            return
        }
        let insertOrderDetailSQL = "insert into order_detail(quantity, create_time, update_time, order_id, product_id, detail_id) values"
        for (let p of products )  {
            if (p.checked){
                insertOrderDetailSQL += " ( "
                insertOrderDetailSQL += p.quantity+",now(),now(),'"+orderId+"',"+p.product_id+","+p.detail_id;
                insertOrderDetailSQL += " ) ,"
            }
        }
        //去掉最后一个逗号
        insertOrderDetailSQL = insertOrderDetailSQL.substring(0, insertOrderDetailSQL.length - 1);
        db.sql(insertOrderDetailSQL)
         .then(res => {
            if ( !res.affectedRows ) {
                resp.send({code:500, message:"生成订单明细失败"});
                return
            }
            // 删除购物车中的数据
            let deleteCartSQL = "delete from cart where id in "
            deleteCartSQL += "( "
            for ( let p of products ){
                if (p.checked){
                    deleteCartSQL += p.id+","
                }
            }
            deleteCartSQL = deleteCartSQL.substring(0, deleteCartSQL.length - 1)
            deleteCartSQL += " )"
            db.sql(deleteCartSQL)
             .then(res => {
                if ( !res.affectedRows ) {
                    resp.send({code:500, message:"删除购物车信息失败"});
                    return
                }
                resp.send({code:200, message:"生成订单成功", data:orderId});
             });
         });
    });    
}

function pay(req, resp){
    let userId = req.session.user.id
    let orderId = req.body.orderId

    db.sql("update `order` set paid = true where id = ? and user_id = ?", orderId, userId)
        .then(res => {
            if ( res.affectedRows )
                resp.send({code:200, message:"支付成功"});
            else
                resp.send({code:500, message:"支付失败"});
        })
}

function list(req, resp){
    let userId = req.session.user.id
    let lastObj = null;
    db.sql(`SELECT a.id,a.price,a.paid,a.create_time,c.name AS contact_name,d.name AS product_name,e.id AS detail_id,d.id AS product_id,e.name AS detail_name,b.quantity,e.sale_price,e.image
FROM \`order\` a,order_detail b,contact c,product d,product_detail e
WHERE a.id = b.order_id AND a.contact_id = c.id AND b.product_id = d.id AND b.detail_id = e.id and a.user_id = ?
ORDER BY a.id`, userId)
    .then(res => {
        let data = [] ;
        for (let i=0;i<res.length;i++){
            //判断是否和前一条记录是同一个订单   
            if (lastObj && lastObj.id == res[i].id ){
                lastObj.details.push({
                        detail_id : res[i].detail_id,
                        product_id: res[i].product_id,
                        product_name : res[i].product_name,
                        detail_name : res[i].detail_name,
                        quantity : res[i].quantity,
                        sale_price : res[i].sale_price, 
                        image : res[i].image,                        
                })
            }else{
                let obj = {
                    id : res[i].id,
                    price : res[i].price,
                    paid : res[i].paid,
                    create_time : moment(res[i].create_time).format("YYYY-MM-DD HH:mm:ss"),
                    contact_name : res[i].contact_name,
                    details : [{
                        detail_id : res[i].detail_id,
                        product_id: res[i].product_id,
                        product_name : res[i].product_name,
                        detail_name : res[i].detail_name,
                        quantity : res[i].quantity,
                        sale_price : res[i].sale_price, 
                        image : res[i].image,
                    }]
                }
                lastObj = obj;
                data.push(obj);
            }
        }
        resp.send(data);
    })
}

router.post("/buy", buy)
router.post("/pay", pay)
router.get("/list", list)

module.exports = router
