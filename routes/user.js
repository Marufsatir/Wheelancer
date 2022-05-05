const express = require("express");
const sql = require("../db/user_sql");
var jwt = require('jsonwebtoken');
let crypto = require('crypto');
const nodemailer = require("nodemailer");
const { decodeAWT } = require("./utilities.js")
require('dotenv').config()
const AWS = require('aws-sdk');
const fs = require("fs")
const { v4: uuidv4 } = require('uuid');
const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage });

const s3 = new AWS.S3({
    region: process.env.AWS_BUCKET_REGION,
    credentials: new AWS.SharedIniFileCredentials({
        profile: process.env.AWS_BUCKET_NAME
    })
})



const PRIVATE_KEY = process.env.PRIVATE_KEY


var mailObj = nodemailer.createTransport({
    service: 'outlook',
    auth: {
        user: process.env.MAIL,
        pass: process.env.MAIL_PASS
    }
});


const router = express.Router();


//Only checks token for persistent login.
router.post("/checktoken", decodeAWT, async(req, res) => {

    try {
        res.type('json')

        res.sendStatus(200)


    } catch (error) {
        res.sendStatus(500);
        console.log(error)
    }

})

// Add vehicle to courier.
router.post("/addvehicle", decodeAWT, async(req, res) => {

    try {
        res.type('json')

        let user_id = req.decoded.user_id
        let model = req.body.model
        let brand = req.body.brand
        let max_length = req.body.max_length
        let max_width = req.body.max_width
        let max_height = req.body.max_height
        let max_weight = req.body.max_weight
        let horsepower = req.body.horsepower
        let registration_plate = req.body.registration_plate
        let vehicle_type = req.body.type

        if (req.decoded.type != 1) {
            return res.status(401).json({
                error: 'User must be courier.'
            })
        }
        let resultAddVehicle = await sql.addVehicle(user_id, model, brand, max_length, max_width, max_height, max_weight, horsepower, registration_plate, vehicle_type);

        if (resultAddVehicle && resultAddVehicle.affectedRows) {

            res.status(200).json({
                result: 'Vehicle successfully added.'
            })


        } else { // User entered mail or username that has a user.
            res.status(407).json({
                error: 'Vehicle could not be added.'
            })
        }

    } catch (error) {
        res.sendStatus(500);
        console.log(error)
    }

})

// Returns courier's vehicles
router.get("/myvehicles", decodeAWT, async(req, res) => {

    try {
        res.type('json')

        let user_id = req.decoded.user_id

        let resultGetVehicles = await sql.getVehicles(user_id);

        if (resultGetVehicles && resultGetVehicles.length) {

            res.status(200).json({
                result: resultGetVehicles
            })


        } else {
            res.status(200).json({
                result: []
            })
        }

    } catch (error) {
        res.sendStatus(500);
        console.log(error)
    }
})

// Adds document to the courier to be verified
router.post("/adddocument", upload.any(), decodeAWT, async(req, res) => {

    try {
        res.type('json')

        let user_id = req.decoded.user_id
        let fileKey = uuidv4()



        let resultAddDocument = await sql.addDocument(user_id, fileKey);

        if (resultAddDocument && resultAddDocument.affectedRows) {


            await s3.upload({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: fileKey,
                Body: req.files[0].buffer,
                // ContentEncoding: 'image/png',
                // ContentEncoding: 'base64',
            }).promise()



            res.status(200).json({
                result: 'Document added successfully.'
            })
        } else {
            res.status(402).json({
                error: 'You have already uploaded your document.'
            })
        }
    } catch (error) {
        res.sendStatus(500);
        console.log(error)
    }
})

