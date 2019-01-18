const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = (sequelize, models) => {
    if (!sequelize.isDefined("Trainer")) {
        let schema = {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            level: {
                type: DataTypes.ENUM('bronze', 'silver', 'gold', 'greylist', 'blacklist'),
                allowNull: true
            },
            hourly_rate: {
                type: DataTypes.DECIMAL,
                allowNull: true
            },
            resume: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            rib: {
                type: DataTypes.STRING,
                allowNull: true
            },
            rib_file: {
                type: DataTypes.STRING,
                allowNull: true
            },
            contract: {
                type: DataTypes.STRING,
                allowNull: true
            },
            id_card: {
                type: DataTypes.STRING,
                allowNull: true
            },
            health_card: {
                type: DataTypes.STRING,
                allowNull: true
            },
            medecine_proof: {
                type: DataTypes.STRING,
                allowNull: true
            },
            siren: {
                type: DataTypes.STRING,
                allowNull: true
            },
            siren_file: {
                type: DataTypes.STRING,
                allowNull: true
            },
            attestation_urssaf: {
                type: DataTypes.STRING,
                allowNull: true
            },
            siren_waiting: {
                type: DataTypes.TINYINT,
                allowNull: true
            },
            freelancer: {
                type: DataTypes.TINYINT,
                allowNull: true
            },
            createdAt: {
                allowNull: true,
                type: DataTypes.DATE
            },
            updatedAt: {
                allowNull: true,
                type: DataTypes.DATE
            },
            in_training: {
                type: DataTypes.TINYINT,
                allowNull: true
            },
            permis: {
                type: DataTypes.TINYINT,
                allowNull: true
            },
            skills_json: {
                type: DataTypes.TEXT,
                allowNull: true
            },
        };

        models.Trainer = sequelize.define('Trainer', schema, {
            timestamps: false,
            createdAt: 'chn_insert',
            updatedAt: 'chn_update',
            freezeTableName: true,
            tableName: 'trainer'
        });

        require("./User")(sequelize, models);

        models.Trainer.hasMany(models.User, {foreignKey: 'user_id', as: 'Users'});
    }
};
