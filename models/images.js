module.exports = function(sequelize, DataTypes) {
  var Images = sequelize.define("Images", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    // userId: {
    //   type: DataTypes.INTEGER
    // },
    imageUrl: {
      type: DataTypes.STRING
    },
    downloadCreditAmount: {
      type: DataTypes.INTEGER
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  });

  Images.associate = function(models) {
    Images.belongsTo(models.User);
  };
  return Images;
};
