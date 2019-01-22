const XlsxExtractor = require('../utils/xlsxExtractor');
const fs = require('fs');
const path = require('path');


/* -------------------------------------------------- */
/* -------------------------------------------------- */
/* ----------- Création d'un User Gold -------------- */
/* -------------------------------------------------- */
/* -------------------------------------------------- */
/* - -Parcour le fichier Excel: 'BBD Bronze.Xlsx' --- */
/* - -Extrait les informations ligne par ligne    --- */
/* - -Copies les Images de profile utilisateur    --- */
/* - -Copies les Cv de chaque profile utilisateur --- */
/* - -Sauvegarde les données dans la Table: 'User'--- */
/* -------------------------------------------------- */


// Initialise le tableau de champs de données.
const columns = {
    email: 0,
    first_name: 1,
    last_name: 2,
    address: 3,
    ccp: 4,
    ville: 5,
    mobile_phone: 6,
    picture: 7,
    nomCV: 8,
    matieres: 9,
    siret: 10
};

module.exports = async (Models) => {

    // script d'extraction de données
    const {headers, rows} = XlsxExtractor("./BBD gold/BBD gold/BBD Gold.xlsx");

    // Parse les données du fichier xlsx
    function saniTize(origin) {
        let pattern = " ",
            re = new RegExp(pattern, "g");

        return origin.split(re).join("");
    }


    // injitialise les repertoires de recherche
    let pathFilePicture = 'BBD gold/BBD gold/Photos/';
    let pathFileCV = 'BBD gold/BBD gold/CV';

    for (row of rows) {

        const trainer = Models.Trainer.build();
        trainer.email = row[headers[columns.email]];
        trainer.first_name = row[headers[columns.first_name]];
        trainer.last_name = row[headers[columns.last_name]];
        trainer.address = row[headers[columns.address]];
        trainer.ccp = row[headers[columns.ccp]];
        trainer.ville = row[headers[columns.ville]];
        trainer.mobile_phone = row[headers[columns.mobile_phone]];
        trainer.picture = row[headers[columns.picture]] || "";
        trainer.nomCv = row[headers[columns.nomCV]];
        trainer.matieres = row[headers[columns.matieres]];
        trainer.siret = row[headers[columns.siret]];

        // trainer.user_id = Models.User.id;


        // Recherche par Nom de fichier
        if (trainer.picture && trainer.picture !== "") {

            // Construit le Nom de l'image du formateur
            let names = trainer.first_name + trainer.last_name;

            let filename = saniTize(names);


            // Parcours le répertoire source d'images
            let src = path.join(pathFilePicture, trainer.picture);

            // Construit le nom du repertoire destinataire
            let destDir = path.join(__dirname, '/formateur/' + saniTize(filename));
            fs.access(destDir, (err) => {
                if (err) {
                    console.log(err);
                    fs.mkdirSync(destDir);
                }
                copyFile(src, path.join(destDir, filename + '.png'));
            });

            // Copie l'image dans le répertoire destinataire
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
            console.log("Erreur pas de photo-profile pour: ", trainer.first_name)
        }

        // Recherche par Nom de fichier
        if (trainer.nomCv && trainer.nomCv !="") {

            // Construit le Nom du CV du formateur
            let names = trainer.first_name + trainer.last_name;

            let filename = saniTize(names);

            // Parcours le répertoire source de CV
            let src = path.join(pathFileCV, saniTize(trainer.nomCv));

            // Construit le nom du repertoire destinataire
            let destDir = path.join(__dirname, '/formateur/' + saniTize(filename));
            fs.access(destDir, (err) => {
                if (err) {
                    console.log(err);
                    fs.mkdirSync(destDir);
                }
                copyFile(src, path.join(destDir, filename + '.pdf'));
            });

            // Copie l'image dans le répertoire destinataire
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
            console.log("pas de cv disponible !")
        }

        // sauvegarder chaque utilisateur dans la bdd
        await trainer.save();

        console.log(trainer.toJSON());
    }


    return rows;
};
