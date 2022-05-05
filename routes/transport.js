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
const BinPacking3D = require('binpackingjs').BP3D;
const { Item, Bin, Packer } = BinPacking3D;

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

        let user_id = req.decoded.user_id
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

// Gets all offers detailed for couriers, minimal for customers
router.get("/showoffers", decodeAWT, async(req, res) => {

    try {
        res.type('json')

        let user_id = req.decoded.user_id

        let resultOffer;
        if (req.decoded.type == 0) {
            resultOffer = await transport_sql.getCustomerOffers(user_id);
        } else {

            resultOffer = await transport_sql.getCourierOffers(user_id);
        }

        if (resultOffer && resultOffer.length) {

            res.status(200).json({
                result: resultOffer
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

// Gets a single offer for customer.
router.get("/showoffer", decodeAWT, async(req, res) => {

    try {
        res.type('json')

        let user_id = req.decoded.user_id
        let offer_id = req.query.offer_id;


        if (req.decoded.type == 1) {
            return res.status(401).json({
                error: 'You do not have permission to perform this.'
            })
        }

        resultOffer = await transport_sql.getCustomerOffers(user_id);



        if (resultOffer && resultOffer.length) {

            res.status(200).json({
                result: resultOffer
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


// Gets a single offer for customer.
router.post("/acceptoffer", decodeAWT, async(req, res) => {

    try {
        res.type('json')

        let user_id = req.decoded.user_id
        let package_id = req.body.package_id
        let transport_id = req.body.transport_id;
        let courier_id = req.body.courier_id;


        if (req.decoded.type == 1) {
            return res.status(401).json({
                error: 'You do not have permission to perform this.'
            })
        }

        let resultMyPackage = await package_sql.getPackageFromUser(user_id, package_id)

        if (!resultMyPackage.length) {
            return res.status(401).json({
                error: 'You do not own this package.'
            })
        }

        let resultGetOffer = await transport_sql.getOfferDetails(package_id, courier_id, transport_id)

        if (!resultGetOffer.length) {
            return res.status(401).json({
                error: 'Courier did not send offer for this package.'
            })
        }

        if (resultMyPackage[0].transport_id || resultMyPackage[0].status != 'CREATED') {
            return res.status(401).json({
                error: 'You already have accepted an offer for this package.'
            })
        }

        //Set package NEGOTIATED
        let resultUpdatePackageStatus = await package_sql.updatePackageStatus(package_id, 'NEGOTIATED');
        let resultUpdatePackageTransportation = await package_sql.updatePackageTransportation(package_id, transport_id);
        if (resultUpdatePackageStatus.affectedRows && resultUpdatePackageTransportation.affectedRows) {

            res.status(200).json({
                result: 'Offer accepted.'
            })
        } else {

            res.status(407);
            res.json({
                error: 'Offer could not be accepted.'
            })
        }
    } catch (error) {
        res.sendStatus(500);
        console.log(error)
    }
})


// Remove offer if status = CREATED, NEGOTIATED for courier |  status = CREATED for customer
router.delete("/canceloffer", decodeAWT, async(req, res) => {

    try {
        res.type('json')

        let courier_id = req.decoded.type == 0 ? req.query.courier_id : req.decoded.user_id;
        let package_id = req.query.package_id;
        let transport_id = req.query.transport_id;


        let resultOfferDetails = await transport_sql.getOfferDetails(package_id, courier_id, transport_id)

        if (!resultOfferDetails.length) {
            return res.status(404).json({
                error: 'Offer could not be found.'
            })
        }

        let offerStatus = resultOfferDetails[0].status
        if (req.decoded.type == 0) {

            if (offerStatus != 'CREATED') {

                return res.status(406).json({
                    error: 'Offer cannot be removed after negotiation.'
                })
            }
        } else {
            if (offerStatus != 'CREATED' && offerStatus != 'NEGOTIATED') {

                return res.status(406).json({
                    error: 'Offer cannot be removed after picking up.'
                })
            }
        }

        let resultUpdatePackageStatus = await package_sql.updatePackageStatus(package_id, 'CREATED');
        let resultUpdatePackageTransportation = await package_sql.updatePackageTransportation(package_id, null);


        if (resultUpdatePackageStatus.affectedRows && resultUpdatePackageTransportation.affectedRows) {

            let resultCancel = await transport_sql.cancelOffer(package_id, courier_id, transport_id);

            if (resultCancel && resultCancel.affectedRows) {
                res.status(200).json({
                    result: 'Offer has been cancelled.'
                })
            } else {
                res.status(409).json({
                    result: 'Offer could not be cancelled.'
                })

            }
        } else {

            res.status(409).json({
                result: 'Package details could not be altered.'
            })
        }

    } catch (error) {
        res.sendStatus(500);
        console.log(error)
    }
})

// Picking up package for courier.
router.post("/pickupcargo", decodeAWT, async(req, res) => {

    try {
        res.type('json')

        let user_id = req.decoded.user_id
        let package_id = req.body.package_id


        if (req.decoded.type == 0) {
            return res.status(401).json({
                error: 'You do not have permission to perform this.'
            })
        }

        let resultMyPackage = await package_sql.checkCourierPackage(user_id, package_id)

        if (!resultMyPackage.length) {
            return res.status(401).json({
                error: 'You do not have permission to pickup this package.'
            })
        }

        if (resultMyPackage[0].status != 'NEGOTIATED') {
            return res.status(401).json({
                error: 'This package cannot be picked up at the moment.'
            })
        }

        //Set package PICKEDUP
        let resultUpdatePackageStatus = await package_sql.updatePackageStatus(package_id, 'PICKEDUP');


        //Remove rest of the offers.

        await transport_sql.removeUnwantedOffersExceptGiven(package_id, user_id, resultMyPackage[0].transport_id)

        let packageTotalVolume = resultMyPackage[0].width * resultMyPackage[0].length * resultMyPackage[0].height

        await transport_sql.decreaseRemainingValue(resultMyPackage[0].transport_id, packageTotalVolume, resultMyPackage[0].weight)

        if (resultUpdatePackageStatus.affectedRows) {

            res.status(200).json({
                result: 'Package successfully picked up.'
            })
        } else {

            res.status(407);
            res.json({
                error: 'Package could not be picked up.'
            })
        }
    } catch (error) {
        res.sendStatus(500);
        console.log(error)
    }
})


//Courier creates an offer
router.post("/addoffer", decodeAWT, async(req, res) => {

    try {
        res.type('json')


        let user_id = req.decoded.user_id
        let package_id = req.body.package_id;
        let transport_id = req.body.transport_id;
        let price = req.body.price;

        if (req.decoded.type != 1) {
            return res.status(401).json({
                error: 'User must be courier.'
            })
        }

        let resultVehicleFromTransport = await user_sql.getVehicleFromTransport(user_id, transport_id);
        let resultAllPackagesFromTransport = await package_sql.getPackagesFromUserTransport(transport_id, user_id);

        let currentPackage = await package_sql.getPackage(package_id);

        if (!currentPackage.length) {
            return res.status(412).json({
                error: 'Selected package could not found.'
            });
        }


        let used_weight = 0;
        let max_weight = parseFloat(resultVehicleFromTransport[0].max_weight);
        let max_height = parseFloat(resultVehicleFromTransport[0].max_height);
        let max_width = parseFloat(resultVehicleFromTransport[0].max_width);
        let max_length = parseFloat(resultVehicleFromTransport[0].max_length);

        let bin = await new Bin('Total Capacity', max_width, max_height, max_length, 0)
        let packer = await new Packer();
        await packer.addBin(bin);



        resultAllPackagesFromTransport.forEach(item => {
            used_weight += item.weight
            packer.addItem(new Item(item.pid + '', parseFloat(item.width), parseFloat(item.height), parseFloat(item.length), 0))
        })

        await packer.addItem(new Item('NEW ITEM', parseFloat(currentPackage[0].width), parseFloat(currentPackage[0].height), parseFloat(currentPackage[0].length), 0))
        used_weight += currentPackage[0].weight
        await packer.pack();

        if (packer.unfitItems.length) {
            return res.status(412).json({
                error: 'New cargo does not fit your vehicle.'
            });
        }

        if (max_weight < used_weight) {
            return res.status(412).json({
                error: 'New cargo exceeds maximum weight capacity of your vehicle.'
            });
        }

        let resultAddOffer = await transport_sql.addOffer(package_id, user_id, transport_id, price)

        if (resultAddOffer.affectedRows) {
            res.status(200).json({
                result: 'Offer successfully sent.'
            });
        } else {
            res.status(400).json({
                result: 'Offer could not sent.'
            });
        }

    } catch (error) {
        res.sendStatus(500);
        console.log(error)
    }
})


//Creates a transport
router.post("/add", decodeAWT, async(req, res) => {

    try {
        res.type('json')


        let user_id = req.decoded.user_id

        let vehicle_id = req.body.vehicle_id;
        let courier_pos_long = req.body.courier_pos_long;
        let courier_pos_lat = req.body.courier_pos_lat;
        let departure_date = req.body.departure_date;
        let arrival_date = req.body.arrival_date;

        if (req.decoded.type != 1) {
            return res.status(401).json({
                error: 'User must be courier.'
            })
        }

        let resultVehicle = await user_sql.getVehicle(user_id, vehicle_id)

        if (!resultVehicle.length) {
            return res.status(404).json({
                error: 'Vehicle could not found.'
            })
        }

        let remaining_volume = resultVehicle[0].max_length * resultVehicle[0].max_width * resultVehicle[0].max_height
        let resultCourierTransports = await transport_sql.addTransport(user_id, vehicle_id, courier_pos_long, courier_pos_lat, new Date(), remaining_volume, resultVehicle[0].max_weight, departure_date, arrival_date, 'CREATED')

        if (resultCourierTransports.affectedRows) {

            res.status(200).json({
                result: 'Transport successfully added.'
            });
        } else {

            res.status(200).json({
                result: 'Transport could not added.'
            });
        }

    } catch (error) {
        res.sendStatus(500);
        console.log(error)
    }
})

//Gets Courier's all transports
router.get("/getcouriertransports", decodeAWT, async(req, res) => {

    try {
        res.type('json')


        let user_id = req.decoded.user_id

        if (req.decoded.type != 1) {
            return res.status(401).json({
                error: 'User must be courier.'
            })
        }

        let resultCourierTransports = await transport_sql.getCourierTransports(user_id)

        if (resultCourierTransports.length) {

            res.json({
                result: resultCourierTransports
            });
            res.status(200);
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

module.exports = router;