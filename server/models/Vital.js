const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Vital = sequelize.define('Vital', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    type: {
        type: DataTypes.STRING, // 'BP', 'Sugar', 'HeartRate'
        allowNull: false
    },
    value: {
        type: DataTypes.STRING, // String to handle "120/80" for BP
        allowNull: false
    },
    unit: {
        type: DataTypes.STRING,
        allowNull: true
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
});

User.hasMany(Vital, { foreignKey: 'userId' });
Vital.belongsTo(User, { foreignKey: 'userId' });

module.exports = Vital;
