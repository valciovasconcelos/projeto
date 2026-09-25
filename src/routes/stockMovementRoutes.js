const express = require('express');
const router = express.Router();
const stockMovementController = require('../controllers/stockMovementController');
const validateId = require('../middlewares/validateId');
const { validateStockMovementBody } = require('../middlewares/bodyValidation');

// Endpoints de Movimentação de Estoque
router.get('/', stockMovementController.getAllStockMovements);
router.post('/', validateStockMovementBody, stockMovementController.createStockMovement);
router.get('/product/:id', validateId, stockMovementController.getStockMovementsByProduct);

module.exports = router;
