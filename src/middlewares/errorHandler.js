/**
 * Middleware para tratamento centralizado de erros na aplicação Express.
 */
const errorHandler = (err, req, res, next) => {
  console.error(`[Error Handler] ${err.stack || err.message}`);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Erro interno no servidor.';

  return res.status(statusCode).json({
    error: message
  });
};

module.exports = errorHandler;
