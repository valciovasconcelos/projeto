'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = new Date();

    // 1. Seed Situations
    await queryInterface.bulkInsert('situations', [
      { id: 1, nameSituation: 'Ativo', createdAt: now, updatedAt: now },
      { id: 2, nameSituation: 'Inativo', createdAt: now, updatedAt: now },
      { id: 3, nameSituation: 'Pendente', createdAt: now, updatedAt: now }
    ], { ignoreDuplicates: true });

    // 2. Seed Users
    await queryInterface.bulkInsert('users', [
      { id: 1, name: 'Carlos Silva', email: 'carlos.silva@exemplo.com', situationId: 1, createdAt: now, updatedAt: now },
      { id: 2, name: 'Ana Souza', email: 'ana.souza@exemplo.com', situationId: 1, createdAt: now, updatedAt: now },
      { id: 3, name: 'Marcos Rocha', email: 'marcos.rocha@exemplo.com', situationId: 2, createdAt: now, updatedAt: now }
    ], { ignoreDuplicates: true });

    // 3. Seed Product Situations
    await queryInterface.bulkInsert('product_situations', [
      { id: 1, name: 'Disponível', createdAt: now, updatedAt: now },
      { id: 2, name: 'Indisponível', createdAt: now, updatedAt: now },
      { id: 3, name: 'Em Estoque', createdAt: now, updatedAt: now }
    ], { ignoreDuplicates: true });

    // 4. Seed Product Categories
    await queryInterface.bulkInsert('product_categories', [
      { id: 1, name: 'Eletrônicos', createdAt: now, updatedAt: now },
      { id: 2, name: 'Informática', createdAt: now, updatedAt: now },
      { id: 3, name: 'Escritório', createdAt: now, updatedAt: now }
    ], { ignoreDuplicates: true });

    // 5. Seed Products
    await queryInterface.bulkInsert('products', [
      {
        id: 1,
        name: 'Notebook Dell Inspiron',
        price: 3500.00,
        description: 'Intel i7, 16GB RAM, 512GB SSD',
        productSituationId: 1,
        productCategoryId: 2,
        quantity: 15,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 2,
        name: 'Mouse Sem Fio Logitech',
        price: 120.00,
        description: 'Mouse óptico ergonômico 2.4GHz',
        productSituationId: 1,
        productCategoryId: 2,
        quantity: 50,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 3,
        name: 'Cadeira Ergonômica Presidente',
        price: 850.00,
        description: 'Cadeira de escritório com suporte lombar',
        productSituationId: 3,
        productCategoryId: 3,
        quantity: 8,
        createdAt: now,
        updatedAt: now
      }
    ], { ignoreDuplicates: true });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('products', null, {});
    await queryInterface.bulkDelete('product_categories', null, {});
    await queryInterface.bulkDelete('product_situations', null, {});
    await queryInterface.bulkDelete('users', null, {});
    await queryInterface.bulkDelete('situations', null, {});
  }
};
