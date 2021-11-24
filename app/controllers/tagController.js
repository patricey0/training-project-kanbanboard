const { Tag } = require('../models');
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
        if(!req.body.name) return res.status(400).json({error: "Veuillez renseigner un nom pour le tag !"});
        // créer la carte dans la base
        const tag = await Tag.create(req.body);
        // renvoyer la nouvelle carte
        res.json(tag);
    } catch (error) {
        catchError(error, res);
    }
}

exports.getAll = async (req, res) => {
    try {
        // récupérer la carte avec ses tags
        const tags = await Tag.findAll();
        // renvoyer la réponse au client
        res.json(tags);
    } catch (error) {
        catchError(error, res);
    }
}

exports.getOne = async (req, res) => {
    try {
        // récupérer la carte avec ses tags
        const tag = await Tag.findByPk(req.params.id);
        
        // renvoyer la réponse au client
        res.json(tag);
    } catch (error) {
        catchError(error, res);
    }
}

exports.update = async (req, res) => {
    try {
        // récupérer la carte 
        const tag = await Tag.findByPk(req.params.id);

        // met à jour la carte en fonction de ce qui est passé en corps de requête
        await tag.update(req.body);

        // renvoie la carte modifiée
        res.json(tag);
    } catch (error) {
        catchError(error, res);
    }
}

exports.delete = async (req, res) => {
    try {
        // on récupère la carte à supprimer
        const tag = await Tag.findByPk(req.params.id);
        // on la supprime
        await tag.destroy();
        // on renvoie la validation au client
        res.json({msg: "Le tag a bien été supprimé."});
    } catch (error) {
        catchError(error, res);
    }
}


