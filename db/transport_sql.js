const pool = require("../db_config");


let transport = {};

transport.listAllTransports = () =>{

    return new Promise((resolve, reject) => {
        pool.query("SELECT tid, customer_id, cargo_size, cargo_weight, creation_date, departure_node_id, arrival_node_id, status, CONCAT(n1.lat,', ',n1.lng) as departure_cords, CONCAT(n2.lat,', ',n2.lng) as arrival_cords , CONCAT(n3.lat,', ',n3.lng) as current_position_cords FROM transport LEFT JOIN node n1 ON (transport.departure_node_id = n1.nid) LEFT JOIN node n2 ON (transport.arrival_node_id = n2.nid) LEFT JOIN node n3 ON (transport.current_position_node_id = n3.nid) ORDER BY creation_date",(err, results) => {
             if (err &&err.code != "ER_DUP_ENTRY") {
                 return reject(err);
            }
            return resolve(results);
        })
    })
}

transport.listMyTransports = (user_id) =>{

    return new Promise((resolve, reject) => {
        pool.query("SELECT tid, customer_id, cargo_size, cargo_weight, creation_date, departure_node_id, arrival_node_id, status, CONCAT(n1.lat,', ',n1.lng) as departure_cords, CONCAT(n2.lat,', ',n2.lng) as arrival_cords , CONCAT(n3.lat,', ',n3.lng) as current_position_cords FROM transport LEFT JOIN node n1 ON (transport.departure_node_id = n1.nid) LEFT JOIN node n2 ON (transport.arrival_node_id = n2.nid) LEFT JOIN node n3 ON (transport.current_position_node_id = n3.nid) WHERE customer_id = ? ORDER BY creation_date",[user_id], (err, results) => {
             if (err &&err.code != "ER_DUP_ENTRY") {
                 return reject(err);
            }
            return resolve(results);
        })
    })
}


module.exports = transport;