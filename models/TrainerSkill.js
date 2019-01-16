const Sequelize = require('sequelize');

const DataTypes = Sequelize.DataTypes;

module.exports = (sequelize, models) => {
    if (!sequelize.isDefined("TrainerSkill")) {
        let schema = {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            trainer_id: {
                type: DataTypes.INTEGER,
                references:{
                    model: 'Trainer',
                    key: 'id'
                },
                allowNull: false
            },
            skill_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            createdAt: {
                field: 'created_at',
                type: DataTypes.DATE,
                allowNull: true
            },
            updatedAt: {
                field: 'updated_at',
                type: DataTypes.DATE,
                allowNull: true
            }
        };

        models.TrainerSkill = sequelize.define('TrainerSkill', schema, {
            timestamps: true,
            createdAt: 'chn_insert',
            updatedAt: 'chn_update',
            freezeTableName: true,
            tableName: 'trainer_skill'
        });

        require("./Trainer")(sequelize, models);

        models.TrainerSkill.belongsTo(models.Trainer, {foreignKey: 'trainer_id', as: 'Trainers'});
    }
};
