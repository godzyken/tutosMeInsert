const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = (sequelize, models) => {
    if (!sequelize.isDefined("User")) {
        let schema = {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            email: {
                type: DataTypes.STRING,
                allowNull: true
            },
            first_name: {
                type: DataTypes.STRING,
                allowNull: true
            },
            last_name: {
                type: DataTypes.STRING,
                allowNull: true
            },
            address: {
                type: DataTypes.STRING,
                allowNull: true
            },
            latitude: {
                type: DataTypes.DECIMAL(10, 0),
                allowNull: true
            },
            longitude: {
                type: DataTypes.DECIMAL(10, 0),
                allowNull: true
            },
            mobile_phone: {
                type: DataTypes.STRING,
                allowNull: true
            },
            phone_number: {
                type: DataTypes.STRING,
                allowNull: true
            },
            password: {
                type: DataTypes.STRING,
                allowNull: true
            },
            picture: {
                type: DataTypes.STRING,
                allowNull: true
            },
            type: {
                type: DataTypes.ENUM('boss', 'worker', 'trainer', 'customer'),
                allowNull: true
            },
            status: {
                type: DataTypes.ENUM('waiting', 'active', 'deleted'),
                allowNull: true
            },
            lastlongin_at: {
                 type: DataTypes.DATE,
                 allowNull: true
             },
            remember_token: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            role_id: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
        };

        models.User = sequelize.define('User', schema, {
            timestamps: false,
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE,
            freezeTableName: true,
            tableName: 'user'
        });

        models.User.belongsTo(models.Trainer, {
            as: 'Trainers',
            through: models.Trainer,
            foreignKey: 'userId',
            tableName: 'trainer'
        });

    }
};
