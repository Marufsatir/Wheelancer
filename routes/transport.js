const express = require("express");
const user_sql = require("../db/user_sql");
const transport_sql = require("../db/transport_sql");
const package_sql = require("../db/package_sql")

const { decodeAWT } = require('./utilities.js')
const AWS = require('aws-sdk');
const fs = require("fs")
const { v4: uuidv4 } = require('uuid');
const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage });
const geolib = require('geolib');


const s3 = new AWS.S3({
    region: process.env.AWS_BUCKET_REGION,
    credentials: new AWS.SharedIniFileCredentials({
        profile: process.env.AWS_BUCKET_NAME
    })
})

const router = express.Router();


// Brings near packages to the courier.
router.get("/nearpackages", decodeAWT, async(req, res) => {

    try {
        res.type('json')

        let s_city = req.query.s_city
        let curr_pos_long = req.query.curr_pos_long
        let curr_pos_lat = req.query.curr_pos_lat
        let radius = req.query.radius

        if (req.decoded.type == 0) {
            return res.status(401).json({
                error: 'You do not have permission to perform this.'
            })
        }


        let resultAllPackages = await transport_sql.getAllPackagesInCity(s_city);
        let filteredPackages = resultAllPackages.filter((item) => {

            return geolib.isPointWithinRadius({ latitude: curr_pos_lat, longitude: curr_pos_long }, { latitude: item.s_lat, longitude: item.s_long },
                radius
            );

        })

        if (resultAllPackages && resultAllPackages.length) {



            res.status(200).json({
                result: filteredPackages
            })
        } else {

            res.status(200);
            res.json({
                result: []
            })
        }
    } catch (error) {
        res.sendStatus(500);
        console.log(error)
    }
})

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