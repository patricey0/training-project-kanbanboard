const sequelize = require('../database');
const { DataTypes, Model } = require('sequelize');

class Card extends Model {};

Card.init({
    title: DataTypes.TEXT,
    position: DataTypes.INTEGER,
    color: DataTypes.TEXT
}, {
    tableName: 'card',
    sequelize
});

module.exports = Card;