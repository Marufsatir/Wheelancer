const express = require("express");
const package_sql = require("../db/package_sql")
const { decodeAWT } = require('./utilities.js')

const router = express.Router();


//Gets customer's own packages
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


//Gets customer's own package
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


//Add customer's package to the system.
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
        let city = req.body.city


        let resultAddPackage = await package_sql.addPackageToCustomer(user_id, length, width, height, weight, type, s_long, s_lat, d_long, d_lat, receiver_email, city);


        if (resultAddPackage && resultAddPackage.affectedRows) {

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


//Deletes customer's package to the system.
router.delete("/customerpackage", decodeAWT, async(req, res) => {

    try {
        res.type('json')

        let user_id = req.decoded.user_id
        let package_id = req.body.package_id


        let resultGetPackage = await package_sql.getPackage(user_id, package_id);

        if (!resultGetPackage && !resultGetPackage.length) {

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