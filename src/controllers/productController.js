const { Product, Category, ProductCategory, ProductSituation } = require('../models');
const { paginate } = require('../services/paginationService');
const { Op } = require('sequelize');

/**
 * Retorna todos os produtos de forma paginada com suas respectivas categorias e situações,
 * suportando busca por nome, filtro por categoria, faixa de preço e ordenação.
 */
const getAllProducts = async (req, res) => {
  try {
    const { page, limit, search, categoryId, productCategoryId, productSituationId, minPrice, maxPrice, sortBy = 'id', order = 'ASC' } = req.query;

    const where = {};

    if (search) {
      where.name = { [Op.like]: `%${search}%` };
    }

    if (categoryId) {
      where.categoryId = Number(categoryId);
    }

    if (productCategoryId) {
      where.productCategoryId = Number(productCategoryId);
    }

    if (productSituationId) {
      where.productSituationId = Number(productSituationId);
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = Number(minPrice);
      if (maxPrice) where.price[Op.lte] = Number(maxPrice);
    }

    const validSortFields = ['id', 'name', 'price', 'createdAt'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'id';
    const sortOrder = order.toString().toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    const includeModels = [];
    if (ProductSituation) {
      includeModels.push({
        model: ProductSituation,
        as: 'productSituation',
        attributes: ['id', 'name']
      });
    }
    if (ProductCategory) {
      includeModels.push({
        model: ProductCategory,
        as: 'productCategory',
        attributes: ['id', 'name']
      });
    }
    if (Category) {
      includeModels.push({
        model: Category,
        as: 'category',
        attributes: ['id', 'name']
      });
    }

    const result = await paginate(Product, page, limit, {
      where,
      include: includeModels,
      order: [[sortField, sortOrder]]
    });
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Retorna um produto específico pelo ID.
 */
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const includeModels = [];
    if (ProductSituation) {
      includeModels.push({
        model: ProductSituation,
        as: 'productSituation',
        attributes: ['id', 'name']
      });
    }
    if (ProductCategory) {
      includeModels.push({
        model: ProductCategory,
        as: 'productCategory',
        attributes: ['id', 'name']
      });
    }
    if (Category) {
      includeModels.push({
        model: Category,
        as: 'category',
        attributes: ['id', 'name']
      });
    }

    const product = await Product.findByPk(id, {
      include: includeModels
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
 * Cria um novo produto com validações de dados, categoria e situação.
 */
const createProduct = async (req, res) => {
  try {
    const { name, price, description, categoryId, productCategoryId, productSituationId, quantity } = req.body;
    
    if (productCategoryId) {
      const pCatExists = await ProductCategory.findByPk(productCategoryId);
      if (!pCatExists) {
        return res.status(400).json({ error: 'A categoria de produto informada não existe.' });
      }
    }

    if (productSituationId) {
      const pSitExists = await ProductSituation.findByPk(productSituationId);
      if (!pSitExists) {
        return res.status(400).json({ error: 'A situação de produto informada não existe.' });
      }
    }

    if (categoryId && Category) {
      const catExists = await Category.findByPk(categoryId);
      if (!catExists) {
        return res.status(400).json({ error: 'A categoria informada não existe.' });
      }
    }

    const initialQuantity = quantity !== undefined && !isNaN(Number(quantity)) && Number(quantity) >= 0
      ? Number(quantity)
      : 0;

    const product = await Product.create({
      name,
      price: price || 0,
      description,
      categoryId: categoryId || null,
      productCategoryId: productCategoryId || categoryId || null,
      productSituationId: productSituationId || null,
      quantity: initialQuantity
    });
    
    const includeModels = [];
    if (ProductSituation) includeModels.push({ model: ProductSituation, as: 'productSituation', attributes: ['id', 'name'] });
    if (ProductCategory) includeModels.push({ model: ProductCategory, as: 'productCategory', attributes: ['id', 'name'] });
    if (Category) includeModels.push({ model: Category, as: 'category', attributes: ['id', 'name'] });

    const productWithRelations = await Product.findByPk(product.id, {
      include: includeModels
    });

    return res.status(201).json(productWithRelations);
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      const messages = error.errors.map(err => err.message);
      return res.status(400).json({ errors: messages });
    }
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Atualiza os campos de um produto existente.
 */
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description, categoryId, productCategoryId, productSituationId, quantity } = req.body;
    
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado.' });
    }
    
    if (productCategoryId) {
      const pCatExists = await ProductCategory.findByPk(productCategoryId);
      if (!pCatExists) {
        return res.status(400).json({ error: 'A categoria de produto informada não existe.' });
      }
    }

    if (productSituationId) {
      const pSitExists = await ProductSituation.findByPk(productSituationId);
      if (!pSitExists) {
        return res.status(400).json({ error: 'A situação de produto informada não existe.' });
      }
    }

    const updateData = {
      ...(name !== undefined && { name }),
      ...(price !== undefined && { price }),
      ...(description !== undefined && { description }),
      ...(categoryId !== undefined && { categoryId }),
      ...(productCategoryId !== undefined && { productCategoryId }),
      ...(productSituationId !== undefined && { productSituationId })
    };

    if (quantity !== undefined && !isNaN(Number(quantity)) && Number(quantity) >= 0) {
      updateData.quantity = Number(quantity);
    }

    await product.update(updateData);

    const includeModels = [];
    if (ProductSituation) includeModels.push({ model: ProductSituation, as: 'productSituation', attributes: ['id', 'name'] });
    if (ProductCategory) includeModels.push({ model: ProductCategory, as: 'productCategory', attributes: ['id', 'name'] });
    if (Category) includeModels.push({ model: Category, as: 'category', attributes: ['id', 'name'] });

    const updatedProduct = await Product.findByPk(product.id, {
      include: includeModels
    });

    return res.status(200).json(updatedProduct);
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

/**
 * Retorna estatísticas consolidadas dos produtos e estoque.
 */
const getProductStats = async (req, res) => {
  try {
    const totalProducts = await Product.count();
    const minPrice = (await Product.min('price')) || 0;
    const maxPrice = (await Product.max('price')) || 0;
    const sumPrice = (await Product.sum('price')) || 0;
    const avgPrice = totalProducts > 0 ? (sumPrice / totalProducts).toFixed(2) : 0;
    const totalQuantityInStock = (await Product.sum('quantity')) || 0;
    const lowStockAlertsCount = await Product.count({
      where: {
        quantity: { [Op.lte]: 5 }
      }
    });

    const allProducts = await Product.findAll({ attributes: ['price', 'quantity'] });
    const totalStockValue = allProducts.reduce((sum, p) => sum + (Number(p.price || 0) * Number(p.quantity || 0)), 0);

    return res.status(200).json({
      totalProducts,
      totalQuantityInStock,
      totalInventoryValue: parseFloat(totalStockValue.toFixed(2)),
      averagePrice: parseFloat(avgPrice),
      minPrice: parseFloat(Number(minPrice).toFixed(2)),
      maxPrice: parseFloat(Number(maxPrice).toFixed(2)),
      lowStockAlertsCount
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Retorna produtos em baixo estoque.
 */
const getLowStockProducts = async (req, res) => {
  try {
    const threshold = req.query.threshold !== undefined && !isNaN(Number(req.query.threshold))
      ? Math.max(0, Number(req.query.threshold))
      : 5;

    const products = await Product.findAll({
      where: {
        quantity: { [Op.lte]: threshold }
      },
      order: [['quantity', 'ASC']]
    });

    return res.status(200).json({
      thresholdUsed: threshold,
      totalLowStockItems: products.length,
      products
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductStats,
  getLowStockProducts
};
