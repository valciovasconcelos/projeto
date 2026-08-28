'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Inserir Categorias
    await queryInterface.bulkInsert('categories', [
      {
        id: 1,
        name: 'Eletrônicos',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        name: 'Periféricos',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        name: 'Móveis',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});

    // 2. Inserir Produtos associados às Categorias
    await queryInterface.bulkInsert('products', [
      {
        name: 'Notebook Gamer',
        price: 4999.99,
        description: 'Notebook de alto desempenho para jogos e trabalho.',
        categoryId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Mouse Sem Fio 16000 DPI',
        price: 250.00,
        description: 'Mouse óptico sem fio ergonômico recarregável.',
        categoryId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Teclado Mecânico RGB',
        price: 450.50,
        description: 'Teclado mecânico switch azul com retroiluminação RGB.',
        categoryId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Monitor UltraWide 29"',
        price: 1299.90,
        description: 'Monitor IPS Pro com taxa de atualização de 75Hz e HDR.',
        categoryId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Cadeira Gamer Ergonomica',
        price: 899.00,
        description: 'Cadeira gamer reclinável com almofadas lombar e cervical.',
        categoryId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('products', null, {});
    await queryInterface.bulkDelete('categories', null, {});
  }
};
