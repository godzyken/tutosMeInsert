const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = (sequelize, models) => {
    if (!sequelize.isDefined("TrainersSkills")) {
        let schema = {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            trainer_id: {
                type: DataTypes.INTEGER,
                foreignKey: true,
                allowNull: false
            },
            skill_id: {
                type: DataTypes.INTEGER,
                foreignKey: true,
                allowNull: false
            }
        };
        models.TrainerSkills = sequelize.define('TrainerSkills', schema, {
            timestamps: false,
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE,
            freezeTableName: true,
            tableName: 'trainer_skill'
        });

        models.Skills.belongsToMany(models.Trainer, {
            through: models.TrainerSkills
        });

        models.Trainer.belongsToMany(models.Skills, {
            through: models.TrainerSkills,
        });
    }
};