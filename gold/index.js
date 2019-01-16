const XlsxExtractor = require("../xlsxExtractor");

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
    const {headers, rows} = XlsxExtractor("./BDD Bronze insert.xlsx");

    for (row of rows) {
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


        await user.save();


        const userCenter = Models.UserCenter.build();
        userCenter.user_id = user.id;
        userCenter.center_id = userCenter.center_id;
        userCenter.type = userCenter.type;

        await userCenter.save();

        console.log(user.toJSON());
    }

    return rows;
};
