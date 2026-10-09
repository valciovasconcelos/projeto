module.exports = (sequelize, DataTypes) => {
  const ProductCategory = sequelize.define('ProductCategory', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: "Já existe uma categoria de produto com este nome."
      },
      validate: {
        notEmpty: {
          msg: "O nome da categoria do produto não pode ser vazio."
        }
      }
    }
  }, {
    tableName: 'product_categories',
    timestamps: true
  });

  ProductCategory.associate = (models) => {
    ProductCategory.hasMany(models.Product, {
      foreignKey: 'productCategoryId',
      as: 'products'
    });
  };

  return ProductCategory;
};
