const XlsxExtractor = require("../xlsxExtractor");

const columns = {
    email: 0,
    nom: 1,
    prenom: 2,
    addresse: 3,
    ccp: 4,
    ville: 5,
    mobile: 6,
    nomCv: 7,
    matieres: 8,
    siret: 9
};



module.exports = async (Models) => {
    const {headers, rows} = XlsxExtractor("./BDD Bronze insert2.xlsx");

    for (row of rows) {
        const user = Models.User.build();
        user.email = row[headers[columns.email]];
        user.nom = row[headers[columns.nom]];
        user.prenom = row[headers[columns.prenom]];
        user.addresse = row[headers[columns.addresse]];
        user.ccp = row[headers[columns.ccp]];
        user.ville = row[headers[columns.ville]];
        user.mobile = row[headers[columns.mobile]];
        user.imageProfile = row[headers[columns.imageProfile]];
        user.nomCv = row[headers[columns.nomCv]];
        user.matieres = row[headers[columns.matieres]];
        user.siret = row[headers[columns.siret]];


        await user.save();
        const userCenter = Models.UserCenter.build();
        userCenter.user_id = user.id;
        userCenter.center_id = userCenter.center_id;
        userCenter.type = userCenter.type;

        // await userCenter.save();

        console.log(user.toJSON());
    }

    // console.log(headers[columns.ccp]);
    // console.log(rows[0][headers[columns.ccp]]);

    // console.log(rows[0][headers[columns.email]]);
    // console.log(headers);
    return rows;
};
