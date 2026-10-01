const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const validateId = require('../middlewares/validateId');
const { validateProductBody } = require('../middlewares/bodyValidation');

// Endpoints do CRUD, Alertas e Estatísticas de Produtos
router.get('/', productController.getAllProducts);
router.get('/stats', productController.getProductStats);
router.get('/low-stock', productController.getLowStockProducts);
router.get('/:id', validateId, productController.getProductById);
router.post('/', validateProductBody, productController.createProduct);
router.put('/:id', validateId, validateProductBody, productController.updateProduct);
router.delete('/:id', validateId, productController.deleteProduct);

module.exports = router;

