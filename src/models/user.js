module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "O nome do usuário não pode ser vazio."
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: "Este e-mail já está cadastrado."
      },
      validate: {
        isEmail: {
          msg: "Informe um e-mail válido."
        },
        notEmpty: {
          msg: "O e-mail não pode ser vazio."
        }
      }
    },
    situationId: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    tableName: 'users',
    timestamps: true
  });

  User.associate = (models) => {
    User.belongsTo(models.Situation, {
      foreignKey: 'situationId',
      as: 'situation'
    });
  };

  return User;
};
