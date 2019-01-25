const XlsxExtractor = require('../utils/xlsxExtractor');
const fs = require('fs');
const path = require('path');
const checksum = require('checksum');


/* -------------------------------------------------- */
/* -------------------------------------------------- */
/* -----------Extrait creer User Bronze ------------- */
/* -------------------------------------------------- */
/* -------------------------------------------------- */
/* - -Parcour le fichier Excel: 'BBD Bronze.Xlsx' --- */
/* - -Extrait les informations ligne par ligne    --- */
/* - -Copies les Images de profile utilisateur    --- */
/* - -Copies les Cv de chaque profile utilisateur --- */
/* - -Sauvegarde les données dans la Table: 'User'--- */
/* -------------------------------------------------- */


/*----- Initialise le tableau de champs de données ---*/
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

    /* ---- script d'extraction de données  ---- */
    const {headers, rows} = XlsxExtractor("./BBD Bronze/BBD Bronze/BDD Bronze.xlsx");

    // Parse les données nom, prenom du fichier xlsx
    function saniTize(origin) {
        let pattern = " ",
            re = new RegExp(pattern, "g");

        return origin.split(re).join("");
    }

    // Creer le lien URL de la photo-profile
    function createUrl(index, data) {
        let urlbase = ('https://s3.eu-west-3.amazonaws.com/tutosmebackoffice/user/'); // TODO make it Global Variable
        let pathPics = index + "_" + checksum(data);
        let ext = '.jpeg';
        let Uri = path.join(urlbase, pathPics + ext);

        return Uri;
    }

    // injitialise les srepertoires de recherche
    let pathFilePicture = 'BBD Bronze/BBD Bronze/Photos';
    let pathFileCV = 'BBD Bronze/BBD Bronze/CV';

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
        user.nomCv = rows[index][headers[columns.nomCv]];
        user.matieres = rows[index][headers[columns.matieres]];

        // Recherche par Nom de fichier
        if (user.picture && user.picture !== "") {

            // Construit le Nom de l'image Utilisateur
            let names = user.first_name + user.last_name;

            // formatage du nom utilisateur
            let filename = saniTize(names);

            // Construit l'url de la photo a sauvegarder
            let url = createUrl(index, filename);

            // Parcours le répertoire source d'images
            let src = path.join(pathFilePicture, user.picture);

            // Construit le nom du repertoire destinataire
            let destDir = path.join(__dirname, '/client/' + filename);

            fs.access(destDir, (err) => {
                if (err)
                    fs.mkdirSync(destDir);
                copyFile(src, path.join(destDir, filename + '.png'));
            });

            // Copie l'image dans le répertoire destinataire
            function copyFile(src, dest) {

                let readStream = fs.createReadStream(src);

                readStream.once('error', (err) => {
                    console.log(err);
                });

                readStream.once('end', () => {

                    console.log('------go---------go---------go---------------');
                    console.log('copy ok pour le client:' + filename);
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
            console.log("Erreur pas de photo-profile pour: " + user.first_name)
        }


        // Recherche par Nom de fichier
        if (user.nomCv && user.nomCv != "") {

            // Construit le Nom du CV de l'Utilisateur
            let names = user.first_name + user.last_name;

            let filename = saniTize(names);

            // Parcours le répertoire source de CV
            let src = path.join(pathFileCV, saniTize(user.nomCv));

            // Construit le nom du repertoire destinataire
            let destDir = path.join(__dirname, '/client/' + saniTize(filename));

            console.log('------------');
            console.log(destDir);
            console.log('------------');

            fs.access(destDir, (err) => {
                if (err) {
                    console.log(err);
                    fs.mkdirSync(destDir);
                }
                copyFile(src, path.join(destDir, filename + '.pdf'));
            });


            // Copie le cv dans le répertoire destinataire
            function copyFile(src, dest) {

                let readStream = fs.createReadStream(src);

                readStream.once('error', (err) => {
                    console.log(err);
                });

                readStream.once('end', () => {
                    console.log('copy ok pour: ' + filename);
                    console.log("Src : ", src);
                    console.log("Dest : ", dest)
                });

                readStream.pipe(fs.createWriteStream(dest));
            }
        }
        else {
            console.log("pas de cv pour : ")
        }


        // sauvegarder chaque User dans la bdd
        // await user.save();

        await  user.save();

        process.exit();

        console.log(user.toJSON());
        console.log("<<<<<<<<<<<<<<<<<<<<<<<<[THE END]>>>>>>>>>>>>>>>>>>>>>>")
    }


    return rows;
};