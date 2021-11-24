const { Router } = require('express');
const router = Router();

// on importe nos controllers
// const listController = require('./controllers/listController');
const listController = require('./controllers/listController');
const cardController = require('./controllers/cardController');
const tagController = require('./controllers/tagController');

// API REST

// LISTS

router.route('/lists')
.get(listController.getAll)
.post(listController.create);
router.route('/lists/:id')
.get(listController.getOne)
.patch(listController.update)
.delete(listController.delete);


// /lists

/*
router.get('/lists', listController.getLists);
router.post('/lists', listController.addList);
router.get('/lists/:id', listController.getList);
router.patch('/lists/:id', listController.updateList);
router.delete('/lists/:id', listController.deleteList);*/

// CARDS


router.route('/cards')
.post(cardController.create);
router.route('/cards/:id')
.get(cardController.getOne)
.patch(cardController.update)
.delete(cardController.delete);

// routes pour associer et dissocier un tag d'une carte

router.post('/cards/:id/tags', cardController.addTagToCard);
router.delete('/cards/:cardId/tags/:tagId', cardController.removeTagFromCard);


// TAGS

router.route('/tags')
.get(tagController.getAll)
.post(tagController.create);
router.route('/tags/:id')
.get(tagController.getOne)
.patch(tagController.update)
.delete(tagController.delete);


module.exports = router;