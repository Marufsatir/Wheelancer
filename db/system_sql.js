const pool = require("../db_config");
var fs = require('fs');
var readline = require('readline');

let system = {};


//Listing all threads.

system.insertTuples = () => {


  return new Promise((resolve, reject) => {

    var read = readline.createInterface({
      input: fs.createReadStream('./db/sql/data.sql'),
      terminal: false
    });


    read.on('line', function (chunk) {
      pool.query(chunk.toString('ascii'), function (err, results) {
        if (err) reject(err);
        return resolve(results);
      });
    });
    read.on('close', function () {
      console.log("Tuples have been updated.");
    });


    //SELF NOTE => YOU CAN USE IT MANY TIME
    //   read = readline.createInterface({
    //     input: fs.createReadStream('./db/sql/test.sql'),
    //     terminal: false
    //   });


    //   read.on('line', function (chunk) {
    //     pool.query(chunk.toString('ascii'), function (err, results) {
    //       if (err) reject(err);
    //       return resolve(results);
    //     });
    //   });
    //   read.on('close', function () {
    //     console.log("Tuples have been deleted.");
    //   });

  })
}


system.truncatetables = () => {

  return new Promise((resolve, reject) => {

    var read = readline.createInterface({
      input: fs.createReadStream('./db/sql/reset.sql'),
      terminal: false
    });


    read.on('line', function (chunk) {
      pool.query(chunk.toString('ascii'), function (err, results) {
        if (err) reject(err);
        return resolve(results);
      });
    });
    read.on('close', function () {
      console.log("Tables have been TRUNCATED .");
    });
  })

}

system.insertTables = () => {

  return new Promise((resolve, reject) => {

    var read = readline.createInterface({
      input: fs.createReadStream('./db/sql/schema.sql'),
      terminal: false
    });


    read.on('line', function (chunk) {
      pool.query(chunk.toString('ascii'), function (err, results) {
        if (err) reject(err);
        return resolve(results);
      });
    });
    read.on('close', function () {
      console.log("Tables have been inserted.");
    });
  })

}



module.exports = system;



