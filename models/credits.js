module.exports = function(sequelize, DataTypes) {
  var Credits = sequelize.define("Credits", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    totalCredits: {
      type: DataTypes.INTEGER
    }
  });

  Credits.associate = function(models) {
    // credits will get a new column called userId
    Credits.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  return Credits;
};
