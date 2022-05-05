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
        pool.query("SELECT  IF( ISNULL(p.transport_id), 'WAITING', 'ACCEPTED') as accept_status, o.*, c.avg_rating,u.registration_date , v.*, CONCAT(u.name, ' ', u.surname) as courier_full_name FROM Offer o  JOIN Package p ON (o.pid = p.pid) JOIN Transportation t ON (p.transport_id= t.transport_id) JOIN Courier c ON (t.courier_id = c.user_id) JOIN `User` u ON ( c.user_id = u.user_id) JOIN Vehicle v ON (t.vehicle_id = v.vehicle_id) WHERE p.cid = ?", [customer_id], (err, results) => {
            if (err && err.code != "ER_DUP_ENTRY") {
                return reject(err);
            }
            return resolve(results);
        })
    })

}

transport.getCourierOffers = (courier_id) => {

    return new Promise((resolve, reject) => {
        pool.query("SELECT IF( ISNULL(p.transport_id), 'WAITING', 'ACCEPTED') as accept_status, o.* , p.pid , p.cid , p.`length` , p.width , p.width , p.height , p.weight , p.`type` , p.s_long , p.s_lat , p.d_long , p.d_lat , p.status , p.receiver_fullname , p.receiver_email , p.estimated_delivery_date , p.chat_channel_id , p.s_city , p.d_city  FROM Offer o  JOIN Package p ON (o.pid = p.pid) WHERE o.courier_id  = ?", [courier_id], (err, results) => {
            if (err && err.code != "ER_DUP_ENTRY") {
                return reject(err);
            }
            return resolve(results);
        })
    })

}

transport.removeUnwantedOffersExceptGiven = (pid, courier_id, transport_id) => {

    return new Promise((resolve, reject) => {
        pool.query("DELETE FROM Offer WHERE pid = ? AND courier_id <> ? AND transport_id <> ?", [pid, courier_id, transport_id], (err, results) => {
            if (err && err.code != "ER_DUP_ENTRY") {
                return reject(err);
            }
            return resolve(results);
        })
    })

}

transport.decreaseRemainingValue = (transport_id, volume, weight) => {

    return new Promise((resolve, reject) => {
        pool.query("UPDATE Transportation SET remaining_volume = remaining_volume - ?, remaining_weight = remaining_weight - ? WHERE transport_id = ?;", [volume, weight, transport_id], (err, results) => {
            if (err && err.code != "ER_DUP_ENTRY") {
                return reject(err);
            }
            return resolve(results);
        })
    })

}


transport.cancelOffer = (pid, courier_id, transport_id) => {

    return new Promise((resolve, reject) => {
        pool.query("DELETE FROM Offer WHERE pid = ? AND courier_id = ? AND transport_id = ?", [pid, courier_id, transport_id], (err, results) => {
            if (err && err.code != "ER_DUP_ENTRY") {
                return reject(err);
            }
            return resolve(results);
        })
    })

}

transport.getOfferDetails = (pid, courier_id, transport_id) => {

    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM Offer o JOIN Package p ON (o.pid = p.pid)WHERE p.pid = ? AND courier_id = ? AND o.transport_id = ?", [pid, courier_id, transport_id], (err, results) => {
            if (err && err.code != "ER_DUP_ENTRY") {
                return reject(err);
            }
            return resolve(results);
        })
    })

}

transport.addOffer = (pid, courier_id, transport_id, price) => {

    return new Promise((resolve, reject) => {
        pool.query("INSERT INTO Offer (pid, courier_id, transport_id, price) VALUES(?,?,?,?)", [pid, courier_id, transport_id, price], (err, results) => {
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