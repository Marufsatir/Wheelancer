const express = require("express");
const user_sql = require("../db/user_sql");
const transport_sql = require("../db/transport_sql");

const router = express.Router();


//Disabled
router.get("/alltransports", async(req, res) => {

    try {
        res.type('json')
        let user_id = req.query.uid
        let auth = req.headers.authorization

        let resultCheckAuth = await user_sql.checkAuth(auth)

        if (resultCheckAuth.length) {
            let resultAllTransports = await transport_sql.listAllTransports();
            if (resultAllTransports && resultAllTransports.length) {

                resultAllTransports.forEach((item) => {
                    //item.status = "aaa"
                });

                res.json(resultAllTransports);
                res.status(200);
            } else {

                res.status(200);
                res.json([])
            }
        } else {
            res.sendStatus(401);
        }
    } catch (error) {
        res.sendStatus(500);
        console.log(error)
    }
})

//Disabled
router.get("/mytransports", async(req, res) => {

    try {
        res.type('json')
        let user_id = req.query.uid
        let auth = req.headers.authorization

        let resultCheckAuth = await user_sql.checkAuthType(auth, user_id)

        if (resultCheckAuth.length) {
            let resultMyTransports = await transport_sql.listMyTransports(user_id);
            if (resultMyTransports && resultMyTransports.length) {

                res.json(resultMyTransports);
                res.status(200);
            } else {

                res.status(200);
                res.json([])
            }
        } else {
            res.sendStatus(401);
        }
    } catch (error) {
        res.sendStatus(500);
        console.log(error)
    }
})

module.exports = router;