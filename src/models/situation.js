module.exports = (sequelize, DataTypes) => {
  const Situation = sequelize.define('Situation', {
    nameSituation: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "O nome da situação não pode ser vazio."
        }
      }
    }
  }, {
    tableName: 'situations',
    timestamps: true
  });

  Situation.associate = (models) => {
    Situation.hasMany(models.User, {
      foreignKey: 'situationId',
      as: 'users'
    });
  };

  return Situation;
};
