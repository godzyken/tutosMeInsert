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
            added_by: {
                type: DataTypes.INTEGER,
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

        };

        models.Skills = sequelize.define('Skills', schema, {
            timestamps: false,
            createdAt: 'chn_insert',
            updatedAt: 'chn_update',
            freezeTableName: true,
            tableName: 'skills'
        });

    }

};
