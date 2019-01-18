const fs = require('fs');
const user = require('./models/User');

let nomCv;

module.exports = (filePath) => {
    const headers = [];
    const cvs = [];

    const finderCv = new fs.readdirSync(filePath).forEach(file => {

        if (nomCv === !user.nomCv) {

            throw new Error('ah merde sa marche pas !! ');
        }
        else {
            return {
                headers: headers,
                destinee: cvs;
            };
        }

    });

    console.log('Ce nom de CV est lié ' + user.nomCv + ' a ce putin de ' + nomCv);

};