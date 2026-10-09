const { ProductSituation, Product } = require('../models');

const getAllProductSituations = async (req, res) => {
  try {
    const situations = await ProductSituation.findAll({
      include: [{
        model: Product,
        as: 'products',
        attributes: ['id', 'name']
      }],
      order: [['id', 'ASC']]
    });
    return res.status(200).json(situations);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getProductSituationById = async (req, res) => {
  try {
    const { id } = req.params;
    const situation = await ProductSituation.findByPk(id, {
      include: [{
        model: Product,
        as: 'products',
        attributes: ['id', 'name']
      }]
    });

    if (!situation) {
      return res.status(404).json({ message: 'Situação de produto não encontrada.' });
    }

    return res.status(200).json(situation);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const createProductSituation = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'O campo name é obrigatório.' });
    }

    const situation = await ProductSituation.create({ name });
    return res.status(201).json(situation);
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      const messages = error.errors.map(err => err.message);
      return res.status(400).json({ errors: messages });
    }
    return res.status(500).json({ error: error.message });
  }
};

const updateProductSituation = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const situation = await ProductSituation.findByPk(id);
    if (!situation) {
      return res.status(404).json({ message: 'Situação de produto não encontrada.' });
    }

    await situation.update({ name });
    return res.status(200).json(situation);
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      const messages = error.errors.map(err => err.message);
      return res.status(400).json({ errors: messages });
    }
    return res.status(500).json({ error: error.message });
  }
};

const deleteProductSituation = async (req, res) => {
  try {
    const { id } = req.params;
    const situation = await ProductSituation.findByPk(id);

    if (!situation) {
      return res.status(404).json({ message: 'Situação de produto não encontrada.' });
    }

    const linkedProductsCount = await Product.count({ where: { productSituationId: id } });
    if (linkedProductsCount > 0) {
      return res.status(400).json({
        error: 'Não é possível remover uma situação de produto vinculada a produtos cadastrados.'
      });
    }

    await situation.destroy();
    return res.status(200).json({ message: 'Situação de produto removida com sucesso.' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllProductSituations,
  getProductSituationById,
  createProductSituation,
  updateProductSituation,
  deleteProductSituation
};
