module.exports = (sequelize, DataTypes) => {
  const ProductSituation = sequelize.define('ProductSituation', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "O nome da situação do produto não pode ser vazio."
        }
      }
    }
  }, {
    tableName: 'product_situations',
    timestamps: true
  });

  ProductSituation.associate = (models) => {
    ProductSituation.hasMany(models.Product, {
      foreignKey: 'productSituationId',
      as: 'products'
    });
  };

  return ProductSituation;
};
