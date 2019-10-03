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
    // We're saying that a Post should belong to an Author
    // A Post can't be created without an Author due to the foreign key constraint
  };
  return Images;
};
