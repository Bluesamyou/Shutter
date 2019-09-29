module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    name: {
      type: DataTypes.STRING,
      required: true,
      minlength: 3,
      maxlength: 50
    },
    email: {
      type: DataTypes.STRING,
      required: true,
      minlength: 5,
      maxlength: 255,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      required: true,
      minlength: 3,
      maxlength: 255
    }
  });
  return User;
};
