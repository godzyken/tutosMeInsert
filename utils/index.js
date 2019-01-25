const XlsxExtractor = require('../utils/xlsxExtractor');
const FinderCV = require('../utils/finderCv');
const FinderPics = require('../utils/finderPics');
const fs = require('fs');
const _ = require('underscore');
const path = require('path');


const columns = {
    email: 0,
    first_name: 1,
    last_name: 2,
    address: 3,
    zip: 4,
    ville: 5,
    mobile_phone: 6,
    picture: 7,
    nomCv: 8,
    matieres: 9
};

module.exports = async (Models) => {
    const {headers, rows} = XlsxExtractor("BBD Bronze/BBD Bronze/BDD Bronze.xlsx");
    const CVs = FinderCV("BBD Bronze/BBD Bronze/CV");
    const blobpics = FinderPics("BBD Bronze/BBD Bronze/Photos");

    for (row of rows) {

        /* --- Extrait un User par ligne/row du fichier excel --- */

        const user = Models.User.build();
        user.email = row[headers[columns.email]];
        user.first_name = row[headers[columns.first_name]];
        user.last_name = row[headers[columns.last_name]];
        user.address = row[headers[columns.address]];
        user.zip = row[headers[columns.zip]];
        user.ville = row[headers[columns.ville]];
        user.mobile_phone = row[headers[columns.mobile_phone]];
        user.picture = row[headers[columns.picture]];
        user.nomCv = row[headers[columns.nomCv]];
        user.matieres = row[headers[columns.matieres]];



        if (user.nomCv === !CVs ) {
            /* ---- Récuperer le Cv.pdf ---- */

           var monCv = user.nomCv;

           return monCv;
        }


        if (user.picture === !blobpics in rows) {

            /* ---- Recuperer la liste de photo-profile ---- */
            return user.picture;
        }


        let filename = [user.first_name] + [user.last_name];

        let pathFile = 'https://s3.eu-west-3.amazonaws.com/tutosmebackoffice/client/' + filename;

        // console.log("l'Url de la photo profile est: " + uri);
        console.log("le nom de l'image serra: " + filename);
        console.log("le Cv fourni est le: " + monCv);
        console.log("le fichier de destination sera: " + pathFile);


        let src = path.join(__dirname, filename);

        let destDir = path.join(__dirname, '/client/');

        fs.access(destDir, (err) => {
            if (err)
                fs.mkdirSync(destDir);
            copyFile(src, path.join(destDir, filename));
        });

        function copyFile(src, dest) {

            let readStream = fs.createReadStream(src);

            readStream.once('error', (err) => {
                console.log(err);
            });

            readStream.once('end', () => {
                console.log('copy éffectuer');
            });

            readStream.pipe(fs.createWriteStream(dest));
        }


        // sauvegarder chaque User dans la bdd
        // await user.save();

        console.log(user.toJSON());

    }

    return rows;
};