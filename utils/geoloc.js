const NodeGeocoder = require('node-geocoder');



var options = {
    provider: 'google',

    // Optional depending on the providers
    httpAdapter: 'https', // Default
    apiKey: 'tutoseMeInsert', // for Mapquest, OpenCage, Google Premier
    formatter: null         // 'gpx', 'string', ...
};

var geocoder = NodeGeocoder(options);

/*// Using callback
geocoder.geocode('29 champs elysée paris', function(err, res) {
    console.log(res);
});*/



geocoder.geocode({address: '29 champs elysée', country: 'France', zipcode: '75008'}, function(err, res) {
    console.log(res);
});



// Or using Promise
g/*eocoder.geocode('29 champs elysée paris')
    .then(function(res) {
        console.log(res);
    })
    .catch(function(err) {
        console.log(err);
    });*/

module.exports = (origin) => {
    const lat = [];
    const lng = [];

    const address = geocoder.geocode(origin)
        .then(function (res) {
            console.log(res);

        })
        .catch(function (err) {
            console.log(err);
        });

}