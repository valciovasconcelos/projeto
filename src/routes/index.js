const express = require('express');
const router = express.Router();
const productRoutes = require('./productRoutes');
const categoryRoutes = require('./categoryRoutes');
const stockMovementRoutes = require('./stockMovementRoutes');
const situationRoutes = require('./situationRoutes');
const userRoutes = require('./userRoutes');
const productSituationRoutes = require('./productSituationRoutes');
const productCategoryRoutes = require('./productCategoryRoutes');
const { sequelize } = require('../models');

// Rotas da API
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/stock-movements', stockMovementRoutes);
router.use('/situations', situationRoutes);
router.use('/users', userRoutes);
router.use('/product-situations', productSituationRoutes);
router.use('/product-categories', productCategoryRoutes);

// Rota de Documentação de Endpoints
router.get('/docs', (req, res) => {
  res.status(200).json({
    name: 'NodeJS Express API - Projeto Engenharia de Software',
    version: '2.0.0',
    description: 'API completa atendendo ao Diagrama ER (Users, Situations, Product Situations, Product Categories, Products)',
    endpoints: [
      { method: 'GET', path: '/api/health', description: 'Status de integridade da API e conectividade com banco' },
      { method: 'GET', path: '/api/docs', description: 'Documentação sintética das rotas' },

      // Situations
      { method: 'GET', path: '/api/situations', description: 'Lista todas as situações de usuários com seus usuários vinculados' },
      { method: 'GET', path: '/api/situations/:id', description: 'Busca situação por ID' },
      { method: 'POST', path: '/api/situations', description: 'Cria nova situação (nameSituation)' },
      { method: 'PUT', path: '/api/situations/:id', description: 'Atualiza situação existente' },
      { method: 'DELETE', path: '/api/situations/:id', description: 'Remove situação pelo ID' },

      // Users
      { method: 'GET', path: '/api/users', description: 'Lista todos os usuários com suas situações' },
      { method: 'GET', path: '/api/users/:id', description: 'Busca usuário por ID' },
      { method: 'POST', path: '/api/users', description: 'Cria novo usuário (name, email, situationId)' },
      { method: 'PUT', path: '/api/users/:id', description: 'Atualiza usuário por ID' },
      { method: 'DELETE', path: '/api/users/:id', description: 'Remove usuário pelo ID' },

      // Product Situations
      { method: 'GET', path: '/api/product-situations', description: 'Lista todas as situações de produtos com seus produtos' },
      { method: 'GET', path: '/api/product-situations/:id', description: 'Busca situação de produto por ID' },
      { method: 'POST', path: '/api/product-situations', description: 'Cria nova situação de produto (name)' },
      { method: 'PUT', path: '/api/product-situations/:id', description: 'Atualiza situação de produto' },
      { method: 'DELETE', path: '/api/product-situations/:id', description: 'Remove situação de produto' },

      // Product Categories
      { method: 'GET', path: '/api/product-categories', description: 'Lista todas as categorias de produtos com seus produtos' },
      { method: 'GET', path: '/api/product-categories/:id', description: 'Busca categoria de produto por ID' },
      { method: 'POST', path: '/api/product-categories', description: 'Cria nova categoria de produto (name)' },
      { method: 'PUT', path: '/api/product-categories/:id', description: 'Atualiza categoria de produto' },
      { method: 'DELETE', path: '/api/product-categories/:id', description: 'Remove categoria de produto' },

      // Products
      { method: 'GET', path: '/api/products', description: 'Lista produtos paginados com filtros (productCategoryId, productSituationId, etc)' },
      { method: 'GET', path: '/api/products/:id', description: 'Busca produto por ID' },
      { method: 'POST', path: '/api/products', description: 'Cria produto (name, price, productCategoryId, productSituationId, etc)' },
      { method: 'PUT', path: '/api/products/:id', description: 'Atualiza produto existente' },
      { method: 'DELETE', path: '/api/products/:id', description: 'Remove produto por ID' }
    ]
  });
});

// Health check
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
    service: 'NodeJS Express API - Projeto Engenharia de Software'
  });
});

module.exports = router;
