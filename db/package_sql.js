const pool = require("../db_config");

let package = {};



package.checkPackageProofUUID = (UUID) => {

    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM Package_Proofs WHERE image = ?", [UUID], (err, results) => {
            if (err && err.code != "ER_DUP_ENTRY") {
                return reject(err);
            }
            return resolve(results);
        })
    })
}


package.listPackageProofs = (type, user_id, package_id) => {

    return new Promise((resolve, reject) => {
        if (type == 0) {

            pool.query("SELECT pp.proof_id, pp.type, pp.image, pp.date FROM Package_Proofs pp  JOIN Package p ON (p.pid = pp.pid)  WHERE p.cid = ? AND pp.pid = ?", [user_id, package_id], (err, results) => {
                if (err && err.code != "ER_DUP_ENTRY") {
                    return reject(err);
                }
                return resolve(results);
            })
        } else {

            pool.query("SELECT pp.proof_id, pp.type, pp.image, pp.date FROM Package_Proofs pp  JOIN Package p ON (p.pid = pp.pid) JOIN Transportation t ON (p.transport_id = t.transport_id) WHERE  t.courier_id = ? AND pp.pid = ?", [user_id, package_id], (err, results) => {
                if (err && err.code != "ER_DUP_ENTRY") {
                    return reject(err);
                }
                return resolve(results);
            })

        }

    })
}

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



package.checkCourierPackage = (courier_id, pid) => {

    return new Promise((resolve, reject) => {
        pool.query("SELECT p.* FROM Courier c JOIN Transportation t ON (c.user_id = t.courier_id) JOIN Package p ON (p.transport_id = t.transport_id) WHERE c.user_id = ? AND p.pid = ?", [courier_id, pid], (err, results) => {
            if (err && err.code != "ER_DUP_ENTRY") {
                return reject(err);
            }
            return resolve(results);
        })
    })
}


package.addPackageProof = (pid, type, image) => {

    return new Promise((resolve, reject) => {
        pool.query("INSERT INTO Package_Proofs(pid,type,image) VALUES(?,?,?)", [pid, type, image], (err, results) => {
            if (err && err.code != "ER_DUP_ENTRY") {
                return reject(err);
            }
            return resolve(results);
        })
    })
}

package.addPackageToCustomer = (cid, length, width, height, weight, type, s_long, s_lat, d_long, d_lat, receiverEmail, s_city, d_city) => {

    return new Promise((resolve, reject) => {
        pool.query("INSERT INTO Package(cid,transport_id,length,width,height,weight,type,s_long,s_lat,d_long,d_lat,receiver_email,estimated_delivery_date,chat_channel_id,s_city, d_city) VALUES(?,NULL,?,?,?,?,?,?,?,?,?,?,NULL,NULL,?, ?)", [cid, length, width, height, weight, type, s_long, s_lat, d_long, d_lat, receiverEmail, s_city, d_city], (err, results) => {
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