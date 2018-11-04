sql = "SELECT * FROM `Group` g, Individual i, BelongsTo b WHERE g.GID=b.GID and i.IID=b.IID and i.IID=" + connection.escape(event.iid);

// Get all Groups that an Individual belongs to
// Endpoint: individuals/{iid}/groups

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
    var sqlquery = 'SELECT * FROM Individual i, `Group` g, BelongsTo b WHERE i.IID=b.IID and g.GID=b.GID and g.GID="' + event['pathParameters']['gid'] + '"';
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