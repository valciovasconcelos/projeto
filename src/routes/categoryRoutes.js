const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const validateId = require('../middlewares/validateId');
const { validateCategoryBody } = require('../middlewares/bodyValidation');

// Endpoints do CRUD e Estatísticas de Categorias
router.get('/', categoryController.getAllCategories);
router.get('/stats', categoryController.getCategoryStats);
router.get('/:id', validateId, categoryController.getCategoryById);
router.post('/', validateCategoryBody, categoryController.createCategory);
router.put('/:id', validateId, validateCategoryBody, categoryController.updateCategory);
router.delete('/:id', validateId, categoryController.deleteCategory);

module.exports = router;

