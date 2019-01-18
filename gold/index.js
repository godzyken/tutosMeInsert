const XlsxExtractor = require("../xlsxExtractor");
const fs = require('fs');
const request = require('request');

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
        user.monCv = row[headers[columns.monCv]];
        user.matieres = row[headers[columns.matieres]];
        user.siret = row[headers[columns.siret]];

        // sauvegarder chaque User dans la bdd
        // await user.save();


        // creer un user(trainer) dans la table trainer
        const trainer = Models.Trainer.build();
        trainer.user_id = user.id;

        // sauvegarder chaque Trainer dans la bdd
        // await trainer.save();

        // initialiser l'information matieres
        const skills = Models.Skills.build();
        skills.name = user.matieres;


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

        let download = function (uri, filename, callback) {

            // if (typeof uri === 'undefined' in row) {
            //     throw new Error('désolé vous n\'avez pas fourni de photo profile.');
            //
            // } else {
            //     return uri;
            // }

            request.head(uri, function (err, res, body) {
                console.log('content-type:', res.headers['content-type']);
                console.log('content-length:', res.headers['content-length']);

                request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);

            });
        };

        download(uri, path, function () {
            console.log('done');
        });


        console.log(download);


        console.log(user.toJSON());
    }

    return rows;
};


/*

You can use Axios (a promise-based HTTP client for Node.js) to download images in the order of your choosing in an asynchronous environment:

    npm i axios
Then, you can use the following basic example to begin downloading images:

    const fs    = require( 'fs' );
const axios = require( 'axios' );

/!* ============================================================
    Function: Download Image
============================================================ *!/

const download_image = ( url, image_path ) => axios( { 'url' : url, 'responseType' : 'stream' } ).then( response =>
{
    response.data.pipe( fs.createWriteStream( image_path ) );

    return { 'status' : true, 'error' : '' };

}).catch( error => ( { 'status' : false, 'error' : 'Error: ' + error.message } ) );

/!* ============================================================
    Download Images in Order
============================================================ *!/

(async () =>
{
    let example_image_1 = await download_image( 'https://example.com/test-1.png', 'example-1.png' );

    console.log( example_image_1.status ); // true
    console.log( example_image_1.error );  // ''

    let example_image_2 = await download_image( 'https://example.com/does-not-exist.png', 'example-2.png' );

    console.log( example_image_2.status ); // false
    console.log( example_image_2.error );  // 'Error: Request failed with status code 404'

    let example_image_3 = await download_image( 'https://example.com/test-3.png', 'example-3.png' );

    console.log( example_image_3.status ); // true
    console.log( example_image_3.error );  // ''

})();*/
