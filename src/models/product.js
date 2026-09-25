module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "O nome não pode ser vazio."
        }
      }
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: {
          args: [0],
          msg: "O preço não pode ser menor que zero."
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: {
          args: [0],
          msg: "A quantidade em estoque não pode ser negativa."
        }
      }
    }
  }, {
    tableName: 'products',
    timestamps: true
  });

  Product.associate = (models) => {
    Product.belongsTo(models.Category, {
      foreignKey: 'categoryId',
      as: 'category'
    });
    Product.hasMany(models.StockMovement, {
      foreignKey: 'productId',
      as: 'stockMovements'
    });
  };

  return Product;
};
