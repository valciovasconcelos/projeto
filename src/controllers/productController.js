const { Product, Category } = require('../models');
const { paginate } = require('../services/paginationService');
const { Op } = require('sequelize');

/**
 * Retorna todos os produtos de forma paginada com suas respectivas categorias,
 * suportando busca por nome, filtro por categoria, faixa de preço e ordenação.
 */
const getAllProducts = async (req, res) => {
  try {
    const { page, limit, search, categoryId, minPrice, maxPrice, sortBy = 'id', order = 'ASC' } = req.query;

    const where = {};

    if (search) {
      where.name = { [Op.like]: `%${search}%` };
    }

    if (categoryId) {
      where.categoryId = Number(categoryId);
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = Number(minPrice);
      if (maxPrice) where.price[Op.lte] = Number(maxPrice);
    }

    const validSortFields = ['id', 'name', 'price', 'createdAt'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'id';
    const sortOrder = order.toString().toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    const result = await paginate(Product, page, limit, {
      where,
      include: [{
        model: Category,
        as: 'category',
        attributes: ['id', 'name']
      }],
      order: [[sortField, sortOrder]]
    });
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Retorna um produto específico pelo ID, contendo suas informações de categoria.
 */
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id, {
      include: [{
        model: Category,
        as: 'category',
        attributes: ['id', 'name']
      }]
    });
    
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado.' });
    }
    
    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Cria um novo produto com validações de dados e de categoria.
 */
const createProduct = async (req, res) => {
  try {
    const { name, price, description, categoryId } = req.body;
    
    if (categoryId) {
      const categoryExists = await Category.findByPk(categoryId);
      if (!categoryExists) {
        return res.status(400).json({ error: 'A categoria informada não existe.' });
      }
    }

    const product = await Product.create({ name, price, description, categoryId });
    
    const productWithCategory = await Product.findByPk(product.id, {
      include: [{
        model: Category,
        as: 'category',
        attributes: ['id', 'name']
      }]
    });

    return res.status(201).json(productWithCategory);
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      const messages = error.errors.map(err => err.message);
      return res.status(400).json({ errors: messages });
    }
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Atualiza os campos de um produto existente, validando a categoria se fornecida.
 */
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description, categoryId } = req.body;
    
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado.' });
    }
    
    if (categoryId) {
      const categoryExists = await Category.findByPk(categoryId);
      if (!categoryExists) {
        return res.status(400).json({ error: 'A categoria informada não existe.' });
      }
    }

    await product.update({ name, price, description, categoryId });

    const productWithCategory = await Product.findByPk(product.id, {
      include: [{
        model: Category,
        as: 'category',
        attributes: ['id', 'name']
      }]
    });

    return res.status(200).json(productWithCategory);
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      const messages = error.errors.map(err => err.message);
      return res.status(400).json({ errors: messages });
    }
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Exclui um produto do banco de dados.
 */
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado.' });
    }
    
    await product.destroy();
    return res.status(200).json({ message: 'Produto removido com sucesso.' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
