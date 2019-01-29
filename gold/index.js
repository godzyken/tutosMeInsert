const XlsxExtractor = require('../utils/xlsxExtractor');
const fs = require('fs');
const path = require('path');
const checksum = require('checksum');
const mkdirp = require('mkdirp');


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


/* -------------------------------------------------- */
const trainerDirInt = '2019-01-11- Arborescence Dropbox/Interne/Formateurs/';
/* -------------------------------------------------- */
const photoSrc = 'BDD GOLD/Photos Gold/';
/* -------------------------------------------------- */
const preUrl = 'https://s3.eu-west-3.amazonaws.com/tutosmebackoffice/trainer/';
/* -------------------------------------------------- */
const pathFileCV = 'BDD GOLD/CV Gold/';


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
    function createUrlPics(index, data) {
        let urlbase = (preUrl);
        let pathPics = index + "_" + checksum(data);
        let ext = '.jpeg';
        return Uri = path.join(urlbase, pathPics + ext);

    }

    // Creer le lien URL du cv
    function createUrlCv(index, data) {
        let urlbase = (preUrl);
        let pathPics = index + "_" + checksum(data);
        let ext = '.pdf';
        return Uri = path.join(urlbase, pathPics + ext);

    }

    // Copie du cv dans le répertoire destinataire
    function copyCV(src, dest) {

        let readStream = fs.createReadStream(src);

        readStream.once('error', (err) => {
            console.log(err);
        });

        readStream.once('end', () => {
            console.log('copy cv ok');
        });

        readStream.pipe(fs.createWriteStream(dest));
    }

    // Copie l'image dans le répertoire destinataire
    function copyPics(src, dest) {

        let readStream = fs.createReadStream(src);

        readStream.once('error', (err) => {
            console.log(err);
        });

        readStream.once('end', () => {
            console.log('copy image ok');
        });

        readStream.pipe(fs.createWriteStream(dest));
    }

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


        // Recherche L'image par Nom de fichier
        if (user.picture && user.picture !== "") {

            // Construit le Nom de l'image de l'utilisateur
            let names = user.first_name + user.last_name;
            // Formate le nom de l'image
            let filename = saniTize(names);
            // Construit l'url de la photo a sauvegarder
            let url = createUrlPics(index, filename);
            // Parcours le répertoire source d'images
            let src = path.join(photoSrc, user.picture);
            // Construit le nom du repertoire destinataire
            let destDir = path.join(__dirname, trainerDirInt + filename);
            mkdirp(destDir, function (err) {
                if (err)
                    console.error(err);
                else console.log('Répertoire image créé');
                user.picture = copyPics(src, path.join(destDir, filename + '.png'));
            });

            user.setAttributes(user.picture = url);

            // return user.picture;
        }
        else {
            console.log("pas de photo-profile pour: ", + user.first_name);
        }

        // Recherche le cv par Nom de fichier
        if (user.nomCv && user.nomCv !== "") {

            let names = user.first_name + user.last_name;
            let filename = saniTize(names);
            let url = createUrlCv(index, filename);

            // Parcours le répertoire source de CV
            let src = path.join(pathFileCV, saniTize(user.nomCv));
            // Construit le nom du repertoire destinataire
            let destDir = path.join(__dirname, trainerDirInt + saniTize(filename));
            mkdirp(destDir, function (err) {
                if (err)
                    console.error(err);
                else console.log('Répertoire cv créé');
                user.nomCv = copyCV(src, path.join(destDir, filename + '.pdf'));

            });

            user.setAttributes(user.resume = url);

            // return user.resume;
        }
        else {
            console.log("pas de cv disponible !");
        }


        await user.save().then(_user => {

            let trainer = new Models.Trainer();
            trainer.user_id = _user.id;
            trainer.user_picture = user.picture;
            trainer.user_resume = user.resume;
            trainer.user_nomCv = user.nomCv;

            console.log('-------------------------TESTING-------------------------');
            console.log('La ForeignKey trainer est: ' + trainer.user_id);
            console.log('----------------------------------------------------------');
            console.log('La photo du trainer est: ' + trainer.user_picture);
            console.log('----------------------------------------------------------');
            console.log('Le cv du Trainer est: ' + user.resume);
            console.log('----------------------END_TESTING-------------------------');


            return trainer.save().then(_trainer => {
                let skills = new Models.Skills();
                skills.trainer_id = _trainer.id;
                skills.name = user.matieres;


                return skills.save().then(param => {
                    let trainerSkills = new Models.TrainerSkills();
                    trainerSkills.id = param.id;
                    trainerSkills.trainer_id = _trainer.id;
                    trainerSkills.skill_id = skills.id;

                    return trainerSkills.save();

                });

            });

        });

        console.log('---------');
        console.log(user.toJSON());
        console.log('---------');


        console.log("<<<<<<<<<<<<<<<<<<<<<<<<[THE END]>>>>>>>>>>>>>>>>>>>>>>")
    }


    return rows;
};