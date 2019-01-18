const XlsxExtractor = require("../xlsxExtractor");
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
    monCv: 8,
    matieres: 9,
    siret: 10
};

module.exports = async (Models) => {
    const {headers, rows} = XlsxExtractor("./BBD Gold insert.xlsx");

    // let trainer = new user();
    const user = require('../models/User');


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
        trainer.picture = row[headers[columns.picture]];
        trainer.monCv = row[headers[columns.monCv]];
        trainer.matieres = row[headers[columns.matieres]];
        trainer.siret = row[headers[columns.siret]];

        trainer.user_id = Models.User.id;

        console.log(trainer);

        // sauvegarder chaque User dans la bdd
        // await trainer.save();


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


        console.log(trainer.toJSON());
    }

    return rows;
};
