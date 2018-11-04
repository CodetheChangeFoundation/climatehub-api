// Get all Individuals or specified Individual
// Endpoint: individuals/{iid}

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
    var sqlquery = 'SELECT * FROM Individual';
    if (event['pathParameters']) {
      if (event['pathParameters']['iid']) {
        sqlquery += ' WHERE IID="' + event['pathParameters']['iid'] + '"';
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
