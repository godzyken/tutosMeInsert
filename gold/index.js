const XlsxExtractor = require('../utils/xlsxExtractor');
const fs = require('fs');
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
    monCv: 8,
    matieres: 9,
    siret: 10
};

module.exports = async (Models) => {
    const {headers, rows} = XlsxExtractor("./BBD gold/BBD gold/BBD Gold.xlsx");

    let pathFilePicture = 'BBD gold/BBD gold/Photos/';
    let pathFileCV = 'BBD gold/BBD gold/CV';




    for (row of rows) {
        /* --- Créer un User a partir d'une ligne/row du fichier excel --- */

        const trainer = Models.Trainer.build();
        trainer.email = row[headers[columns.email]];
        trainer.first_name = row[headers[columns.first_name]];
        trainer.last_name = row[headers[columns.last_name]];
        trainer.address = row[headers[columns.address]];
        trainer.ccp = row[headers[columns.ccp]];
        trainer.ville = row[headers[columns.ville]];
        trainer.mobile_phone = row[headers[columns.mobile_phone]];
        trainer.picture = row[headers[columns.picture]] || "";
        trainer.monCv = row[headers[columns.monCv]];
        trainer.matieres = row[headers[columns.matieres]];
        trainer.siret = row[headers[columns.siret]];

        trainer.user_id = Models.User.id;

        /* ---- recupere le nom de la photo ---- */

        if (trainer.picture && trainer.picture != "") {

            let filename = trainer.first_name + trainer.last_name;

            let src = path.join(pathFilePicture, trainer.picture);

            let destDir = path.join(__dirname, '/formateur/' + filename);

            fs.access(destDir, (err) => {
                if (err) {
                    console.log(err);
                    fs.mkdirSync(destDir);
                }
                copyFile(src, path.join(destDir, filename));
            });

            function copyFile(src, dest) {

                let readStream = fs.createReadStream(src);

                readStream.once('error', (err) => {
                    console.log(err);
                });

                readStream.once('end', () => {
                    console.log('copy ok pour le formateur:' + filename);
                    console.log("Src : ", src);
                    console.log("Dest : ", dest)
                });

                readStream.pipe(fs.createWriteStream(dest));
            }

        }
        else {
            console.log("pas d'image pour : ", trainer.first_name)
        }


        if (trainer.nomCv && trainer.nomCv != "") {

            let filename = trainer.first_name + trainer.last_name;

            let src = path.join(pathFileCV, trainer.nomCv);

            let destDir = path.join(__dirname, '/formateur/' + filename);

            fs.access(destDir, (err) => {
                if (err) {
                    console.log(err);
                    fs.mkdirSync(destDir);
                }
                copyFile(src, path.join(destDir, filename));
            });

            function copyFile(src, dest) {

                let readStream = fs.createReadStream(src);

                readStream.once('error', (err) => {
                    console.log(err);
                });

                readStream.once('end', () => {
                    console.log('copy ok pour :');
                    console.log("Src : ", src);
                    console.log("Dest : ", dest)
                });

                readStream.pipe(fs.createWriteStream(dest));
            }

        }
        else {
            console.log("pas de cv pour : ", filename)
        }

        // sauvegarder chaque User dans la bdd
        // await trainer.save();

        console.log(trainer.toJSON());
    }


    return rows;
};
