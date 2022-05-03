var jwt = require('jsonwebtoken');
require('dotenv').config()


const PRIVATE_KEY = process.env.PRIVATE_KEY

const decodeAWT = async(req, res, next) => {

    if (!req.headers.authorization) {
        return res.sendStatus(410);
    }
    let token = req.headers.authorization.split(' ')[1];

    jwt.verify(token, PRIVATE_KEY, (err, decoded) => {

        if (err) {
            res.sendStatus(410);
        } else {
            req.decoded = decoded
            next();
        }
    })
}


module.exports = { decodeAWT };