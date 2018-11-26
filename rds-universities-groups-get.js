// Get all Groups that belong to specified University
// Endpoint: /university/{ucode}/groups

let mysql = require('mysql');
let config = require('./config.json');

let pool = mysql.createPool({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database
});

exports.handler = (event, context, callback) => {
  console.log(event);
  context.callbackWaitsForEmptyEventLoop = false;
  pool.getConnection(function (err, connection) {
    let sqlquery = 'SELECT * FROM `Group` WHERE UCode="' + event['pathParameters']['ucode'] + '";';
    connection.query(sqlquery, function (error, results, fields) {
      connection.release();
      let response = {
        "isBase64Encoded": false,
        "statusCode": 200,
        "headers": {},
        "body": JSON.stringify(results)
      }
      if (error) {
        response.statusCode = 400;
        callback(error, response);
      } else {
        callback(null, response);
      }
    });
  });
};
