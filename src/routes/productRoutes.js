const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const validateId = require('../middlewares/validateId');

// Endpoints do CRUD de Produtos
router.get('/', productController.getAllProducts);
router.get('/:id', validateId, productController.getProductById);
router.post('/', productController.createProduct);
router.put('/:id', validateId, productController.updateProduct);
router.delete('/:id', validateId, productController.deleteProduct);

module.exports = router;
