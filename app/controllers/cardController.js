const { Card, Tag } = require('../models');
// on va chercher notre fonction d'erreur
const { catchError } = require('../utils');

exports.create = async (req, res) => {
    try {
        /*req.body = {
            position: 2,
            title: 'truc',
            color: '#eeeeee',
            list_id: 1
        }*/
        if(!req.body.title || !req.body.list_id) return res.status(400).json({error: "Veuillez renseigner un nom pour la carte et la liste dans laquelle l'ajouter !"});
        // créer la carte dans la base
        const card = await Card.create(req.body);
        // renvoyer la nouvelle carte
        res.json(card);
    } catch (error) {
        catchError(error, res);
    }
}

exports.getOne = async (req, res) => {
    try {
        // récupérer la carte avec ses tags
        const card = await Card.findByPk(req.params.id, {
            include: 'tags'
        });
        
        // renvoyer la réponse au client
        res.json(card);
    } catch (error) {
        catchError(error, res);
    }
}

exports.update = async (req, res) => {
    try {

        // récupérer la carte 
        const card = await Card.findByPk(req.params.id, {
            include: 'tags'
        });

        // met à jour la carte en fonction de ce qui est passé en corps de requête
        await card.update(req.body);

        // renvoie la carte modifiée
        res.json(card);
    } catch (error) {
        catchError(error, res);
    }
}

exports.delete = async (req, res) => {
    try {
        // on récupère la carte à supprimer
        const card = await Card.findByPk(req.params.id);
        // on la supprime
        await card.destroy();
        // on renvoie la validation au client
        res.json({msg: "La carte a bien été supprimée."});
    } catch (error) {
        catchError(error, res);
    }
}

exports.addTagToCard = async (req, res) => {
    try {
         // récupérer la carte
        const card = await Card.findByPk(req.params.id, {
            include: 'tags'
        });
        // récupérer le tag
        const tag = await Tag.findByPk(req.body.tag_id);
        // associer le tag à la carte
        await card.addTag(tag);
        // on met à jour l'instance car sequelize ne le fait pas lors de l'utilisation d'un mixin
        card.tags.push(tag);
        // renvoyer le tag
        res.json(tag);
    } catch (error) {
        catchError(error, res);
    }
   
}

exports.removeTagFromCard = async (req, res) => {
    try {
        // récupérer la carte
        const card = await Card.findByPk(req.params.cardId, {
            include: 'tags'
        });
        // récupérer le tag
        const tag = await Tag.findByPk(req.params.tagId);
        // supprimer l'association entre le tag et la carte
        await card.removeTag(tag);
        // on met à jour l'instance de la carte car sequelize ne le fait pas lors de l'utilisation d'un mixin. On filtre sur les tags existants afin de retirer uniquement le tag qu'on souhaite supprimer
        const newTags = card.tags.filter(tag => tag.id !== req.params.tagId);
        console.log(newTags);
        card.tags = newTags;
        console.log(card.tags);
        
        // renvoyer la carte
        res.json(card);
       
   } catch (error) {
       catchError(error, res);
   }
}

