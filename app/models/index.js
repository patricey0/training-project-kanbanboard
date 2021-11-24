// fichier catalogue

const List = require('./list');
const Card = require('./card');
const Tag = require('./tag');

// les associations

// 1:N

List.hasMany(Card, {
    // nom de la future propriété qui contiendra les cartes de chaque listes
    as: 'cards',
    foreignKey: 'list_id'
});

Card.belongsTo(List, {
    as: 'list',
    foreignKey: 'list_id'
});

// N:N

Card.belongsToMany(Tag, {
    as: 'tags',
    // nom de la table de liaison
    through: 'card_has_tag',
    // clef de la classe appelante
    foreignKey: 'card_id',
    // clef de l'autre classe
    otherKey: 'tag_id'
});

Tag.belongsToMany(Card, {
    as: 'cards',
    through: 'card_has_tag',
    foreignKey: 'tag_id',
    otherKey: 'card_id'
});

// on exporte tout pour pouvoir simplifier le require lors de l'utilisation des models (on appelera qu'un seul fichier, à savoir celui là)
module.exports = { List, Card, Tag }