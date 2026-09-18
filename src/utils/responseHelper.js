/**
 * Auxiliar para padronizar respostas de sucesso da API.
 */
const successResponse = (res, statusCode = 200, message = 'Operação realizada com sucesso.', data = null, meta = null) => {
  const response = {
    success: true,
    message
  };

  if (data !== null) {
    response.data = data;
  }

  if (meta !== null) {
    response.meta = meta;
  }

  return res.status(statusCode).json(response);
};

/**
 * Auxiliar para padronizar respostas de erro da API.
 */
const errorResponse = (res, statusCode = 500, message = 'Ocorreu um erro interno no servidor.', errors = null) => {
  const response = {
    success: false,
    message
  };

  if (errors !== null) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

module.exports = {
  successResponse,
  errorResponse
};
