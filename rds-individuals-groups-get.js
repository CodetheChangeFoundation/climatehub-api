sql = "SELECT * FROM `Group` g, Individual i, BelongsTo b WHERE g.GID=b.GID and i.IID=b.IID and i.IID=" + connection.escape(event.iid);

// Get all Groups that an Individual belongs to
// Endpoint: /individuals/{iid}/groups

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
    let sqlquery = `SELECT * FROM Individual i, Group g, BelongsTo b WHERE i.IID=b.IID and g.GID=b.GID and g.GID='${event['pathParameters']['gid']}';`;
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
