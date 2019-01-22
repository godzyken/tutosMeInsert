const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = (sequelize, models) => {
    if (!sequelize.isDefined("Skills")) {
        let schema = {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                type: DataTypes.STRING,
                allowNull: true
            },
            keywords: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            comment: {
                type: DataTypes.STRING,
                allowNull: true
            },
            status: {
                type: DataTypes.ENUM('waiting', 'valid', 'deleted'),
                allowNull: true
            },
            createdAt: {
                allowNull: true,
                type: DataTypes.DATE
            },
            updatedAt: {
                allowNull: true,
                type: DataTypes.DATE
            }
        };

        models.Skills = sequelize.define('Skills', schema, {
            timestamps: false,
            createdAt: 'chn_insert',
            updatedAt: 'chn_update',
            freezeTableName: true,
            tableName: 'skills'
        });

        require("./Trainer")(sequelize,models);

        models.Skills.hasMany(models.Trainer, {foreignKey: 'trainer_id', as: 'Trainers'});
    }
};
