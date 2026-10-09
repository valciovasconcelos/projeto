const { ProductCategory, Product } = require('../models');

const getAllProductCategories = async (req, res) => {
  try {
    const categories = await ProductCategory.findAll({
      include: [{
        model: Product,
        as: 'products',
        attributes: ['id', 'name']
      }],
      order: [['id', 'ASC']]
    });
    return res.status(200).json(categories);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getProductCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await ProductCategory.findByPk(id, {
      include: [{
        model: Product,
        as: 'products',
        attributes: ['id', 'name']
      }]
    });

    if (!category) {
      return res.status(404).json({ message: 'Categoria de produto não encontrada.' });
    }

    return res.status(200).json(category);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const createProductCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'O campo name é obrigatório.' });
    }

    const category = await ProductCategory.create({ name });
    return res.status(201).json(category);
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      const messages = error.errors.map(err => err.message);
      return res.status(400).json({ errors: messages });
    }
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'Já existe uma categoria de produto com este nome.' });
    }
    return res.status(500).json({ error: error.message });
  }
};

const updateProductCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const category = await ProductCategory.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: 'Categoria de produto não encontrada.' });
    }

    await category.update({ name });
    return res.status(200).json(category);
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      const messages = error.errors.map(err => err.message);
      return res.status(400).json({ errors: messages });
    }
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'Já existe uma categoria de produto com este nome.' });
    }
    return res.status(500).json({ error: error.message });
  }
};

const deleteProductCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await ProductCategory.findByPk(id);

    if (!category) {
      return res.status(404).json({ message: 'Categoria de produto não encontrada.' });
    }

    const linkedProductsCount = await Product.count({ where: { productCategoryId: id } });
    if (linkedProductsCount > 0) {
      return res.status(400).json({
        error: 'Não é possível remover uma categoria de produto vinculada a produtos cadastrados.'
      });
    }

    await category.destroy();
    return res.status(200).json({ message: 'Categoria de produto removida com sucesso.' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllProductCategories,
  getProductCategoryById,
  createProductCategory,
  updateProductCategory,
  deleteProductCategory
};
