const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const AccessGrant = sequelize.define('AccessGrant', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    ownerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    viewerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    reportId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Reports',
            key: 'id'
        }
    },
    permissions: {
        type: DataTypes.STRING, // 'read-only'
        defaultValue: 'read-only'
    }
}, {
    indexes: [
        {
            unique: true,
            fields: ['ownerId', 'viewerId', 'reportId']
        }
    ]
});

// Relationships
User.hasMany(AccessGrant, { as: 'SharedWithOthers', foreignKey: 'ownerId' });
User.hasMany(AccessGrant, { as: 'SharedWithMe', foreignKey: 'viewerId' });

module.exports = AccessGrant;
