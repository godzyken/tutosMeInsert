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

        const trainer = Models.Trainer.build();
        trainer.email = rows[index][headers[columns.email]];
        trainer.first_name = rows[index][headers[columns.first_name]];
        trainer.last_name = rows[index][headers[columns.last_name]];
        trainer.address = rows[index][headers[columns.address]];
        trainer.ccp = rows[index][headers[columns.ccp]];
        trainer.ville = rows[index][headers[columns.ville]];
        trainer.mobile_phone = rows[index][headers[columns.mobile_phone]];
        trainer.picture = rows[index][headers[columns.picture]] || "";
        trainer.nomCv = rows[index][headers[columns.nomCV]];
        trainer.matieres = rows[index][headers[columns.matieres]];
        trainer.siret = rows[index][headers[columns.siret]];


        // Recherche par Nom de fichier
        if (trainer.picture && trainer.picture !== "") {

            // Construit le Nom de l'image de l'utilisateur
            let names = trainer.first_name + trainer.last_name;

            // Formate le nom de l'image
            let filename = saniTize(names);

            // Construit l'url de la photo a sauvegarder
            let url = createUrl(index, filename);

            // Parcours le répertoire source d'images
            let src = path.join(pathFilePicture, trainer.picture);

            // Construit le nom du repertoire destinataire
            let destDir = path.join(__dirname, '/formateur/' + filename);

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

                    console.log('------go---------go---------go---------------');
                    console.log('copy ok pour le formateur:' + filename);
                    console.log("Src : ", src);
                    console.log("Dest : ", dest);
                    console.log("Url : ", url);
                    console.log('------ok---------ok---------ok---------------');
                });

                readStream.pipe(fs.createWriteStream(dest));
            }

            trainer.picture = createUrl(index, url);

            return trainer.picture.push();
        }
        else {
            console.log("Erreur pas de photo-profile pour: ", trainer.first_name)
        }

        // // Recherche par Nom de fichier
        // if (trainer.nomCv && trainer.nomCv !="") {
        //
        //     // Construit le Nom du CV du formateur
        //     let names = trainer.first_name + trainer.last_name;
        //
        //     let filename = saniTize(names);
        //
        //     // Parcours le répertoire source de CV
        //     let src = path.join(pathFileCV, saniTize(trainer.nomCv));
        //
        //     // Construit le nom du repertoire destinataire
        //     let destDir = path.join(__dirname, '/formateur/' + saniTize(filename));
        //     fs.access(destDir, (err) => {
        //         if (err) {
        //             console.log(err);
        //             fs.mkdirSync(destDir);
        //         }
        //         copyFile(src, path.join(destDir, filename + '.pdf'));
        //     });
        //
        //     // Copie l'image dans le répertoire destinataire
        //     function copyFile(src, dest) {
        //
        //         let readStream = fs.createReadStream(src);
        //
        //         readStream.once('error', (err) => {
        //             console.log(err);
        //         });
        //
        //         readStream.once('end', () => {
        //             console.log('copy ok pour :');
        //             console.log("Src : ", src);
        //             console.log("Dest : ", dest)
        //         });
        //
        //         readStream.pipe(fs.createWriteStream(dest));
        //     }
        //
        // }
        // else {
        //     console.log("pas de cv disponible !")
        // }

        var user_id = 0
        var user = new Models.User();
        user.save([
            user.email = rows[index][headers[columns.email]],
            user.first_name = rows[index][headers[columns.first_name]],
            user.last_name = rows[index][headers[columns.last_name]],
            user.address = rows[index][headers[columns.address]],
            user.latitude = rows[index][headers[columns.latitude]],
            user.longitude = rows[index][headers[columns.longitude]],
            user.mobile_phone = rows[index][headers[columns.mobile_phone]],
            user.phone_number = rows[index][headers[columns.phone_number]],
            user.password = rows[index][headers[columns.password]],
            user.picture = rows[index][headers[columns.picture]],
            user.type = rows[index][headers[columns.type]],
            user.status = rows[index][headers[columns.status]],
            user.remember_token = rows[index][headers[columns.remember_token]],
            user.role_id = rows[index][headers[columns.role_id]],

        ]).then(param => {
            user_id = param.id
            console.log(param.id);
            trainer.user_id = user_id
            //REMPLIR LES CHAMPS TRAINERS
            return trainer.save();
        }).then(users => {
            console.log(users) // ... in order to get the array of user objects
        });


        trainer.user_id = user.id;


        console.log('----------');
        console.log(user.id);
        console.log('---------');

        //remplir les champs users
        // user.email = rows[index][headers[columns.email]];
        // user.first_name = rows[index][headers[columns.first_name]];
        // user.last_name = rows[index][headers[columns.last_name]];
        // user.address = rows[index][headers[columns.address]];
        // user.latitude = rows[index][headers[columns.latitude]];
        // user.longitude = rows[index][headers[columns.longitude]];
        // user.mobile_phone = rows[index][headers[columns.mobile_phone]];
        // user.phone_number = rows[index][headers[columns.phone_number]];
        // user.password = rows[index][headers[columns.password]];
        // user.picture = rows[index][headers[columns.picture]];
        // user.type = rows[index][headers[columns.type]];
        // user.status = rows[index][headers[columns.status]];
        // user.remember_token = rows[index][headers[columns.remember_token]];
        // user.role_id = rows[index][headers[columns.role_id]];

        //sauvegarder l'user en bdd et le récup
        // await user.save();

        // //créer un objet trainer, avec les infos nécéssaires + id de l'user crée
        // Models.trainer = new user.save((trainer) => {
        //
        //     // sauvegarder chaque utilisateur dans la bdd
        //     trainer.save();
        // });

        console.log(trainer.toJSON());
    }


    return rows;
};