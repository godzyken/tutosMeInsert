var mysql = require('mysql');

var connection = mysql.createPool({
    host: 'http://52.47.104.12/mysqlCloudManager/',              // Lien de la bdd - cloud
    user: 'tutosme.dev',                                        // Loggin
    password: 'HNmB1g1KWEODsI2u',                               // MDP
    database: 'tutosme.dev',                                    // Bdd dev
    server: 'appsvelocity.cabutdpbsmsc.eu-west-3.rds.amazonaws.com' // serveur de dev
});
module.exports = connection;