// Gets document data for courier.
router.get("/mydocument", decodeAWT, async(req, res) => {

    try {
        res.type('json')

        let user_id = req.decoded.user_id

        let resultGetDocumentImage = await sql.getMyDocument(user_id);

        if (resultGetDocumentImage && resultGetDocumentImage.length) {
            try {
                raw_image = await s3.getObject({

                    Bucket: process.env.AWS_BUCKET_NAME,
                    Key: resultGetDocumentImage[0].document,
                }).promise();


            } catch (error) {

                console.log(error);
                return res.status(405).json({
                    error: 'Document file is missing in our system.'
                });
            }
            res.set('Content-Type', 'image/png')
            res.status(200).send(raw_image.Body);

        } else {
            res.status(404).json({
                error: 'Document could not found.'
            })
        }
    } catch (error) {
        res.sendStatus(500);
        console.log(error)
    }
})

// Register user to the system.
router.post("/register", async(req, res) => {

    try {
        res.type('json')
        let name = req.body.name
        let surname = req.body.surname
        let birthday = new Date(req.body.birthday)
        let idnum = req.body.idnum
        let email = req.body.email
        let password = req.body.password
        let type = req.body.type
        let super_auth = req.headers.super_auth

        let isVerified;

        // try {
        //     isVerified = await require('verify-tc').verifyTC({
        //         name: name,
        //         surname: surname,
        //         tcNumber: parseInt(idnum),
        //         birthYear: birthday.getFullYear(),
        //     });
        // } catch (error) {}


        // if (!isVerified) {
        //     res.status(401).json({
        //         error: 'Please check your ID number, birthday and full name.'
        //     })
        //     return;
        // }


        let resultAddUser = await sql.addUser(name, surname, birthday, idnum, email, password);


        if (resultAddUser && resultAddUser.affectedRows) {

            let user_id = resultAddUser.insertId

            let token = jwt.sign({
                user_id: user_id,
                type: type
            }, PRIVATE_KEY, {
                expiresIn: process.env.AUTH_EXP_TIME
            })

            if (type == 0) // Customer
                await sql.addCustomer(user_id);
            else if (type == 1) //Courier
                await sql.addCourier(user_id);
            else if (type == 2 && super_auth == process.env.ADMIN_SUPER_KEY) //Admin 
                await sql.addAdmin(user_id);


            let resultNewlyAddedUser = (await sql.getUser(user_id))[0];

            resultNewlyAddedUser.type = type
                // sql.addAuth(token = tokgen.generate(), user_id)
            res.status(200).json({
                result: {
                    user: resultNewlyAddedUser,
                    token: token
                }
            });

        } else { // User entered mail or username that has a user.
            res.status(406).json({
                error: 'User already exists.'
            })
        }


    } catch (error) {
        res.sendStatus(500);
        console.log(error)
    }

})

