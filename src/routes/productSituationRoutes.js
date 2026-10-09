const express = require('express');
const router = express.Router();
const productSituationController = require('../controllers/productSituationController');

router.get('/', productSituationController.getAllProductSituations);
router.get('/:id', productSituationController.getProductSituationById);
router.post('/', productSituationController.createProductSituation);
router.put('/:id', productSituationController.updateProductSituation);
router.delete('/:id', productSituationController.deleteProductSituation);

module.exports = router;
