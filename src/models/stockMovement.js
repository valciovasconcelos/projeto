module.exports = (sequelize, DataTypes) => {
  const StockMovement = sequelize.define('StockMovement', {
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: "O ID do produto é obrigatório."
        }
      }
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: {
          args: [['IN', 'OUT']],
          msg: "O tipo de movimentação deve ser 'IN' (Entrada) ou 'OUT' (Saída)."
        }
      }
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: {
          args: [1],
          msg: "A quantidade da movimentação deve ser no mínimo 1."
        }
      }
    },
    reason: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'stock_movements',
    timestamps: true
  });

  StockMovement.associate = (models) => {
    StockMovement.belongsTo(models.Product, {
      foreignKey: 'productId',
      as: 'product'
    });
  };

  return StockMovement;
};
