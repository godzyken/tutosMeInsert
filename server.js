var app = require('./app');
var port = process.env.PORT || 3006;
var server = app.listen(port, function () {
    console.log('Le serveur est en écoute sur le port ' + port);
    const all_routes = require('express-list-endpoints');
    console.log(all_routes(app));
});