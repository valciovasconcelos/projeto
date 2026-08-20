'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('products', [
      {
        name: 'Notebook Gamer',
        price: 4999.99,
        description: 'Notebook de alto desempenho para jogos e trabalho.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Mouse Sem Fio 16000 DPI',
        price: 250.00,
        description: 'Mouse óptico sem fio ergonômico recarregável.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Teclado Mecânico RGB',
        price: 450.50,
        description: 'Teclado mecânico switch azul com retroiluminação RGB.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Monitor UltraWide 29"',
        price: 1299.90,
        description: 'Monitor IPS Pro com taxa de atualização de 75Hz e HDR.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Cadeira Gamer Ergonomica',
        price: 899.00,
        description: 'Cadeira gamer reclinável com almofadas lombar e cervical.',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('products', null, {});
  }
};
