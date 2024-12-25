let express = require('express')
let router = express.Router()
let db = require("../mysql")

function listByUserId(req, resp){
    db.sql("SELECT * FROM contact WHERE user_id = ?", req.session.user.id)
    .then(res => {
        resp.send(res);
    }).catch(err => {
        console.log(err);
        resp.send({ code: 500, err })
    })
}


// 获取单个地址
function getById(req, resp) {
    const { id } = req.params;
    db.sql("SELECT * FROM contact WHERE id = ?", [id])
    .then(results => {
        if (results.length === 0) {
            return resp.status(404).send({ code: 404, message: "未找到该地址" });
        }
        resp.send(results[0]);
    }).catch(err => {
        console.log(err);
        resp.send({ code: 500, err });
    });
}

// 添加新地址
function addAddress(req, resp) {
    const { name, telephone, address, tag } = req.body;
    db.sql("INSERT INTO contact (name, telephone, address, tag, user_id) VALUES (?, ?, ?, ?, ?)", 
        name, telephone, address, tag, req.session.user.id)
    .then(results => {
        resp.status(201).send({ id: results.insertId, message: "地址添加成功" });
    }).catch(err => {
        console.log(err);
        resp.send({ code: 500, err });
    });
}

// 更新地址
function updateAddress(req, resp) {
    const { id } = req.params;
    const { name, telephone, address, tag } = req.body;
    db.sql("UPDATE contact SET name = ?, telephone = ?, address = ?, tag = ?, update_time = NOW() WHERE id = ?", 
        name, telephone, address, tag, id)
    .then(results => {
        if (results.affectedRows === 0) {
            return resp.status(404).send({ code: 404, message: "未找到该地址" });
        }
        resp.send({ code: 200, message: "地址更新成功" });
    }).catch(err => {
        console.log(err);
        resp.send({ code: 500, err });
    });
}

// 删除地址
function deleteAddress(req, resp) {
    const { id } = req.params;
    db.sql("DELETE FROM contact WHERE id = ?", id)
    .then(results => {
        if (results.affectedRows === 0) {
            return resp.status(404).send({ code: 404, message: "未找到该地址" });
        }
        resp.send({ message: "地址删除成功" });
    }).catch(err => {
        console.log(err);
        resp.send({ code: 500, err });
    });
}

// 路由绑定
router.get("/list", listByUserId);
router.get("/:id", getById);
router.post("/", addAddress);
router.put("/:id", updateAddress);
router.delete("/:id", deleteAddress);

module.exports = router
