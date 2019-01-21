const XlsxExtractor = require('../utils/xlsxExtractor');
const fs = require('fs');
const _ = require('underscore');
const path = require('path');


const columns = {
    email: 0,
    first_name: 1,
    last_name: 2,
    address: 3,
    ccp: 4,
    ville: 5,
    mobile_phone: 6,
    picture: 7,
    nomCv: 8,
    matieres: 9
};

module.exports = async (Models) => {
    const {headers, rows} = XlsxExtractor("BBD Bronze/BBD Bronze/BDD Bronze insert.xlsx");

    let pathFilePicture = 'BBD Bronze/BBD Bronze/Photos';
    let pathFileCV = 'BBD Bronze/BBD Bronze/CV';


    for (row of rows) {

        /* ----------Extrait creer User Bronze -------------- */
        /* - -Parcour le fichier Excel: 'BBD Bronze.Xlsx' --- */
        /* - -Extrait les informations ligne par ligne:   --- */
        /* -------------------------------------------------- */

        const user = Models.User.build();
        user.email = row[headers[columns.email]];
        user.first_name = row[headers[columns.first_name]];
        user.last_name = row[headers[columns.last_name]];
        user.address = row[headers[columns.address]];
        user.ccp = row[headers[columns.ccp]];
        user.ville = row[headers[columns.ville]];
        user.mobile_phone = row[headers[columns.mobile_phone]];
        user.picture = row[headers[columns.picture]];
        user.nomCv = row[headers[columns.nomCv]];
        user.matieres = row[headers[columns.matieres]];



        if (user.picture && user.picture !="") {

            /* ---- Recuperer la liste de photo-profile ---- */

        let filename = [user.first_name] + [user.last_name];

        let src = path.join(pathFilePicture, user.picture);

        let destDir = path.join(__dirname, '/client/' + filename);

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
                console.log('copy éffectuer le client: ');
                console.log("Src : ", src)
                console.log("Dest : ", dest)
            });

            readStream.pipe(fs.createWriteStream(dest));
        }
        else{
            console.log("Erreur pas de cv pour: ", filename)
        }
        }


        // sauvegarder chaque User dans la bdd
        // await user.save();

        console.log(user.toJSON());

    }

    return rows;
};