const express = require("express");
const user_sql = require("../db/user_sql");
const transport_sql = require("../db/transport_sql");
const package_sql = require("../db/package_sql")

const { decodeAWT, generateDeliveryConfirmMessage } = require('./utilities.js')
const AWS = require('aws-sdk');
const fs = require("fs")
const { v4: uuidv4 } = require('uuid');
const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage });
const geolib = require('geolib');
const BinPacking3D = require('binpackingjs').BP3D;
const { Item, Bin, Packer } = BinPacking3D;
const nodemailer = require("nodemailer");
const s3 = new AWS.S3({
    region: process.env.AWS_BUCKET_REGION,
    credentials: new AWS.SharedIniFileCredentials({
        profile: process.env.AWS_BUCKET_NAME
    })
})
var CryptoJS = require("crypto-js");
const router = express.Router();

var mailObj = nodemailer.createTransport({
    service: 'outlook',
    auth: {
        user: process.env.MAIL,
        pass: process.env.MAIL_PASS
    }
});


// Gets courier's current location to a customer.
router.get("/getcourierlocation", decodeAWT, async(req, res) => {

    try {
        res.type('json')

        let user_id = req.decoded.user_id
        let package_id = req.query.package_id


        if (req.decoded.type == 1) {
            return res.status(401).json({
                error: 'You need to be a customer.'
            })
        }
        let resultCustomerPackage = await transport_sql.getTransportFromCustomerPackage(user_id, package_id)

        if (!resultCustomerPackage || !resultCustomerPackage.length) {

            return res.status(404).json({
                error: 'Package could not found or does not have a carrier.'
            })
        }

        return res.status(200).json({
            result: {
                long: resultCustomerPackage[0].courier_pos_long,
                lat: resultCustomerPackage[0].courier_pos_lat,
                update_date: resultCustomerPackage[0].last_update_date
            }
        })


    } catch (error) {
        res.sendStatus(500);
        console.log(error)
    }
})

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
        let resultAllPackages = await transport_sql.getAllPackagesInCity(s_city.toUpperCase());
        let filteredPackages = resultAllPackages.filter((item) => {

            return geolib.isPointWithinRadius({ latitude: item.s_lat, longitude: item.s_long }, { latitude: curr_pos_lat, longitude: curr_pos_long },
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


        let resultGetUserDetails = await user_sql.getUser(user_id)

        if (resultGetUserDetails[0].balance < resultGetOffer[0].price) {
            return res.status(412).json({
                error: 'You do not have enough balance to accept this offer.'
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

        await transport_sql.upIncrRemainingValue(resultMyPackage[0].transport_id, -1 * packageTotalVolume, -1 * resultMyPackage[0].weight)

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


// Delivering package for courier with sending photo and verification mail for receiver.
router.post("/deliverpackage", upload.any(), decodeAWT, async(req, res) => {

    try {
        res.type('json')

        let user_id = req.decoded.user_id
        let package_id = req.headers.package_id

        if (req.decoded.type == 0) {
            return res.status(401).json({
                error: 'You do not have permission to perform this.'
            })
        }

        let resultMyPackage = await package_sql.checkCourierPackage(user_id, package_id)

        if (!resultMyPackage.length) {
            return res.status(401).json({
                error: 'You do not have permission to deliver this package.'
            })
        }

        if (resultMyPackage[0].status != 'PICKEDUP') {
            return res.status(401).json({
                error: 'This package cannot be delivered at the moment.'
            })
        }

        let package = {
            user_id: user_id,
            package_id: package_id,
            salt: new Date().toISOString()
        }


        let encryptedDeliveryConfirm = CryptoJS.AES.encrypt(JSON.stringify(package), process.env.PRIVATE_KEY).toString()

        //Upload Image

        let fileKey = uuidv4()
        await s3.upload({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: fileKey,
            Body: req.files[0].buffer,
            // ContentEncoding: 'image/png',
            // ContentEncoding: 'base64',
        }).promise()


        let receiverConfirmAdress = `http://${process.env.HOST}:${process.env.PORT}/transport/confirmdelivery?code=${encodeURIComponent(encryptedDeliveryConfirm)}`
            //Send mail.
        try {


            await mailObj.sendMail({
                from: `"Wheelancer" <${process.env.MAIL}>`, // sender address
                to: resultMyPackage[0].receiver_email, // list of receivers
                subject: "Package Delivery Confirmation 📦", // Subject line
                html: `<!DOCTYPE html>
                <html>
                
                <body style="background-color: #f4f4f4; margin: 0 !important; padding: 0 !important;">
                    <!-- HIDDEN PREHEADER TEXT -->
                    <div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: 'Lato', Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;"> We're thrilled to have you here! Get ready to dive into your new account. </div>
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                        <!-- LOGO -->
                        <tr>
                            <td bgcolor="#49c53b" align="center">
                                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                    <tr>
                                        <td align="center" valign="top" style="padding: 40px 10px 40px 10px;"> </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td bgcolor="#49c53b" align="center" style="padding: 0px 10px 0px 10px;">
                                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                    <tr>
                                        <td bgcolor="#ffffff" align="center" valign="top" style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;">
                                            <h1 style="font-size: 30px; font-weight: 400; margin: 2;">Wheelancer Delivery Confirmation!</h1> <img src="https://img.icons8.com/clouds/100/000000/handshake.png" width="125" height="120" style="display: block; border: 0px;" />
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
                                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                    <tr>
                                        <td bgcolor="#ffffff" align="left" style="padding: 20px 30px 40px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                            <p style="margin: 0;">Dear ${resultMyPackage[0].receiver_fullname},</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td bgcolor="#ffffff" align="left" style="padding: 20px 30px 40px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                            <p style="margin: 0;">Please click that button in order to confirm delivery!</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td bgcolor="#ffffff" align="left">
                                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                <tr>
                                                    <td bgcolor="#ffffff" align="center" style="padding: 20px 30px 60px 30px;">
                                                        <table border="0" cellspacing="0" cellpadding="0">
                                                            <tr>
                                                                <td align="center" style="border-radius: 3px;" bgcolor="#96be25">
                                                                    <td align="center" style="border-radius: 3px;" bgcolor="#96be25"><a href="${receiverConfirmAdress}" target="_blank" style="font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 2px; border: 1px solid #96be25; display: inline-block;">Confirm Delivery</a></td>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    <!-- COPY -->
                                    <tr>
                                        <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 40px 30px; color: #000000; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                            <p style="margin: 0;">Wheelancer.</p>
                                        </td>
                                    </tr>
                                    <!-- COPY -->
                
                                </table>
                            </td>
                        </tr>
                
                    </table>
                </body>
                
                </html>`
            })

        } catch (error) {
            res.status(407).json({
                error: 'Package delivery confirm mail failed to sent.'
            })
        }

        //Set package DELIVERED


        let resultaddPackageProof = await package_sql.addPackageProof(package_id, 'DELIVERED', fileKey);

        if (!resultaddPackageProof.affectedRows) {
            return res.status(408).json({
                error: 'Package delivery proof could not be added.'
            })
        }

        let resultUpdatePackageStatus = await package_sql.updatePackageStatus(package_id, 'DELIVERED');

        if (resultUpdatePackageStatus.affectedRows) {
            return res.status(407).json({
                error: 'Package delivery could not be reported.'
            })
        }



        res.status(200).json({
            result: 'Package delivery successfully reported.'
        })


    } catch (error) {
        res.sendStatus(500);
        console.log(error)
    }
})

// Confirming delivery from  receiver via url
router.get("/confirmdelivery", async(req, res) => {

    try {
        res.type('json')

        let decryptedJson;

        res.set('Content-Type', 'text/html');

        try {
            decryptedJson = JSON.parse(CryptoJS.AES.decrypt(req.query.code, process.env.PRIVATE_KEY).toString(CryptoJS.enc.Utf8))
        } catch (error) {

            return res.send(Buffer.from(generateDeliveryConfirmMessage(null, null, 'Could not detect correct code!')));
        }


        let resultMyPackage = await package_sql.checkCourierPackage(decryptedJson.user_id, decryptedJson.package_id)

        if (!resultMyPackage.length) {
            return res.send(Buffer.from(generateDeliveryConfirmMessage(null, null, 'Could not find package!')));
        }

        if (resultMyPackage[0].status == 'CONFIRMED') {
            return res.send(Buffer.from(generateDeliveryConfirmMessage(null, null, 'Package is already confirmed.')));
        }

        if (resultMyPackage[0].status != 'DELIVERED') {
            return res.send(Buffer.from(generateDeliveryConfirmMessage(null, null, 'Package is not ready for confirming!')));
        }


        //Get offer details to learn about price.
        let getOfferDetails = await transport_sql.getOfferDetails(decryptedJson.package_id, decryptedJson.user_id, resultMyPackage[0].transport_id)


        if (!getOfferDetails.length) {
            return res.send(Buffer.from(generateDeliveryConfirmMessage(null, null, 'Package offer could not be detected.')));

        }


        //Transfer Customer's balance to Courier.
        await user_sql.updateBalance(decryptedJson.user_id, getOfferDetails[0].price);
        await user_sql.updateBalance(resultMyPackage[0].cid, -1 * getOfferDetails[0].price)


        let packageTotalVolume = resultMyPackage[0].width * resultMyPackage[0].length * resultMyPackage[0].height

        await transport_sql.upIncrRemainingValue(resultMyPackage[0].transport_id, packageTotalVolume, resultMyPackage[0].weight)


        let resultDeleteOffer = await transport_sql.cancelOffer(decryptedJson.package_id, decryptedJson.user_id, resultMyPackage[0].transport_id)

        if (!resultDeleteOffer.affectedRows) {
            return res.send(Buffer.from(generateDeliveryConfirmMessage(null, null, "Current delivery's offer could not be removed.")));
        }

        //Set package DELIVERED

        let resultUpdatePackageStatus = await package_sql.updatePackageStatus(decryptedJson.package_id, 'CONFIRMED');

        if (!resultUpdatePackageStatus.affectedRows) {

            return res.send(Buffer.from(generateDeliveryConfirmMessage(null, null, "Package delivery confirmation could not be reported.")));
        }


        return res.send(Buffer.from(generateDeliveryConfirmMessage(resultMyPackage[0].receiver_fullname, 'SUCCESS')));


    } catch (error) {
        res.sendStatus(500);
        console.log(error)
    }
})

//Update courier's current position.
router.put("/currentposition", decodeAWT, async(req, res) => {

    try {
        res.type('json')


        let user_id = req.decoded.user_id
        let curr_long = req.body.curr_long
        let curr_lat = req.body.curr_lat

        if (req.decoded.type != 1) {
            return res.status(401).json({
                error: 'User must be courier.'
            })
        }

        await transport_sql.updateCourierPosition(user_id, curr_long, curr_lat)

        return res.status(200).json({
            error: "Courier's current position updated in all transports."
        });

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

        if (!resultVehicleFromTransport.length) {
            return res.status(413).json({
                error: 'Selected travel does not have a vehicle.'
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

            res.status(407).json({
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