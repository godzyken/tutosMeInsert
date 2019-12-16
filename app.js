const Sequelize = require('sequelize');
const glob = require("glob");
const fs = require("fs-extra");


const sequelize = new Sequelize('tutosme.dev', 'tutosme.dev', '############', {
    host: 'appsvelocity.##########.eu-west-3.rds.amazonaws.com',
    dialect: 'mysql'
});

const Models = {};

(async () => {
    await sequelize.authenticate();

    glob.sync("./models/*.js").forEach(file => {

        require(file)(sequelize, Models);
    });

    Object.keys(Models).forEach((modelName) => {
        if (Models[modelName].associate){
            Models[modelName].associate(Models);
        }
    });

    let formateur = await require("./gold/index")(Models);
    let client = await require("./bronze/index")(Models);

    await fs.outputFile("./gold/data.json", JSON.stringify(formateur, null, 4), "utf8");
    await fs.outputFile("./bronze/data.json", JSON.stringify(client, null, 4), "utf8");

    console.log("END");
})().catch(err => {
    console.error(err);
});
