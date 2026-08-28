const { Category, Product } = require('../models');
const { paginate } = require('../services/paginationService');

/**
 * Retorna todas as categorias de forma paginada.
 */
const getAllCategories = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const result = await paginate(Category, page, limit, {
      order: [['id', 'ASC']]
    });
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Retorna uma categoria específica pelo ID, incluindo seus produtos.
 */
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id, {
      include: [{
        model: Product,
        as: 'products',
        attributes: ['id', 'name', 'price', 'description']
      }]
    });
    
    if (!category) {
      return res.status(404).json({ message: 'Categoria não encontrada.' });
    }
    
    return res.status(200).json(category);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Cria uma nova categoria com validações.
 */
const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await Category.create({ name });
    return res.status(201).json(category);
  } catch (error) {
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const messages = error.errors.map(err => err.message);
      return res.status(400).json({ errors: messages });
    }
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Atualiza os campos de uma categoria existente.
 */
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: 'Categoria não encontrada.' });
    }
    
    await category.update({ name });
    return res.status(200).json(category);
  } catch (error) {
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const messages = error.errors.map(err => err.message);
      return res.status(400).json({ errors: messages });
    }
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Exclui uma categoria do banco de dados.
 */
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);
    
    if (!category) {
      return res.status(404).json({ message: 'Categoria não encontrada.' });
    }
    
    // Verifica se existem produtos associados antes de deletar
    const productsCount = await Product.count({ where: { categoryId: id } });
    if (productsCount > 0) {
      return res.status(400).json({ 
        message: 'Não é possível remover uma categoria que possui produtos vinculados.' 
      });
    }
    
    await category.destroy();
    return res.status(200).json({ message: 'Categoria removida com sucesso.' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};
