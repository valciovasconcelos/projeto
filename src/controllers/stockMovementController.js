const { StockMovement, Product, sequelize } = require('../models');
const { paginate } = require('../services/paginationService');
const { Op } = require('sequelize');

/**
 * Cria uma nova movimentação de estoque (Entrada ou Saída) e atualiza o saldo do produto.
 */
const createStockMovement = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { productId, type, quantity, reason } = req.body;
    const upperType = String(type).toUpperCase();
    const movementQty = Number(quantity);

    const product = await Product.findByPk(productId, { transaction });
    if (!product) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Produto informado não existe.' });
    }

    if (upperType === 'OUT' && product.quantity < movementQty) {
      await transaction.rollback();
      return res.status(400).json({
        error: `Estoque insuficiente. Saldo atual do produto: ${product.quantity}, tentativa de saída: ${movementQty}.`
      });
    }

    const newQuantity = upperType === 'IN'
      ? product.quantity + movementQty
      : product.quantity - movementQty;

    await product.update({ quantity: newQuantity }, { transaction });

    const movement = await StockMovement.create({
      productId: Number(productId),
      type: upperType,
      quantity: movementQty,
      reason: reason ? String(reason).trim() : null
    }, { transaction });

    await transaction.commit();

    const createdMovement = await StockMovement.findByPk(movement.id, {
      include: [{
        model: Product,
        as: 'product',
        attributes: ['id', 'name', 'price', 'quantity']
      }]
    });

    return res.status(201).json({
      message: `Movimentação de ${upperType === 'IN' ? 'entrada' : 'saída'} realizada com sucesso.`,
      movement: createdMovement
    });
  } catch (error) {
    await transaction.rollback();
    if (error.name === 'SequelizeValidationError') {
      const messages = error.errors.map(err => err.message);
      return res.status(400).json({ errors: messages });
    }
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Retorna todas as movimentações de estoque de forma paginada e filtrável.
 */
const getAllStockMovements = async (req, res) => {
  try {
    const { page, limit, productId, type } = req.query;
    const where = {};

    if (productId) {
      where.productId = Number(productId);
    }

    if (type && ['IN', 'OUT'].includes(type.toUpperCase())) {
      where.type = type.toUpperCase();
    }

    const result = await paginate(StockMovement, page, limit, {
      where,
      include: [{
        model: Product,
        as: 'product',
        attributes: ['id', 'name', 'price', 'quantity']
      }],
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Retorna o histórico de movimentações de um produto específico.
 */
const getStockMovementsByProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { page, limit } = req.query;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado.' });
    }

    const result = await paginate(StockMovement, page, limit, {
      where: { productId: Number(id) },
      include: [{
        model: Product,
        as: 'product',
        attributes: ['id', 'name', 'price', 'quantity']
      }],
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createStockMovement,
  getAllStockMovements,
  getStockMovementsByProduct
};
