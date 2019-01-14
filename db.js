var mysql = require('mysql');

var connection = mysql.createPool({
    host: 'localhost',
    user: 'tutosme.dev',
    password: 'HNmB1g1KWEODsI2u',
    database: 'tutosme.dev'
});
module.exports = connection;