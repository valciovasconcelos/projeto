const express = require('express');
const router = express.Router();
const productRoutes = require('./productRoutes');

// Rotas da API
router.use('/products', productRoutes);

// Rota de Health Check (Verificação de Integridade)
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date(),
    service: 'NodeJS Express API Template'
  });
});

module.exports = router;
