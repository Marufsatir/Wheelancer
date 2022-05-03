const pool = require("../db_config");


let user = {};




user.addUser = (name, surname, birthday, idNum, email, password) => {
    return new Promise((resolve, reject) => {

        pool.query("INSERT INTO User (name,surname,birthday,id_num,email,password) VALUES (?,?,?,?,?,?)", [name, surname, birthday, idNum, email, password], (err, results) => {

            if (err && err.code != "ER_DUP_ENTRY") {

                return reject(err);
            }
            return resolve(results);
        })
    })
}

user.addAdmin = (user_id) => {
    return new Promise((resolve, reject) => {

        pool.query("INSERT INTO Admin (user_id) VALUES (?)", [user_id], (err, results) => {
            if (err && err.code != "ER_DUP_ENTRY") {
                return reject(err);
            }
            return resolve(results);
        })
    })
}

user.addCourier = (user_id) => {
    return new Promise((resolve, reject) => {

        pool.query("INSERT INTO Courier (user_id) VALUES (?)", [user_id], (err, results) => {
            if (err && err.code != "ER_DUP_ENTRY") {
                return reject(err);
            }
            return resolve(results);
        })
    })
}

user.addCustomer = (user_id) => {
    return new Promise((resolve, reject) => {

        pool.query("INSERT INTO Customer (user_id) VALUES (?)", [user_id], (err, results) => {
            if (err && err.code != "ER_DUP_ENTRY") {
                return reject(err);
            }
            return resolve(results);
        })
    })
}


user.addVehicle = (userID, model, brand, max_length, max_width, max_height, max_weight, horsepower, registration_plate) => {
    return new Promise((resolve, reject) => {

        pool.query("INSERT INTO Vehicle(user_id,model,brand,max_length,max_width,max_height,max_weight,horsepower,registration_plate) VALUES(?,?,?,?,?,?,?,?,?)", [userID, model, brand, max_length, max_width, max_height, max_weight, horsepower, registration_plate], (err, results) => {

            if (err && err.code != "ER_DUP_ENTRY") {

                return reject(err);
            }
            return resolve(results);
        })
    })
}

user.setTryTimer = (user_id, mode) => {

    let query;


    if (mode == 'INCR') {
        query = "UPDATE User SET verify_try = verify_try + 1 WHERE user_id = ?"
    } else {
        query = "UPDATE User SET verify_try = 0 WHERE user_id = ?"
    }

    return new Promise((resolve, reject) => {

        pool.query(query, [user_id], (err, results) => {
            if (err && err.code != "ER_DUP_ENTRY") {
                return reject(err);
            }
            return resolve(results);
        })
    })
}

user.verifyCourier = (user_id, courier_id) => {
    return new Promise((resolve, reject) => {

        pool.query("UPDATE Courier SET is_verified = 1, verifier_id = ? WHERE user_id = ?", [user_id, courier_id], (err, results) => {
            if (err && err.code != "ER_DUP_ENTRY") {
                return reject(err);
            }
            return resolve(results);
        })
    })
}

user.getUnverifiedCouriers = () => {
    return new Promise((resolve, reject) => {

        pool.query("SELECT user_id, user_name, name, email, biography FROM Courier a JOIN User u USING(user_id) WHERE is_verified = 0", (err, results) => {
            if (err) {

                return reject(err);
            }
            return resolve(results);
        })
    })
}

user.getVerifiedCouriers = () => {
    return new Promise((resolve, reject) => {

        pool.query("SELECT user_id, user_name, name, email, biography FROM Courier a JOIN User u USING(user_id) WHERE is_verified = 1", (err, results) => {
            if (err) {

                return reject(err);
            }
            return resolve(results);
        })
    })
}

user.setBiography = (user_id, biography) => {
    return new Promise((resolve, reject) => {

        pool.query("UPDATE User SET biography = ? WHERE user_id = ?", [biography, user_id], (err, results) => {
            if (err && err.code != "ER_DUP_ENTRY") {
                return reject(err);
            }
            return resolve(results);
        })
    })
}

user.setEmail = (user_id, email) => {
    return new Promise((resolve, reject) => {

        pool.query("UPDATE User SET email = ? WHERE user_id = ?", [email, user_id], (err, results) => {
            if (err && err.code != "ER_DUP_ENTRY") {
                return reject(err);
            }
            return resolve(results);
        })
    })
}

user.setName = (user_id, name) => {
    return new Promise((resolve, reject) => {

        pool.query("UPDATE User SET name = ? WHERE user_id = ?", [name, user_id], (err, results) => {
            if (err && err.code != "ER_DUP_ENTRY") {
                return reject(err);
            }
            return resolve(results);
        })
    })
}

user.setPassword = (user_id, password) => {
    return new Promise((resolve, reject) => {

        pool.query("UPDATE User SET password = ? WHERE user_id = ?", [password, user_id], (err, results) => {
            if (err && err.code != "ER_DUP_ENTRY") {
                return reject(err);
            }
            return resolve(results);
        })
    })
}