// Send mail verificaiton for users.
router.post("/sendverification", decodeAWT, async(req, res) => {
    try {
        res.type('json')
        let code = crypto.randomInt(1000, 10000)

        let expireDate = new Date()

        expireDate.setMinutes(expireDate.getMinutes() + parseInt(process.env.MAIL_EXP_TIME))

        let user_id = req.decoded.user_id

        let resultListVerCodes = await sql.listVerificationCodes(user_id);

        if (resultListVerCodes && resultListVerCodes.length > 4) {
            res.status(429).json({
                error: 'User requested verification code more than 5 times. Please try again in 10 minutes.'
            })
            return;
        }

        let createResult = await sql.createVerificationCode(user_id, expireDate, code);

        code = code.toString()
        if (!createResult.affectedRows) {
            res.status(500).json({
                error: 'Could not create verification code.'
            })
            return;
        }

        let resultUser = (await sql.getUser(user_id))[0];


        if (resultUser.email_verified) {

            return res.status(409).json({
                error: 'User is already verified.'
            })
        }

        try {
            await mailObj.sendMail({
                from: `"Wheelancer" <${process.env.MAIL}>`, // sender address
                to: resultUser.email, // list of receivers
                subject: "Here is your verification code", // Subject line
                html: `<!DOCTYPE html>
                    <html>
                    
                    <body style="background-color: #f4f4f4; margin: 0 !important; padding: 0 !important;">
                        <!-- HIDDEN PREHEADER TEXT -->
                        <div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: 'Lato', Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;"> We're thrilled to have you here! Get ready to dive into your new account. </div>
                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                            <!-- LOGO -->
                            <tr>
                                <td bgcolor="#FFA73B" align="center">
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                        <tr>
                                            <td align="center" valign="top" style="padding: 40px 10px 40px 10px;"> </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td bgcolor="#FFA73B" align="center" style="padding: 0px 10px 0px 10px;">
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                        <tr>
                                            <td bgcolor="#ffffff" align="center" valign="top" style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;">
                                                <h1 style="font-size: 30px; font-weight: 400; margin: 2;">Wheelancer Mail Verification!</h1> <img src=" https://i.imgur.com/PZKQByd.png" width="125" height="120" style="display: block; border: 0px;" />
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
                                                <p style="margin: 0;">We're excited to have you get started. First, you need to confirm your account. Please enter the given pin to Wheelancer!</p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td bgcolor="#ffffff" align="left">
                                                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                    <tr>
                                                        <td bgcolor="#ffffff" align="center" style="padding: 20px 30px 60px 30px;">
                                                            <table border="0" cellspacing="0" cellpadding="0">
                                                                <tr>
                                                                    <td align="center" style="border-radius: 3px;" bgcolor="#FFA73B"><h1 style="font-size: 50px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 2px; border: 1px solid #FFA73B; display: inline-block;">${code[0]} ${code[1]} ${code[2]} ${code[3]}</a></td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr> <!-- COPY -->
                                        <tr>
                                            <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 40px 30px; color: #000000; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                                <p style="margin: 0;">Please enter this code as soon as possible.</p>
                                            </td>
                                        </tr> <!-- COPY -->
                    
                                    </table>
                                </td>
                            </tr>
                    
                        </table>
                    </body>
                    
                    </html>`, // html body
            });


            await sql.setTryTimer(user_id, 'RESET');


        } catch (error) {

            console.log(error);
            res.status(500).json({
                error: 'Could not send verification code.'
            })
            return;

        }
        res.status(200).json({
            result: 'Mail sent please check your mailbox.'
        });


    } catch (error) {
        res.sendStatus(500);
        console.log(error)
    }

})

// Checks requested verification code to verify user.
router.post("/checkverification", decodeAWT, async(req, res) => {

    try {
        res.type('json')

        let code = req.body.code;

        let user_id = req.decoded.user_id

        let resultUser = (await sql.getUser(user_id))[0];


        if (resultUser.email_verified) {

            return res.status(409).json({
                error: 'User is already verified.'
            })
        }

        if (resultUser.verify_try < 5) {
            await sql.setTryTimer(user_id, 'INCR');
        } else {
            return res.status(429).json({
                error: 'Has made too many wrong entry please request a new code.'
            })
        }

        let resultListVerCodes = await sql.listVerificationCodes(user_id);

        if (resultListVerCodes && !resultListVerCodes.length) {
            res.status(401).json({
                error: 'Please send a verification code.'
            })
            return;
        }

        let verificationCode = resultListVerCodes[0]
        let expireDate = new Date(verificationCode.expire_date)
        if (expireDate - new Date() > 0 && verificationCode.code == code) {


            await sql.verifyEmail(user_id);

            await sql.setTryTimer(user_id, 'RESET');

            res.status(200).json({
                result: 'Successfully verified.'
            })

        } else if (expireDate - new Date() < 0) {
            res.status(408).json({
                error: 'Verification code expired.'
            })
        } else {
            res.status(403).json({
                error: 'Wrong verification code.'
            })

        }


    } catch (error) {
        res.sendStatus(500);
        console.log(error)
    }

})


