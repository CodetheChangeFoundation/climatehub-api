// Get all Groups that take on specified Project
// Endpoint: /projects/{pid}/groups

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
    let sqlquery = 'SELECT * FROM `Group` g, Project p, TakesOn t WHERE g.GID=t.GID and p.PID=t.PID and p.PID="' + event['pathParameters']['pid'] + '";';
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

