const express = require("express");
const package_sql = require("../db/package_sql")
const { decodeAWT } = require('./utilities.js')
const AWS = require('aws-sdk');
const fs = require("fs")
const { v4: uuidv4 } = require('uuid');
const { route } = require("./system");
const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage });


const router = express.Router();


const s3 = new AWS.S3({
    region: process.env.AWS_BUCKET_REGION,
    credentials: new AWS.SharedIniFileCredentials({
        profile: process.env.AWS_BUCKET_NAME
    })
})

// Gets courier's own packages return all of them
router.get("/couriertransportpackages", decodeAWT, async(req, res) => {

    try {
        res.type('json')

        let user_id = req.decoded.user_id
        let transport_id = req.query.transport_id

        if (req.decoded.type != 1) {
            return res.status(401).json({
                error: 'User must be courier.'
            })
        }

        let resultPackagesFromCourierTransport = await package_sql.getPackagesFromCourierTransport(transport_id, user_id);
        if (resultPackagesFromCourierTransport && resultPackagesFromCourierTransport.length) {

            res.status(200).json({
                result: resultPackagesFromCourierTransport
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



// Gets customer's own packages return all of them
router.get("/customerpackages", decodeAWT, async(req, res) => {

    try {
        res.type('json')

        let user_id = req.decoded.user_id

        if (req.decoded.type != 0) {
            return res.status(401).json({
                error: 'User must be customer.'
            })
        }

        let resultMyPackages = await package_sql.listMyPackages(user_id);
        if (resultMyPackages && resultMyPackages.length) {

            res.status(200).json({
                result: resultMyPackages
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

// Gets customer's own package
router.get("/customerpackage", decodeAWT, async(req, res) => {

    try {
        res.type('json')

        let user_id = req.decoded.user_id
        let package_id = req.query.package_id

        if (req.decoded.type != 0) {
            return res.status(401).json({
                error: 'User must be customer.'
            })
        }

        let resultPackage = await package_sql.getPackageFromUser(user_id, package_id);
        if (resultPackage && resultPackage.length) {

            res.status(200).json({
                result: resultPackage[0]
            })
        } else {

            res.status(404);
            res.json({
                error: "Package could not found."
            })
        }
    } catch (error) {
        res.sendStatus(500);
        console.log(error)
    }
})

/*

DO NOT DOCUMENT THIS

WARNING THIS END POINT WILL BE CONVERTED INTO /deliverpackage submit deliver from courier.


*/
//Add package proof to the system for courier and final delivery proof.
router.post("/addpackageproof", decodeAWT, async(req, res) => {

    try {
        res.type('json')

        let user_id = req.decoded.user_id
        let package_id = req.body.package_id
        let image_raw = Buffer.from(req.body.image_raw, 'base64');

        let resultCourierPackages = await package_sql.checkCourierPackage(user_id, package_id);

        res

        if (resultCourierPackages && resultAddPackage.length) {

            let fileKey = uuidv4()
            await s3.upload({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: fileKey,
                Body: image_raw,
                // ContentEncoding: 'image/png',
                // ContentEncoding: 'base64',
            }).promise()

            await package_sql.addPackageProof(resultAddPackage.insertId, 'DELIVERED', fileKey);

            res.status(200).json({
                result: 'Package proof added successfully.'
            })
        } else {
            res.status(404).json({
                error: 'Package could not be found.'
            })
        }
    } catch (error) {
        res.sendStatus(500);
        console.log(error)
    }
})


// Add customer's package to the system.
router.post("/addcustomerpackage", upload.any(), decodeAWT, async(req, res) => {

    try {
        res.type('json')

        let user_id = req.decoded.user_id
        let length = req.headers.length
        let width = req.headers.width
        let height = req.headers.height
        let weight = req.headers.weight
        let type = req.headers.type
        let s_long = req.headers.s_long
        let s_lat = req.headers.s_lat
        let d_long = req.headers.d_long
        let d_lat = req.headers.d_lat
        let receiver_email = req.headers.receiver_email
        let s_city = req.headers.s_city.toLocaleUpperCase()
        let d_city = req.headers.d_city.toLocaleUpperCase()
        let receiver_fullname = req.headers.receiver_fullname


        console.log('long=>', s_long, 'lat=>', s_lat);
        let resultAddPackage = await package_sql.addPackageToCustomer(user_id, length, width, height, weight, type, s_long, s_lat, d_long, d_lat, receiver_email, s_city, d_city, receiver_fullname);

        if (resultAddPackage && resultAddPackage.affectedRows) {

            let fileKey = uuidv4()
            await s3.upload({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: fileKey,
                Body: req.files[0].buffer,
                // ContentEncoding: 'image/png',
                // ContentEncoding: 'base64',
            }).promise()

            await package_sql.addPackageProof(resultAddPackage.insertId, 'INITIAL', fileKey);

            res.status(200).json({
                result: 'Package added successfully.'
            })
        } else {
            res.status(403).json({
                error: 'Package could not be added.'
            })
        }
    } catch (error) {
        res.sendStatus(500);
        console.log(error)
    }
})

// This works for both customer and courier.
router.get("/allpackageproofs", decodeAWT, async(req, res) => {

    try {
        res.type('json')

        let user_id = req.decoded.user_id
        let package_id = req.query.package_id
        let type = req.decoded.type


        let resultGetPackage = await package_sql.listPackageProofs(type, user_id, package_id);

        if (!resultGetPackage.length) {

            return res.status(200).json({
                result: []
            })
        }

        res.status(200).json({
            result: resultGetPackage
        })

    } catch (error) {
        res.sendStatus(500);
        console.log(error)
    }
})

// Get Package Proof Data
router.get("/packageproof", decodeAWT, async(req, res) => {

    try {
        res.type('json')

        let image_uuid = req.query.image_uuid


        let resultGetPackageProofImage = await package_sql.checkPackageProofUUID(image_uuid);

        if (!resultGetPackageProofImage.length) {

            return res.status(404).json({
                error: 'Proof image could not found.'
            });
        }

        let raw_image;
        try {


            raw_image = await s3.getObject({

                Bucket: process.env.AWS_BUCKET_NAME,
                Key: image_uuid,
            }).promise();


        } catch (error) {

            console.log(error);
            return res.status(405).json({
                error: 'Image file is missing in our system.'
            });


        }


        res.set('Content-Type', 'image/png')
        res.status(200).send(raw_image.Body);


    } catch (error) {
        res.sendStatus(500);
        console.log(error)
    }
})


// Deletes customer's package from the system.
router.delete("/customerpackage", decodeAWT, async(req, res) => {

    try {
        res.type('json')

        let user_id = req.decoded.user_id
        let package_id = req.query.package_id


        let resultGetPackage = await package_sql.getPackageFromUser(user_id, package_id);
        if (!resultGetPackage.length) {

            res.status(404);
            res.json({
                error: 'Package could not found.'
            })
            return;
        }

        if (resultGetPackage[0].status == 'CREATED') {


            let resultDeletePackage = await package_sql.removePackageFromCustomer(user_id, package_id);

            if (resultDeletePackage && resultDeletePackage.affectedRows) {

                res.status(200).json({
                    result: 'Package successfully removed from system.'
                })
            } else {

                res.status(403);
                res.json({
                    error: 'Package could not removed from system.'
                })
            }

        } else {

            res.status(409);
            res.json({
                error: 'Package has an active transportation process you can not remove it from system.'
            })

        }

    } catch (error) {
        res.sendStatus(500);
        console.log(error)
    }
})

module.exports = router;