const express = require("express");
const { decodeAWT } = require('./utilities.js')
const AWS = require('aws-sdk');
const fs = require("fs")
const { v4: uuidv4 } = require('uuid');
const { route } = require("./system");
const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage });


const router = express.Router();

const package_sql = require("../db/package_sql")
const user_sql = require("../db/user_sql");


//Disabled
router.get("/getunverifiedcouriers", async(req, res) => {

    try {
        res.type('json')
        let user_id = req.query.uid

        let auth = req.headers.authorization

        let resultCheckAuth = await user_sql.checkAuthAdmin(auth, user_id)
        if (resultCheckAuth.length) {
            let resultUnverifiedCouriers = await user_sql.getUnverifiedCouriers(user_id);
            res.status(200);
            res.json(resultUnverifiedCouriers);
        } else {
            res.sendStatus(401);
        }

    } catch (error) {
        res.sendStatus(500);
        console.log(error)
    }
})

//Disabled
router.get("/getverifiedcouriers", async(req, res) => {

    try {
        res.type('json')
        let user_id = req.query.uid

        let auth = req.headers.authorization

        let resultCheckAuth = await user_sql.checkAuthAdmin(auth, user_id)
        if (resultCheckAuth.length) {
            let resultverifiedCouriers = await user_sql.getVerifiedCouriers(user_id);
            res.status(200);
            res.json(resultverifiedCouriers);
        } else {
            res.sendStatus(401);
        }

    } catch (error) {
        res.sendStatus(500);
        console.log(error)
    }
})

//Disabled
router.put("/verifycourier", async(req, res) => {

    try {
        res.type('json')
        let user_id = req.body.uid
        let courier_id = req.body.courier_id

        let auth = req.headers.authorization

        let resultCheckAuth = await user_sql.checkAuthAdmin(auth, user_id)

        if (resultCheckAuth.length) {
            let resultVerifyCourier = await user_sql.verifyCourier(user_id, courier_id);
            if (resultVerifyCourier && resultVerifyCourier.affectedRows) {
                res.sendStatus(200);
            } else {
                res.sendStatus(401);
            }
        } else { // If three are none uid of fid
            res.sendStatus(401);
        }
    } catch (error) {
        res.sendStatus(500);
        console.log(error)
    }
})




module.exports = router;