// Performs login operation and give user JWT token
router.post("/login", async(req, res) => {

    try {

        // res.type('json')
        // console.log(req.params);
        let email = req.body.email
        let password = req.body.password
            // var date = new Date()
            // date.setHours(date.getHours() + 1);

        let resultCheckUser = await sql.loginUser(email, password)
            //If user exists
        if (resultCheckUser.length) {
            let user_id = resultCheckUser[0].user_id

            // await sql.addAuth(token = tokgen.generate(), user_id)
            let resultCheckUserType = await sql.checkUserType(user_id)

            let type = resultCheckUserType[0].type

            let token = jwt.sign({
                user_id: user_id,
                type: type
            }, PRIVATE_KEY, {
                expiresIn: process.env.AUTH_EXP_TIME
            })

            res.status(200).json({
                result: {
                    user: resultCheckUser[0],
                    token: token,
                    type: type
                }
            });

        } else {
            res.status(401).json({
                error: 'Wrong credentials.'
            });
        }

    } catch (error) {
        res.sendStatus(500);
        console.log(error)
    }

})


//Disabled
router.put("/setbio", async(req, res) => {

    try {
        res.type('json')
        let user_id = req.body.uid
        let biography = req.body.bio

        let auth = req.headers.authorization

        let resultCheckAuth = await sql.checkAuthType(auth, user_id)

        if (resultCheckAuth.length) {
            let resultSetBiography = await sql.setBiography(user_id, biography);
            if (resultSetBiography && resultSetBiography.affectedRows) {
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

//Disabled
router.put("/setemail", async(req, res) => {

    try {
        res.type('json')
        let user_id = req.body.uid
        let email = req.body.email

        let auth = req.headers.authorization

        let resultCheckAuth = await sql.checkAuthType(auth, user_id)

        if (resultCheckAuth.length) {
            let resultSetEmail = await sql.setEmail(user_id, email);
            if (resultSetEmail && resultSetEmail.affectedRows) {
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

//Disabled
router.put("/setname", async(req, res) => {

    try {
        res.type('json')
        let user_id = req.body.uid
        let name = req.body.name

        let auth = req.headers.authorization

        let resultCheckAuth = await sql.checkAuthType(auth, user_id)

        if (resultCheckAuth.length) {
            let resultSetName = await sql.setName(user_id, name);
            if (resultSetName && resultSetName.affectedRows) {
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


//Adds balance to the user.
router.put("/addbalance", decodeAWT, async(req, res) => {

    try {
        res.type('json')
        let user_id = req.decoded.user_id
        let amount = req.body.amount

        await sql.updateBalance(user_id, amount);
        res.status(200).json({
            result: 'Balance added to your account.'
        })


    } catch (error) {
        res.sendStatus(500);
        console.log(error)
    }
})

//Disabled
router.put("/setpassword", async(req, res) => {

        try {
            res.type('json')
            let user_id = req.body.uid
            let password = req.body.password

            let auth = req.headers.authorization

            let resultCheckAuth = await sql.checkAuthType(auth, user_id)

            if (resultCheckAuth.length) {
                let resultSetPassword = await sql.setPassword(user_id, password);
                if (resultSetPassword && resultSetPassword.affectedRows) {
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
    //Disabled
router.put("/setusername", async(req, res) => {

    try {
        res.type('json')
        let user_id = req.body.uid
        let username = req.body.username

        let auth = req.headers.authorization

        let resultCheckAuth = await sql.checkAuthType(auth, user_id)

        if (resultCheckAuth.length) {
            let resultSetUsername = await sql.setUsername(user_id, username);
            if (resultSetUsername && resultSetUsername.affectedRows) {
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


//Gets user info from token.
router.get("/getmyuser", decodeAWT, async(req, res) => {

    try {
        res.type('json')
        let user_id = req.decoded.user_id
        let resultGetUserInfo = await sql.getUserInfo(user_id);
        res.status(200).json({

            result: resultGetUserInfo[0]
        });

    } catch (error) {
        res.sendStatus(500);
        console.log(error)
    }

})



module.exports = router;