/**
 * Middleware para validar se o parâmetro ID na URL é um número inteiro válido.
 */
const validateId = (req, res, next) => {
  const { id } = req.params;
  const parsedId = Number(id);

  if (!Number.isInteger(parsedId) || parsedId <= 0) {
    return res.status(400).json({ 
      error: 'O parâmetro ID deve ser um número inteiro positivo válido.' 
    });
  }

  next();
};

module.exports = validateId;
