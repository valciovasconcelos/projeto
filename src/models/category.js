module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: "Já existe uma categoria com este nome."
      },
      validate: {
        notEmpty: {
          msg: "O nome da categoria não pode ser vazio."
        }
      }
    }
  }, {
    tableName: 'categories',
    timestamps: true
  });

  Category.associate = (models) => {
    Category.hasMany(models.Product, {
      foreignKey: 'categoryId',
      as: 'products'
    });
  };

  return Category;
};
