const { Situation, User } = require('../models');

const getAllSituations = async (req, res) => {
  try {
    const situations = await Situation.findAll({
      include: [{
        model: User,
        as: 'users',
        attributes: ['id', 'name', 'email']
      }],
      order: [['id', 'ASC']]
    });
    return res.status(200).json(situations);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getSituationById = async (req, res) => {
  try {
    const { id } = req.params;
    const situation = await Situation.findByPk(id, {
      include: [{
        model: User,
        as: 'users',
        attributes: ['id', 'name', 'email']
      }]
    });

    if (!situation) {
      return res.status(404).json({ message: 'Situação não encontrada.' });
    }

    return res.status(200).json(situation);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const createSituation = async (req, res) => {
  try {
    const { nameSituation } = req.body;
    if (!nameSituation) {
      return res.status(400).json({ error: 'O campo nameSituation é obrigatório.' });
    }

    const situation = await Situation.create({ nameSituation });
    return res.status(201).json(situation);
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      const messages = error.errors.map(err => err.message);
      return res.status(400).json({ errors: messages });
    }
    return res.status(500).json({ error: error.message });
  }
};

const updateSituation = async (req, res) => {
  try {
    const { id } = req.params;
    const { nameSituation } = req.body;

    const situation = await Situation.findByPk(id);
    if (!situation) {
      return res.status(404).json({ message: 'Situação não encontrada.' });
    }

    await situation.update({ nameSituation });
    return res.status(200).json(situation);
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      const messages = error.errors.map(err => err.message);
      return res.status(400).json({ errors: messages });
    }
    return res.status(500).json({ error: error.message });
  }
};

const deleteSituation = async (req, res) => {
  try {
    const { id } = req.params;
    const situation = await Situation.findByPk(id);

    if (!situation) {
      return res.status(404).json({ message: 'Situação não encontrada.' });
    }

    const linkedUsersCount = await User.count({ where: { situationId: id } });
    if (linkedUsersCount > 0) {
      return res.status(400).json({
        error: 'Não é possível remover uma situação vinculada a usuários cadastrados.'
      });
    }

    await situation.destroy();
    return res.status(200).json({ message: 'Situação removida com sucesso.' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllSituations,
  getSituationById,
  createSituation,
  updateSituation,
  deleteSituation
};
