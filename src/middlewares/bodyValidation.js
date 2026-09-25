/**
 * Middleware para validação dos dados de envio (body) de Produtos.
 */
const validateProductBody = (req, res, next) => {
  const { name, price } = req.body;
  const errors = [];

  if (req.method === 'POST') {
    if (!name || typeof name !== 'string' || name.trim() === '') {
      errors.push('O campo "name" é obrigatório e não pode ser vazio.');
    }
    if (price === undefined || price === null || isNaN(Number(price))) {
      errors.push('O campo "price" é obrigatório e deve ser um número válido.');
    } else if (Number(price) < 0) {
      errors.push('O preço não pode ser menor que zero.');
    }
  } else if (req.method === 'PUT') {
    if (name !== undefined && (typeof name !== 'string' || name.trim() === '')) {
      errors.push('O campo "name" não pode ser vazio.');
    }
    if (price !== undefined && (isNaN(Number(price)) || Number(price) < 0)) {
      errors.push('O preço deve ser um número válido maior ou igual a zero.');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

/**
 * Middleware para validação dos dados de envio (body) de Categorias.
 */
const validateCategoryBody = (req, res, next) => {
  const { name } = req.body;
  const errors = [];

  if (req.method === 'POST') {
    if (!name || typeof name !== 'string' || name.trim() === '') {
      errors.push('O campo "name" da categoria é obrigatório e não pode ser vazio.');
    }
  } else if (req.method === 'PUT') {
    if (name !== undefined && (typeof name !== 'string' || name.trim() === '')) {
      errors.push('O campo "name" da categoria não pode ser vazio.');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

/**
 * Middleware para validação dos dados de envio (body) de Movimentações de Estoque.
 */
const validateStockMovementBody = (req, res, next) => {
  const { productId, type, quantity } = req.body;
  const errors = [];

  if (!productId || isNaN(Number(productId)) || Number(productId) <= 0) {
    errors.push('O campo "productId" é obrigatório e deve ser um ID válido.');
  }

  if (!type || !['IN', 'OUT'].includes(String(type).toUpperCase())) {
    errors.push('O campo "type" é obrigatório e deve ser "IN" ou "OUT".');
  }

  if (quantity === undefined || quantity === null || isNaN(Number(quantity)) || !Number.isInteger(Number(quantity))) {
    errors.push('O campo "quantity" é obrigatório e deve ser um número inteiro.');
  } else if (Number(quantity) <= 0) {
    errors.push('A quantidade movimentada deve ser maior que zero.');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

module.exports = {
  validateProductBody,
  validateCategoryBody,
  validateStockMovementBody
};

