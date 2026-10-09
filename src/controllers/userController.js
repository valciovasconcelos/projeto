const { User, Situation } = require('../models');

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      include: [{
        model: Situation,
        as: 'situation',
        attributes: ['id', 'nameSituation']
      }],
      order: [['id', 'ASC']]
    });
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      include: [{
        model: Situation,
        as: 'situation',
        attributes: ['id', 'nameSituation']
      }]
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, situationId } = req.body;

    if (situationId) {
      const situationExists = await Situation.findByPk(situationId);
      if (!situationExists) {
        return res.status(400).json({ error: 'A situação informada não existe.' });
      }
    }

    const user = await User.create({ name, email, situationId });

    const userWithSituation = await User.findByPk(user.id, {
      include: [{
        model: Situation,
        as: 'situation',
        attributes: ['id', 'nameSituation']
      }]
    });

    return res.status(201).json(userWithSituation);
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      const messages = error.errors.map(err => err.message);
      return res.status(400).json({ errors: messages });
    }
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'Este e-mail já está em uso.' });
    }
    return res.status(500).json({ error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, situationId } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    if (situationId) {
      const situationExists = await Situation.findByPk(situationId);
      if (!situationExists) {
        return res.status(400).json({ error: 'A situação informada não existe.' });
      }
    }

    await user.update({ name, email, situationId });

    const updatedUser = await User.findByPk(user.id, {
      include: [{
        model: Situation,
        as: 'situation',
        attributes: ['id', 'nameSituation']
      }]
    });

    return res.status(200).json(updatedUser);
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      const messages = error.errors.map(err => err.message);
      return res.status(400).json({ errors: messages });
    }
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'Este e-mail já está em uso por outro usuário.' });
    }
    return res.status(500).json({ error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    await user.destroy();
    return res.status(200).json({ message: 'Usuário removido com sucesso.' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};
