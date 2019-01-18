const XlsxExtractor = require("../xlsxExtractor");
const FinderCV = require("../finderCV");
const fs = require('fs');
const request = require('request');
const stream = require('stream');
const dl = require('../downloader');


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
    const {headers, rows} = XlsxExtractor("./BDD Bronze insert.xlsx");

    const {titreCv, destCv} = FinderCV('./BBD Bronze/BBD Bronze/CV/');


    for (row of rows) {

        /* --- Créer un User a partir d'une ligne/row du fichier excel --- */

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


        for(titreCv of destCv) {

            /* ---- Récuperer la liste de Cv.pdf ---- */
            user.nomCv = row[titreCv[columns.nomCv]];

        }

        // sauvegarder chaque User dans la bdd
        // await user.save();

        // creer un user(trainer) dans la table trainer
        // const trainer = Models.Trainer.build();
        // await trainer.user_id = user.id;

        // sauvegarder chaque Trainer dans la bdd
        // await trainer.save();

        // initialiser l'information matieres
        // const skills = Models.Skills.build();
        // skills.name = user.matieres;


        /* ---- import des informations dans l'arborescence ----*/

        // recupération de l'url de la photo-client
        let uri = user.picture;

        // construction du nom de fichier
        let filename = [user.first_name] + [user.last_name];

        // charge les données dans les repertoires définies
        let path = './images/' + filename;

        console.log("l'URL de l'image est: " + uri);
        console.log("le nom de l'image serra: " + filename);
        console.log("le fichier de destination serra: " + path);


        /* ---- Telecharger la photo profile par on url ---- */

        let download = function (uri, filename, callback) {

            request.head(uri, function (err, res, body) {
                if (err) callback(err, filename);
                else {
                    console.log('content-type:', res.headers['content-type']);
                    console.log('content-length:', res.headers['content-length']);
                    var stream = request(uri);
                    var [type, ext] = res.headers['content-type'].split("/");

                    stream.pipe(
                        fs.createWriteStream(`${filename}.${ext}`)
                            .on('error', function (err) {
                                callback(error, filename);
                                stream.read();
                            })
                    )
                        .on('close', function () {
                            callback(null, filename);
                        });
                }
            });
        };


        download(uri, path, function () {
            console.log('done');
        });

        // affichege du resultat

        console.log(download);


        console.log(user.toJSON());
    }

    return rows;
};