user.deposit = (user_id, amount) => {
    return new Promise((resolve, reject) => {

        pool.query("UPDATE User SET balance = ? WHERE user_id = ?", [amount, user_id], (err, results) => {
            if (err && err.code != "ER_DUP_ENTRY") {
                return reject(err);
            }
            return resolve(results);
        })
    })
}

user.setUsername = (user_id, username) => {
    return new Promise((resolve, reject) => {

        pool.query("UPDATE User SET user_name = ? WHERE user_id = ?", [username, user_id], (err, results) => {
            if (err && err.code != "ER_DUP_ENTRY") {
                return reject(err);
            }
            return resolve(results);
        })
    })
}

// //For listing all users that are non-friend expect itself
// user.getNonFriends = (user_id) => {
//     return new Promise((resolve, reject) => {

//         pool.query("SELECT user_id, user_name, name, email, biography FROM nonFriend_view WHERE check_user = ?;",[user_id], (err, results) => {
//             if (err) {

//                 return reject(err);
//             }
//             return resolve(results);
//         })
//     })
// }

//For Creating Verification Code
user.createVerificationCode = (userId, expireDate, code) => {
    return new Promise((resolve, reject) => {
        pool.query("INSERT INTO Verification (user_id, expire_date, code) VALUES(?,?,?)", [userId, expireDate, code], (err, results) => {
            if (err) {

                return reject(err);
            }
            return resolve(results);
        })
    })
}

//For Listing Verification Code for given user.
user.listVerificationCodes = (userId) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM Verification WHERE user_id = ? ORDER BY expire_date DESC", [userId], (err, results) => {
            if (err) {

                return reject(err);
            }
            return resolve(results);
        })
    })
}

//Verifies email verification status for the user.
user.verifyEmail = (userId) => {
    return new Promise((resolve, reject) => {
        pool.query("UPDATE `User` SET email_verified = 1 WHERE user_id = ?", [userId], (err, results) => {
            if (err) {

                return reject(err);
            }
            return resolve(results);
        })
    })
}


//For Login
user.loginUser = (email, password) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM `User` WHERE email = ? and password = ?", [email, password], (err, results) => {
            if (err) {

                return reject(err);
            }
            return resolve(results);
        })
    })
}

//For Login
user.getUser = (user_id) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM `User` WHERE user_id = ?", [user_id], (err, results) => {
            if (err) {

                return reject(err);
            }
            return resolve(results);
        })
    })
}

user.checkUserType = (user_id) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM UserType_View WHERE user_id = ?;", [user_id], (err, results) => {
            if (err) {

                return reject(err);
            }
            return resolve(results);
        })
    })
}


// Task is used instead of this.
// //Deletes old auth tokens.
// user.deleteOldAuth = () => {
//     return new Promise((resolve, reject) => {

//         let date = new Date();

//         pool.query("DELETE FROM auth WHERE date < ?",[date], (err, results) => {
//             if (err) {

//                 return reject(err);
//             }
//             console.log("Old Auth Deleted=>" + results.affectedRows);
//             return resolve(results);
//         })
//     })
// }


//For Checking Auth token validity.
user.checkAuth = (authCode) => {
    return new Promise((resolve, reject) => {

        // user.deleteOldAuth() // Calls delete Auth Function for old auths.

        pool.query("SELECT * FROM auth WHERE token = ?", [authCode], (err, results) => {
            if (err) {

                return reject(err);
            }
            console.log("Auth Found=>" + results.length);
            return resolve(results);

        })
    })
}


user.getUserInfo = (user_id) => {
    return new Promise((resolve, reject) => {

        pool.query("SELECT * FROM User u JOIN UserType_View ut USING (user_id) WHERE user_id = ?", [user_id], (err, results) => {
            if (err) {

                return reject(err);
            }
            return resolve(results);
        })
    })
}


user.checkAuthAdmin = (authCode, user_id) => {
    return new Promise((resolve, reject) => {


        pool.query("SELECT * FROM auth a JOIN Admin l USING(user_id) WHERE token = ? and user_id = ?", [authCode, user_id], (err, results) => {
            if (err) {

                return reject(err);
            }
            console.log("Auth Admin with uid Found=>" + results.length);
            return resolve(results);

        })
    })
}

user.checkAuthCourier = (authCode, user_id) => {
    return new Promise((resolve, reject) => {


        pool.query("SELECT * FROM auth a JOIN Courier l USING(user_id) WHERE token = ? and user_id = ? and is_verified = 1", [authCode, user_id], (err, results) => {
            if (err) {

                return reject(err);
            }
            console.log("Auth Courier with uid Found=>" + results.length);
            return resolve(results);

        })
    })
}

//Adds new Auth Token.
user.addAuth = (authCode, user_id) => {
    return new Promise((resolve, reject) => {


        pool.query("INSERT INTO auth VALUES (ADDDATE(CURRENT_TIMESTAMP(), INTERVAL 1 HOUR),?,?)", [authCode, user_id], (err, results) => {
            if (err) {

                return reject(err);
            }
            return resolve(results);
        })
    })
}





module.exports = user;