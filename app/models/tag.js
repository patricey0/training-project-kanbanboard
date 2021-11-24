const sequelize = require('../database');
const { DataTypes, Model } = require('sequelize');

class Tag extends Model {};

Tag.init({
    name: DataTypes.TEXT,
    color: DataTypes.TEXT
}, {
    tableName: 'tag',
    sequelize
});

module.exports = Tag;