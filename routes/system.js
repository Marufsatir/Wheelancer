const express = require("express");
const sql_system = require("../db/system_sql");

const router = express.Router();






router.post("/inserttuples", async(req, res) => {

    try {

        res.type('json')
        let super_auth = req.headers.super_auth
        if (super_auth == superkey) {
            await sql_system.insertTuples();
            res.sendStatus(200);
        } else
            res.sendStatus(401);


    } catch (error) {
        res.sendStatus(500);
        console.log(error)
    }
})


router.delete("/truncatetables", async(req, res) => {

    try {

        res.type('json')
        let super_auth = req.headers.super_auth
        if (super_auth == superkey) {
            await sql_system.truncatetables();
            res.sendStatus(200);
        } else
            res.sendStatus(401);


    } catch (error) {
        res.sendStatus(500);
        console.log(error)
    }
})

router.post("/inserttables", async(req, res) => {

    try {

        res.type('json')
        let super_auth = req.headers.super_auth
        if (super_auth == superkey) {
            await sql_system.insertTables();
            res.sendStatus(200);
        } else
            res.sendStatus(401);


    } catch (error) {
        res.sendStatus(500);
        console.log(error)
    }
})


router.get("/test", async(req, res) => {

    try {
        res.type('json')


        // let user_id = req.query.uid

        // let auth = req.headers.authorization

        // let resultCheckAuth = await sql.checkAuth(auth)


        if (resultCheckAuth.length) {
            let resultgetUsers = await sql.getUsers(user_id);
            res.status(200);
            res.json(resultgetUsers);
        } else {
            res.sendStatus(401);
        }

    } catch (error) {
        res.sendStatus(500);
        console.log(error)
    }

})



module.exports = router;