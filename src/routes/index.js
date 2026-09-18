const express = require('express');
const router = express.Router();
const productRoutes = require('./productRoutes');
const categoryRoutes = require('./categoryRoutes');
const { sequelize } = require('../models');

// Rotas da API
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);

// Rota de Documentação de Endpoints
router.get('/docs', (req, res) => {
  res.status(200).json({
    name: 'NodeJS Express API P1',
    version: '1.0.0',
    description: 'Documentação dos endpoints da API',
    endpoints: [
      { method: 'GET', path: '/api/health', description: 'Verifica saúde da API e status do banco de dados' },
      { method: 'GET', path: '/api/docs', description: 'Retorna a lista de rotas e documentação sintética' },
      { method: 'GET', path: '/api/products', description: 'Lista produtos paginados com filtros (search, categoryId, minPrice, maxPrice, sortBy, order)' },
      { method: 'GET', path: '/api/products/stats', description: 'Estatísticas agregadas de produtos e valor total do estoque' },
      { method: 'GET', path: '/api/products/:id', description: 'Busca produto por ID' },
      { method: 'POST', path: '/api/products', description: 'Cria novo produto' },
      { method: 'PUT', path: '/api/products/:id', description: 'Atualiza produto existente' },
      { method: 'DELETE', path: '/api/products/:id', description: 'Remove produto pelo ID' },
      { method: 'GET', path: '/api/categories', description: 'Lista categorias paginadas com busca' },
      { method: 'GET', path: '/api/categories/stats', description: 'Estatísticas agregadas das categorias' },
      { method: 'GET', path: '/api/categories/:id', description: 'Busca categoria por ID com seus produtos vinculados' },
      { method: 'POST', path: '/api/categories', description: 'Cria nova categoria' },
      { method: 'PUT', path: '/api/categories/:id', description: 'Atualiza categoria existente' },
      { method: 'DELETE', path: '/api/categories/:id', description: 'Remove categoria (caso não possua produtos vinculados)' }
    ]
  });
});

// Rota de Health Check (Verificação de Integridade e Conectividade do Banco)
router.get('/health', async (req, res) => {
  let dbStatus = 'DISCONNECTED';
  try {
    await sequelize.authenticate();
    dbStatus = 'CONNECTED';
  } catch (error) {
    dbStatus = `ERROR: ${error.message}`;
  }

  res.status(200).json({
    status: dbStatus === 'CONNECTED' ? 'UP' : 'DEGRADED',
    timestamp: new Date(),
    uptimeSeconds: Math.floor(process.uptime()),
    database: {
      status: dbStatus,
      dialect: sequelize.getDialect()
    },
    service: 'NodeJS Express API P1'
  });
});

module.exports = router;

