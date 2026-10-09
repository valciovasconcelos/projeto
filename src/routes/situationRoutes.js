const express = require('express');
const router = express.Router();
const situationController = require('../controllers/situationController');

router.get('/', situationController.getAllSituations);
router.get('/:id', situationController.getSituationById);
router.post('/', situationController.createSituation);
router.put('/:id', situationController.updateSituation);
router.delete('/:id', situationController.deleteSituation);

module.exports = router;
