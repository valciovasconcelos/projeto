const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Prefixo das rotas de API
app.use('/api', routes);

// Tratamento de rotas inexistentes
app.use((req, res) => {
  res.status(404).json({ message: `Rota ${req.originalUrl} não encontrada` });
});

// Tratamento global de erros
app.use(errorHandler);

module.exports = app;
