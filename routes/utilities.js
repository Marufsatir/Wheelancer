var jwt = require('jsonwebtoken');
require('dotenv').config()
const sql = require("../db/user_sql");

const PRIVATE_KEY = process.env.PRIVATE_KEY

// Decoding AWT (Used as middleware)
const decodeAWT = async(req, res, next) => {

    if (!req.headers.authorization) {
        return res.sendStatus(410);
    }
    let token = req.headers.authorization.split(' ')[1];

    jwt.verify(token, PRIVATE_KEY, async(err, decoded) => {

        if (err) {
            res.sendStatus(410);
        } else {

            let userTypeCheckResult = await sql.checkUserType(decoded.user_id);

            if (userTypeCheckResult && userTypeCheckResult.length) {
                let type = userTypeCheckResult[0].type
                if (type != decoded.type) {
                    res.status(401).json({
                        error: 'You do have permission to perform this action.'
                    })
                    return;
                }
            } else {

                res.status(404).json({
                    error: 'User could not found.'
                })
            }

            req.decoded = decoded
            next();
        }
    })
}

const generateDeliveryConfirmMessage = (receiver_fullname, type, error_message) => {

    return `<!DOCTYPE html>
    <html>
    
    <body style="background-color: #f4f4f4; margin: 0 !important; padding: 0 !important;">
        <!-- HIDDEN PREHEADER TEXT -->
        <div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: 'Lato', Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;"> We're thrilled to have you here! Get ready to dive into your new account. </div>
        <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <!-- LOGO -->
            <tr>
                <td bgcolor="${type == 'SUCCESS'? '#49c53b': '#cf4727'}" align="center">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                        <tr>
                            <td align="center" valign="top" style="padding: 40px 10px 40px 10px;"> </td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td bgcolor="${type == 'SUCCESS'? '#49c53b': '#cf4727'}" align="center" style="padding: 0px 10px 0px 10px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                        <tr>
                            <td bgcolor="#ffffff" align="center" valign="top" style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;">
                                <h1 style="font-size: 30px; font-weight: 400; margin: 2;">Wheelancer Delivery Confirmation!</h1> <img src="${type == 'SUCCESS'?'https://i.imgur.com/W3YmYXD.png' : 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Cross_red_circle.svg/512px-Cross_red_circle.svg.png'}" width="125" height="120" style="display: block; border: 0px;" />
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
                                <p style="margin: 0;">${type == 'SUCCESS'? 'Dear ' + receiver_fullname+ ',' : ''}</p>
                            </td>
                        </tr>
                        <tr>
                            <td bgcolor="#ffffff" align="center" style="padding: 20px 30px 40px 30px; color: #111111; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 24px; font-weight: 400; line-height: 25px;">
                                <p style="margin: 0;">${type == 'SUCCESS'? 'Thank you for using our service.' : error_message}</p>
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


}


module.exports = { decodeAWT, generateDeliveryConfirmMessage };