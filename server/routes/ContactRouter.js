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

router.get("/list", listByUserId)

module.exports = router
