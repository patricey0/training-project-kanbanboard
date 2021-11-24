const sequelize = require('../database');
const { DataTypes, Model } = require('sequelize');

class List extends Model {};

List.init({
    name: {
        type: DataTypes.TEXT,
        // vérifie que ça n'est pas null
        allowNull: false,
        // vérifie qu'une liste n'ait pas deux fois le meme nom
        unique: true,
        validate: {
            // vérifie que ça n'est pas une chaine de caractère vide
            notEmpty: true
        }   
    },
    position: DataTypes.INTEGER
}, {
    tableName: 'list',
    sequelize
});

module.exports = List;