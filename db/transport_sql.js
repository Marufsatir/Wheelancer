const pool = require("../db_config");


let transport = {};



transport.getAllPackagesInCity = (s_city) => {

    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM Package p WHERE p.status = 'CREATED' AND p.s_city = ?", [s_city], (err, results) => {
            if (err && err.code != "ER_DUP_ENTRY") {
                return reject(err);
            }
            return resolve(results);
        })
    })

}


transport.getCustomerOffers = (customer_id) => {

    return new Promise((resolve, reject) => {
        pool.query("SELECT o.*, c.avg_rating,u.registration_date , v.*, CONCAT(u.name, ' ', u.surname) as courier_full_name FROM Offer o  JOIN Package p ON (o.pid = p.pid) JOIN Transportation t ON (p.transport_id= t.transport_id) JOIN Courier c ON (t.courier_id = c.user_id) JOIN `User` u ON ( c.user_id = u.user_id) JOIN Vehicle v ON (t.vehicle_id = v.vehicle_id) WHERE p.cid = ?", [customer_id], (err, results) => {
            if (err && err.code != "ER_DUP_ENTRY") {
                return reject(err);
            }
            return resolve(results);
        })
    })

}

transport.getCourierOffers = (courier_id) => {

    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM Offer o  JOIN Package p ON (o.pid = p.pid) WHERE o.courier_id  = ?", [courier_id], (err, results) => {
            if (err && err.code != "ER_DUP_ENTRY") {
                return reject(err);
            }
            return resolve(results);
        })
    })

}


transport.cancelOffer = (pid, courier_id) => {

    return new Promise((resolve, reject) => {
        pool.query("DELETE FROM Offer WHERE pid = ? AND courier_id = ?", [pid, courier_id], (err, results) => {
            if (err && err.code != "ER_DUP_ENTRY") {
                return reject(err);
            }
            return resolve(results);
        })
    })

}

transport.getOfferDetails = (pid, courier_id) => {

    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM Offer o JOIN Package p ON (o.pid = p.pid)WHERE p.pid = ? AND courier_id = ?", [pid, courier_id], (err, results) => {
            if (err && err.code != "ER_DUP_ENTRY") {
                return reject(err);
            }
            return resolve(results);
        })
    })

}

transport.addOffer = (pid, courier_id, price) => {

    return new Promise((resolve, reject) => {
        pool.query("INSERT INTO Offer VALUES(?,?,?)", [pid, courier_id, price], (err, results) => {
            if (err && err.code != "ER_DUP_ENTRY") {
                return reject(err);
            }
            return resolve(results);
        })
    })

}


transport.addTransport = (courier_id, vehicle_id, courier_pos_long, courier_pos_lat, last_update_date, remaining_volume, remaining_weight, departure_date, arrival_date, status) => {

    return new Promise((resolve, reject) => {
        pool.query("INSERT INTO Transportation(courier_id,vehicle_id,courier_pos_long,courier_pos_lat,last_update_date,remaining_volume,remaining_weight,departure_date,arrival_date,status) VALUES(?,?,?,?,?,?,?,?,?,?)", [courier_id, vehicle_id, courier_pos_long, courier_pos_lat, last_update_date, remaining_volume, remaining_weight, departure_date, arrival_date, status], (err, results) => {
            if (err && err.code != "ER_DUP_ENTRY") {
                return reject(err);
            }
            return resolve(results);
        })
    })

}

transport.getCourierTransports = (courier_id) => {

    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM Transportation t JOIN Vehicle v ON (t.vehicle_id = v.vehicle_id) WHERE courier_id = ?", [courier_id], (err, results) => {
            if (err && err.code != "ER_DUP_ENTRY") {
                return reject(err);
            }
            return resolve(results);
        })
    })
}




module.exports = transport;