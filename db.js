var mysql = require('mysql2/promise');
var maillemsql = require('mysql');

var connection = maillemsql.createConnection({
    host: 'appsvelocity.cabutdpbsmsc.eu-west-3.rds.amazonaws.com',                      // server: 'appsvelocity.cabutdpbsmsc.eu-west-3.rds.amazonaws.com'
    user: 'tutosme.dev',                               // Loggin : tutosme.dev
    password: 'HNmB1g1KWEODsI2u',                               // MDP : HNmB1g1KWEODsI2u
    database: 'tutosme.dev',                        // Bdd dev : tutosme.dev

});

connection.connect(function() {
    console.log("Connected!");
});

module.exports = connection;