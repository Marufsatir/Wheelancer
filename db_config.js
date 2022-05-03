const mysql = require("mysql");
require('dotenv').config()

var poolLocal = mysql.createPool({
    connectionLimit: 10,
    password: process.env.SQL_PASS,
    user: process.env.SQL_USER,
    database: process.env.SQL_DB,
    host: process.env.SQL_HOST,
    port: process.env.SQL_PORT,
    charset: 'utf8mb4'
});

/*Use one of them to switch. 
poolStar => Berk's Server
poolRemote => Remote Server
*/

module.exports = poolLocal
    // module.exports = poolRemote ;