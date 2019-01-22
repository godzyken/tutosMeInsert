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
                type: DataTypes.BLOB,
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
            createdAt: {
                allowNull: true,
                type: DataTypes.DATE
            },
            updatedAt: {
                allowNull: true,
                type: DataTypes.DATE
            }
        };

        models.User = sequelize.define('User', schema, {
            timestamps: false,
            createdAt: 'chn_insert',
            updatedAt: 'chn_update',
            freezeTableName: true,
            tableName: 'user'
        });

        require("./Trainer")(sequelize, models);

        models.User.belongsTo(models.Trainer, {foreignKey: 'trainer_id', as: 'Trainers'});
    }
};
