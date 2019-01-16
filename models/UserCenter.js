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
            user_id: {
                type: DataTypes.INTEGER,
                references:{
                    model: 'User',
                    key: 'id'
                },
                allowNull: false
            },
            center_id: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: true
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: true
            },
            type: {
                type: DataTypes.ENUM('center_manager', 'group_manager'),
                defaultValue: null
            }
        };

        models.UserCenter = sequelize.define('UserCenter', schema, {
            // timestamps: true,
            // createdAt: 'chn_insert',
            // updatedAt: 'chn_update',
            freezeTableName: true,
            tableName: 'user_center'
        });

        require("./User")(sequelize, models);

        models.UserCenter.belongsTo(models.User, {foreignKey: 'user_id', as: 'User'});
    }
};
