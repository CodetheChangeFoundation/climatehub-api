// Get all Projects or specified Project
// Endpoint: projects/{pid}

var mysql = require('mysql');
var config = require('./config.json');

var pool = mysql.createPool({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database
});

exports.handler = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  pool.getConnection(function (err, connection) {
    var sqlquery = 'SELECT * FROM Project';
    if (event['pathParameters']) {
      if (event['pathParameters']['pid']) {
        sqlquery += ' WHERE PID="' + event['pathParameters']['pid'] + '"';
      }
    }
    connection.query(sqlquery, function (error, results, fields) {
      connection.release();
      var response = {
        "isBase64Encoded": false,
        "statusCode": 200,
        "headers": {},
        "body": JSON.stringify(results)
      }
      if (error) throw error;
      else callback(null, response);
    });
  });
};
