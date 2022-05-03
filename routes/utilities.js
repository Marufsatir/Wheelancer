var jwt = require('jsonwebtoken');
require('dotenv').config()
const sql = require("../db/user_sql");

const PRIVATE_KEY = process.env.PRIVATE_KEY

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


module.exports = { decodeAWT };