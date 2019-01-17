const Sequelize = require('sequelize');



const DataTypes = Sequelize.DataTypes;

// const Image = Sequelize.afterBulkSync('image',DataTypes);

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
                type: DataTypes.INTEGER,
                allowNull: true
            },
            longitude: {
                type: DataTypes.INTEGER,
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
                type: DataTypes.STRING,
                allowNull: true
            },
            status: {
                type: DataTypes.STRING,
                allowNull: true
            },
            lastlongin_at: {
                type: DataTypes.DATE,
                allowNull: true
            },
            remember_token: {
                type: DataTypes.STRING,
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

        require("./UserCenter")(sequelize, models);

        models.User.hasMany(models.UserCenter, {foreignKey: 'user_id', as: 'UserCenters'});
    }
};
