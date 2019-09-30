module.exports = function(sequelize, DataTypes) {
  var Images = sequelize.define("Images", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER
    },
    imageUrl: {
      type: DataTypes.INTEGER
    },
    downloadCreditAmount: {
      type: DataTypes.INTEGER
    }
  });
  return Images;
};
