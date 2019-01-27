const XlsxExtractor = require('../utils/xlsxExtractor');
const fs = require('fs');
const path = require('path');
const checksum = require('checksum');


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
    zip: 4,
    ville: 5,
    mobile_phone: 6,
    picture: 7,
    nomCV: 8,
    matieres: 9,
    siret: 10
};

module.exports = async (Models) => {

    // script d'extraction de données
    const {headers, rows} = XlsxExtractor("./BBD gold/BBD gold/BBD Gold.xlsx");        // TODO make it Global Variable

    // Parse les données nom, prenom du fichier xlsx
    function saniTize(origin) {
        let pattern = " ",
            re = new RegExp(pattern, "g");

        return origin.split(re).join("");
    }

    // Creer le lien URL de la photo-profile
    function createUrl(index, data) {
        let urlbase = ('https://s3.eu-west-3.amazonaws.com/tutosmebackoffice/trainer/'); // TODO make it Global Variable
        let pathPics = index + "_" + checksum(data);
        let ext = '.jpeg';
        let Uri = path.join(urlbase, pathPics + ext);
        return Uri;
    }

    // injitialise les repertoires de recherche
    let pathFilePicture = 'BBD gold/BBD gold/Photos/';  // TODO make it Global Variable
    let pathFileCV = 'BBD gold/BBD gold/CV';            // TODO make it Global Variable

    for (let index = 0; index < rows.length; index++) {

        const user = Models.User.build();
        user.email = rows[index][headers[columns.email]];
        user.first_name = rows[index][headers[columns.first_name]];
        user.last_name = rows[index][headers[columns.last_name]];
        user.address = rows[index][headers[columns.address]];
        user.zip = rows[index][headers[columns.zip]];
        user.ville = rows[index][headers[columns.ville]];
        user.mobile_phone = rows[index][headers[columns.mobile_phone]];
        user.picture = rows[index][headers[columns.picture]];
        user.nomCv = rows[index][headers[columns.nomCV]];
        user.matieres = rows[index][headers[columns.matieres]];
        user.siret = rows[index][headers[columns.siret]];


        // Recherche par Nom de fichier
        if (user.picture && user.picture != "") {

            // Construit le Nom de l'image de l'utilisateur
            let names = user.first_name + user.last_name;

            // Formate le nom de l'image
            let filename = saniTize(names);

            // Construit l'url de la photo a sauvegarder
            let url = createUrl(index, filename);

            // Parcours le répertoire source d'images
            let src = path.join(pathFilePicture, user.picture);

            // Construit le nom du repertoire destinataire
            let destDir = path.join(__dirname, '/formateur/' + filename);

            fs.access(destDir, (err) => {
                if (err) {
                    console.log(err);
                    fs.mkdirSync(destDir);
                }
                user.picture = copyFile(src, path.join(destDir, filename + '.png'));
            });


            // Copie l'image dans le répertoire destinataire
            function copyFile(src, dest) {

                let readStream = fs.createReadStream(src);

                readStream.once('error', (err) => {
                    console.log(err);
                });

                readStream.once('end', () => {

                    console.log('------go---------go---------go---------------');
                    console.log('copy ok pour le formateur:' + filename);
                    console.log("Src : ", src);
                    console.log("Dest : ", dest);
                    console.log("Url : ", url);
                    console.log('------ok---------ok---------ok---------------');
                });

                readStream.pipe(fs.createWriteStream(dest));
            }

            user.picture = url;

            return user.picture;
        }
        else {
            console.log("Erreur pas de photo-profile pour: ", user.first_name)
        }

        // Recherche par Nom de fichier
        if (user.nomCv && user.nomCv != "") {

            // Construit le Nom du CV du formateur
            let names = user.first_name + user.last_name;

            let filename = saniTize(names);

            // Parcours le répertoire source de CV
            let src = path.join(pathFileCV, saniTize(user.nomCv));

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
            console.log("pas de cv disponible !");
        }

        // await user.save().then(_user => {
        user.save().then(_user => {

            var trainer = new Models.Trainer();

            trainer.user_id = _user.id;
            trainer.picture = user.picture;
            //save user
            trainer.email = user.email;
            trainer.level = user.level;
            trainer.hourly_rate = user.hourly_rate;
            trainer.resume = user.nomCv;
            trainer.rib = user.rib;
            trainer.rib_file = user.rib_file;
            trainer.contract = user.contract;
            trainer.id_card = user.id_card;
            trainer.health_card = user.health_card;
            trainer.medecine_proof = user.medecine_proof;
            trainer.siren = user.siren;
            trainer.siren_file = user.siren_file;
            trainer.attestation_urssaf = user.attestation_urssaf;
            trainer.siren_waiting = user.siren_waiting;
            trainer.freelancer = user.freelancer;
            trainer.in_training = user.in_training;
            trainer.permis = user.permis;
            trainer.skills_json = user.skills_json;

            return trainer.save().then(_trainer => {
                var skills = new Models.Skills();

                skills.user_id = _trainer.id;

                skills.name = user.matieres;



                console.log('---------');
                console.log(trainer.toJSON());
                console.log('---------');
                console.log('---------');
                console.log(skills.toJSON());
                console.log('---------');

                // return skills.save(
                //     skills.user_id = trainer.id,
                //     skills.name = user.matieres
                // );

                return skills;

            });


        });

        console.log('---------');
        console.log(user.toJSON());
        console.log('---------');

        process.exit();

        console.log("<<<<<<<<<<<<<<<<<<<<<<<<[THE END]>>>>>>>>>>>>>>>>>>>>>>")
    }


    return rows;
};