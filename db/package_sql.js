const pool = require("../db_config");

let package = {};



package.getPackage = (user_id, package_id) => {

    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM Package WHERE cid = ? AND pid = ?", [user_id, package_id], (err, results) => {
            if (err && err.code != "ER_DUP_ENTRY") {
                return reject(err);
            }
            return resolve(results);
        })
    })
}

package.listMyPackages = (user_id) => {

    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM Package WHERE cid = ?", [user_id], (err, results) => {
            if (err && err.code != "ER_DUP_ENTRY") {
                return reject(err);
            }
            return resolve(results);
        })
    })
}



package.addPackageToCustomer = (cid, length, width, height, weight, type, s_long, s_lat, d_long, d_lat, receiverEmail, city) => {

    return new Promise((resolve, reject) => {
        pool.query("INSERT INTO Package(cid,transport_id,length,width,height,weight,type,s_long,s_lat,d_long,d_lat,receiver_email,estimated_delivery_date,chat_channel_id,city) VALUES(?,NULL,?,?,?,?,?,?,?,?,?,?,NULL,NULL,?)", [cid, length, width, height, weight, type, s_long, s_lat, d_long, d_lat, receiverEmail, city], (err, results) => {
            if (err && err.code != "ER_DUP_ENTRY") {
                return reject(err);
            }
            return resolve(results);
        })
    })
}


package.removePackageFromCustomer = (user_id, package_id) => {

    return new Promise((resolve, reject) => {
        pool.query("DELETE FROM Package WHERE cid = ? AND pid = ?", [user_id, package_id], (err, results) => {
            if (err && err.code != "ER_DUP_ENTRY") {
                return reject(err);
            }
            return resolve(results);
        })
    })
}

module.exports = package;