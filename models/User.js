const Sequelize = require('sequelize');

const DataTypes = Sequelize.DataTypes;

module.exports = (sequelize, models) => {
    if (!sequelize.isDefined("User")) {
        var schema = {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            email: {
                type: DataTypes.STRING,
                allowNull: true
            },
            nom: {
                type: DataTypes.STRING,
                allowNull: true
            },
            prenom: {
                type: DataTypes.STRING,
                allowNull: true
            },
            addresse: {
                type: DataTypes.STRING,
                allowNull: true
            },
            ccp: {
                type: DataTypes.STRING,
                allowNull: true
            },
            ville: {
                type: DataTypes.STRING,
                allowNull: true
            },
            mobile: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            imageProfile: {
                type: DataTypes.STRING,
                allowNull: true
            },
            nomCv: {
                type: DataTypes.STRING,
                allowNull: true
            },
            matieres: {
                type: DataTypes.STRING,
                allowNull: true
            }
            // TODO FIX ME
        };

        models.User = sequelize.define('User', schema, {
            timestamps: false,
            // createdAt: 'chn_insert',
            // updatedAt: 'chn_update',
            freezeTableName: true,
            tableName: 'user'
        });

        require("./UserCenter")(sequelize, models);

        models.User.hasMany(models.UserCenter, {foreignKey: 'user_id', as: 'UserCenters'});
    }
};
