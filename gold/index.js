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
    const {headers, rows} = XlsxExtractor("./BBD Gold insert.xlsx");

    for (row of rows) {

        // import des données depuis le fichier
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


        // insertion des clé étrangères dans la table userCenter
        const userCenter = Models.UserCenter.build();
        userCenter.user_id = user.id;
        // userCenter.center_id = Center.id;
        // userCenter.type = Center.type;

        await userCenter.save();


        // insertion des clé étrangères dans la table trainer
        const trainer = Models.Trainer.build();
        trainer.user_id = user.id;

        await trainer.save();

        // initialiser l'information matieres
        const skills = Models.Skills.build();
        skills.name = user.matieres;

        await skills.save();

        // insertion des clé étrangères dans la table trainer
        const trainerSkill = Models.TrainerSkill.build();
        trainerSkill.trainer_id = trainer.id;
        trainerSkill.skill_id = skills.id;

        await trainer.save();



        console.log(user.toJSON());
    }

    return rows;
};
