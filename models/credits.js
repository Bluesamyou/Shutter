module.exports = function(sequelize, DataTypes) {
  var Credits = sequelize.define("Credits", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    // userId: {
    //   type: DataTypes.INTEGER
    // },
    totalCredits: {
      type: DataTypes.INTEGER
    }
  });

  Credits.associate = function(models) {
    // We're saying that a Post should belong to an Author
    // A Post can't be created without an Author due to the foreign key constraint

    // credits will get a new column called userId
    Credits.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  return Credits;
};
