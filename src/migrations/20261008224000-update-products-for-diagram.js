'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Adiciona productSituationId
    await queryInterface.addColumn('products', 'productSituationId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'product_situations',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    // Adiciona productCategoryId
    await queryInterface.addColumn('products', 'productCategoryId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'product_categories',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('products', 'productSituationId');
    await queryInterface.removeColumn('products', 'productCategoryId');
  }
};
