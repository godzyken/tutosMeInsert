const XlsxExtractor = require("../xlsxExtractor");

const columns = {
    email: 0,
    nom: 1,
    ccp: 4
};

module.exports = async (Models) => {
    const {headers, rows} = XlsxExtractor("./BBD Gold insert.xlsx");

    for (row of rows) {
        const user = Models.User.build();
        user.email = row[headers[columns.email]];


        // await user.save();
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
