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


package.getPackagesFromUserTransport = (transport_id, user_id) => {

    return new Promise((resolve, reject) => {
        pool.query("SELECT p.* FROM Transportation t JOIN Package p  ON (t.transport_id = p.transport_id) JOIN Vehicle v ON (t.vehicle_id = v.vehicle_id) WHERE t.transport_id = ? AND courier_id = ?", [transport_id, user_id], (err, results) => {
            if (err && err.code != "ER_DUP_ENTRY") {
                return reject(err);
            }
            return resolve(results);
        })
    })
}

package.getPackagesFromCourierTransport = (transport_id, courier_id) => {

    return new Promise((resolve, reject) => {
        pool.query("SELECT p.*, t.remaining_weight , t.remaining_volume, t.status as trasportation_status FROM Package p JOIN Transportation t ON (p.transport_id = t.transport_id) WHERE t.transport_id = ? AND t.courier_id = ?", [transport_id, courier_id], (err, results) => {
            if (err && err.code != "ER_DUP_ENTRY") {
                return reject(err);
            }
            return resolve(results);
        })
    })
}

package.getPackage = (package_id) => {

    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM Package WHERE pid = ?", [package_id], (err, results) => {
            if (err && err.code != "ER_DUP_ENTRY") {
                return reject(err);
            }
            return resolve(results);
        })
    })
}



package.updatePackageTransportation = (pid, transport_id) => {

    return new Promise((resolve, reject) => {
        pool.query("UPDATE Package set transport_id = ? WHERE pid = ?;", [transport_id, pid], (err, results) => {
            if (err && err.code != "ER_DUP_ENTRY") {
                return reject(err);
            }
            return resolve(results);
        })
    })

}

package.updatePackageStatus = (pid, status) => {

    return new Promise((resolve, reject) => {
        pool.query("UPDATE Package set status = ? WHERE pid = ?;", [status, pid], (err, results) => {
            if (err && err.code != "ER_DUP_ENTRY") {
                return reject(err);
            }
            return resolve(results);
        })
    })

}

package.getPackageFromUser = (user_id, package_id) => {

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

package.addPackageToCustomer = (cid, length, width, height, weight, type, s_long, s_lat, d_long, d_lat, receiverEmail, s_city, d_city, receiver_fullname) => {

    return new Promise((resolve, reject) => {
        pool.query("INSERT INTO Package(cid,transport_id,length,width,height,weight,type,s_long,s_lat,d_long,d_lat,receiver_email,estimated_delivery_date,chat_channel_id,s_city, d_city, receiver_fullname) VALUES(?,NULL,?,?,?,?,?,?,?,?,?,?,NULL,NULL,?, ?, ?)", [cid, length, width, height, weight, type, s_long, s_lat, d_long, d_lat, receiverEmail, s_city, d_city, receiver_fullname], (err, results) => {
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