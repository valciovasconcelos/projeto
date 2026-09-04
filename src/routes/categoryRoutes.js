const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const validateId = require('../middlewares/validateId');

// Endpoints do CRUD de Categorias
router.get('/', categoryController.getAllCategories);
router.get('/:id', validateId, categoryController.getCategoryById);
router.post('/', categoryController.createCategory);
router.put('/:id', validateId, categoryController.updateCategory);
router.delete('/:id', validateId, categoryController.deleteCategory);

module.exports = router;
