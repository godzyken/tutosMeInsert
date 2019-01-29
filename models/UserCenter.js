const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;


module.exports = (sequelize, models) => {
    if (!sequelize.isDefined("UserCenter")) {
        let schema = {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            type: {
                type: DataTypes.ENUM('center_manager', 'group_manager'),
                allowNull: true
            }
        };

        models.UserCenter = sequelize.define('UserCenter', schema, {
            timestamps: false,
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE,
            freezeTableName: true,
            tableName: 'user_center'
        });

        models.User.hasMany(models.UserCenter);

    }
};