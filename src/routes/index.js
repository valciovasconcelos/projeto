const express = require('express');
const router = express.Router();
const productRoutes = require('./productRoutes');
const categoryRoutes = require('./categoryRoutes');
const { sequelize } = require('../models');

// Rotas da API
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);

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

