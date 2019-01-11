var db = require('../db');
var lineReader = require('line-reader');

var Bronze = {
    getbronze: function (callback) {
        return db.query('SELECT * FROM user', callback);
    },
    createbronze: function (Bronze, callback) {
        return db.query('INSERT INTO user(' +
            'email' +
            'first_name' +
            'last_name' +
            'address' +
            'latitude' +
            'longitude'+
            'mobile_phone' +
            'phone_number' +
            'password' +
            'picture' +
            'type' +
            'status' +
            ') values(?,?,?,?,?,?,?,?,?,?,?)',
                [
                    Bronze.email,
                    Bronze.fist_name,
                    Bronze.last_name,
                    Bronze.address,
                    Bronze.latitude,
                    Bronze.longitude,
                    Bronze.mobile_phone,
                    Bronze.phone_number,
                    Bronze.password,
                    Bronze.picture,
                    Bronze.type,
                    Bronze.status
                ], callback);
    }
}

lineReader.eachLine('BDD Bronze insert.txt', function (line, last) {
    console.log(line);
    // TODO what i want with line
    if(last){
        // ou verifier si c'est la derniere ligne
    }
});

lineReader.open('BDD Bronze insert.txt', function(reader){
    if ((reader.hasNextLine)) {
        reader.nextLine(function (line) {
            console.log(line);
        });
    }
});

module.exports = Bronze;