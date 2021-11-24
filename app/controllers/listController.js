// on importe le model de list pour pouvoir ensuite manipuler nos listes via notre application (crud)
const { List } = require('../models');
const { catchError } = require('../utils');

// on factorise l'objet de config qui précise les associations à récupérer, car il est utilisé deux fois dans ce fichier lors des appels à findAll et findByPk
const listConfig = {
    include: {
        association: 'cards',
        include: 'tags'
    },
    order: [
        ['position', 'ASC'],
        ['cards', 'position', 'ASC']
    ]
}

const listController = {
    getAll: async (req, res) => {
        try {
            // Récupère toutes les listes
            const lists = await List.findAll(listConfig);
            // elle les renvoie au format json 
            res.json(lists);
        } catch(error) {
            catchError(error, res);
        } 
    },
    getOne: async (req, res) => {
        try {
            // on récupère l'id de la route
            const listId = req.params.id;
            // récupère la liste qui correspond à l'id de la route
            const list = await List.findByPk(listId, listConfig);
            // renvoie la liste
            res.json(list);
        } catch(error) {
            catchError(error, res);
        } 
    },
    create: async (req, res) => {
        try {
            // créer la liste en base
            const list = await List.create(req.body);
            // renvoyer la liste créée
            res.json(list);
        } catch(error) {
            catchError(error, res);
        }
    },
    update: async (req, res) => {
        try {
            // récupérer la liste
            const list = await List.findByPk(req.params.id);
            // appeler la méthode d'instance pour modifier les informations de la liste
            const listUpdated = await list.update(req.body);

            /*METHODE STATIQUE :
            const nb = await List.update(req.body, {
                where: {
                    id: req.params.id
                }
            })*/

            // renvoyer la liste modifiée
            res.json(listUpdated);
        
        // renverra la liste modifiée
        } catch(error) {
            catchError(error, res);
        }
        
    },
    delete: async (req, res) => {
        try {
            // récupérer la liste
            const list = await List.findByPk(req.params.id);
            // supprimer la liste
            await list.destroy();
            // renvoyer une information ok
            res.json({msg: "La liste a bien été supprimée"});
        } catch(error) {
            catchError(error, res);
        }  
    }
}

module.exports = listController;