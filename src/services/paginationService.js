/**
 * Pagina uma query no banco de dados através do Sequelize.
 * 
 * @param {Object} model - O Model do Sequelize que será consultado.
 * @param {number} [page=1] - A página que está sendo solicitada (padrão is 1).
 * @param {number} [limit=10] - A quantidade de registros por página (padrão is 10).
 * @param {Object} [options={}] - Configurações extras de query (where, include, order, etc.).
 * @returns {Promise<Object>} Um objeto contendo os dados paginados e metadados de paginação.
 */
const paginate = async (model, page = 1, limit = 10, options = {}) => {
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.max(1, parseInt(limit, 10) || 10);
  
  const offset = (pageNum - 1) * limitNum;
  
  const queryOptions = {
    ...options,
    limit: limitNum,
    offset: offset
  };

  // findAndCountAll busca o total de linhas e as linhas limitadas/offsetadas
  const { count, rows } = await model.findAndCountAll(queryOptions);
  const totalPages = Math.ceil(count / limitNum);
  
  return {
    data: rows,
    pagination: {
      totalItems: count,
      totalPages: totalPages,
      currentPage: pageNum,
      limit: limitNum,
      hasNextPage: pageNum < totalPages,
      hasPrevPage: pageNum > 1
    }
  };
};

module.exports = {
  paginate
};
