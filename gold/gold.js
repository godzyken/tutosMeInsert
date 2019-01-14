var db = require('../db');
var GoldSQL = require('./GoldToSql');


var golds = {
    getGold: function (callback) {
        return GoldSQL;
    },
    createGold: function (Gold, callback) {
        return db.query('INSERT INTO user_center(' +
            'email' +
            'first_name' +
            'last_name' +
            'address' +
            'mobile_phone' +
            'picture' +
            'monCV' +
            'matieres' +
            'siret' +
            ') values(?,?,?,?,?,?,?,?,?)',
            [
                Gold.email,
                Gold.fist_name,
                Gold.last_name,
                Gold.address,
                Gold.mobile_phone,
                Gold.picture,
                Gold.matieres,
                Gold.monCv,
                Gold.siret
            ], callback);
    }
};

module.exports = golds;
