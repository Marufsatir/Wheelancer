const express = require("express");
const package_sql = require("../db/package_sql")
const { decodeAWT } = require('./utilities.js')
const AWS = require('aws-sdk');
const fs = require("fs")
const { v4: uuidv4 } = require('uuid');
const { route } = require("./system");


const router = express.Router();


const s3 = new AWS.S3({
    region: process.env.AWS_BUCKET_REGION,
    credentials: new AWS.SharedIniFileCredentials({
        profile: process.env.AWS_BUCKET_NAME
    })
})




/*Gets customer's own packages return all of them
No body or query except header.

Out 1 (200):
{
	"result": [
		{
			"pid": 9,
			"cid": 69,
			"transport_id": 5,
			"length": 12.5,
			"width": 14.2,
			"height": 5.1,
			"weight": 12.4,
			"type": "Flammable,Oxidizing",
			"s_long": -99.79118,
			"s_lat": 17.08936,
			"d_long": -91.79118,
			"d_lat": 19.08936,
			"status": "CREATED",
			"receiver_email": "",
			"estimated_delivery_date": null,
			"chat_channel_id": null,
			"s_city": "",
			"d_city": ""
		}
	]
}
Out 2 (If there are none) (200):

{
	"result": []
}
*/
router.get("/customerpackages", decodeAWT, async(req, res) => {

    try {
        res.type('json')

        let user_id = req.decoded.user_id

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

/*Gets customer's own package

Query:
-package_id

Out 1 (200):
    {
	"result": {
		"pid": 10,
		"cid": 69,
		"transport_id": 5,
		"length": 12.5,
		"width": 14.2,
		"height": 5.1,
		"weight": 12.4,
		"type": "Flammable,Oxidizing",
		"s_long": -99.79118,
		"s_lat": 17.08936,
		"d_long": -91.79118,
		"d_lat": 19.08936,
		"status": "CREATED",
		"receiver_email": "",
		"estimated_delivery_date": null,
		"chat_channel_id": null,
		"s_city": "",
		"d_city": ""
	}

Out 2 (404):
    {
        error: "Package could not found."
    }
*/
router.get("/customerpackage", decodeAWT, async(req, res) => {

    try {
        res.type('json')

        let user_id = req.decoded.user_id
        let package_id = req.query.package_id

        let resultPackage = await package_sql.getPackage(user_id, package_id);
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


/*Add customer's package to the system.
Body:
{
	"length": 12.5,
	"width": 14.2,
	"height": 5.1,
	"weight": 12.4,
	"type": "Flammable,Oxidizing",
	"s_long": -99.79118,
	"s_lat": 17.08936,
	"d_long": -91.79118,
	"d_lat": 19.08936,
	"receiver_email": "",
	"s_city": "",
	"d_city" : "",
	"image_raw": "BASE64IMG"
}

Out1 (200):
{
	"result": "Package added successfully."
}

Out2 (403):
{
    error: 'Package could not be added.'
}

*/
router.post("/addcustomerpackage", decodeAWT, async(req, res) => {

    try {
        res.type('json')

        let user_id = req.decoded.user_id
        let length = req.body.length
        let width = req.body.width
        let height = req.body.height
        let weight = req.body.weight
        let type = req.body.type
        let s_long = req.body.s_long
        let s_lat = req.body.s_lat
        let d_long = req.body.d_long
        let d_lat = req.body.d_lat
        let receiver_email = req.body.receiver_email
        let s_city = req.body.s_city
        let d_city = req.body.d_city
        let image_raw = Buffer.from(req.body.image_raw, 'base64');
        let resultAddPackage = await package_sql.addPackageToCustomer(user_id, length, width, height, weight, type, s_long, s_lat, d_long, d_lat, receiver_email, s_city, d_city);

        if (resultAddPackage && resultAddPackage.affectedRows) {

            let fileKey = uuidv4()
            await s3.upload({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: fileKey,
                Body: image_raw,
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

/* This works for both customer and courier.

query:
package_id


Out1 (200):
{
	"result": [
		{
			"proof_id": 3,
			"type": "dfgsdg",
			"image": "sdfgdgf",
			"date": "2022-05-03T21:34:33.000Z"
		},
		{
			"proof_id": 4,
			"type": "asdasd",
			"image": "906fd724-ef4d-49a5-872f-f4c2294c8a01",
			"date": "2022-05-03T21:34:33.000Z"
		}
	]
}

Out2 (200):
{
	"result": []
}

*/
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

/*Get Package Proof Data
query:
-image_uuid

out1 (200):
{
    "result": "BASE64"
}

out 2 (404):
{
    error: 'Proof image could not found.'
}

out 3(405)
{
    error: 'Image file is missing in our system.'
}
*/
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
                Key: image_uuid
            }).promise();


        } catch (error) {

            console.log(error);
            return res.status(405).json({
                error: 'Image file is missing in our system.'
            });


        }

        let base64_image = raw_image.Body.toString('base64')

        res.status(200).json({
            result: base64_image
        });


    } catch (error) {
        res.sendStatus(500);
        console.log(error)
    }
})


/*Deletes customer's package to the system.
body:
{
	"package_id": 1
}

out1 (200):
{
    result: 'Package successfully removed from system.'
}

out 2 (404):

{
    error: 'Package could not found.'
}
out 3 (403):

{
    error: 'Package could not removed from system.'
}

out 4 (409):

{
    error: 'Package has an active transportation process you can not remove it from the system.'
}

*/
router.delete("/customerpackage", decodeAWT, async(req, res) => {

    try {
        res.type('json')

        let user_id = req.decoded.user_id
        let package_id = req.body.package_id


        let resultGetPackage = await package_sql.getPackage(user_id, package_id);

        console.log(resultGetPackage);
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