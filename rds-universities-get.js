// Get all Universities
// Endpoint: universities/

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
  pool.getConnection(function(err, connection) {
    connection.query('SELECT * FROM University', function (error, results, fields) {
      connection.release();
      if (error) throw error;
      else callback(null, results);
    });
  });
};
