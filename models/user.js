// var bcrypt = require("bcrypt");

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      is: ["^[a-z]+$", "i"],
      allowNull: false,
      required: true,
      minlength: 3,
      maxlength: 50
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      required: true,
      minlength: 5,
      maxlength: 255,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      required: true,
      minlength: 3,
      maxlength: 255,
      len: [2, 10]
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: false,
      required: true,
      maxlength: 255,
      len: [10, 50]
    }
  });

  // generating a hash
  User.generationHash = function(password) {
    return bcrypt.hashSync(password, this.localPassword);
  };

  // checking if password is valid
  User.prototype.validPassword = function(password) {
    return bcrypt.compareSync(password, bcrypt.genSaltSync(8), null);
  };

  User.associate = function(models) {
    User.hasMany(models.Images);
    // We're saying that a Post should belong to an Author
    // A Post can't be created without an Author due to the foreign key constraint
    User.hasOne(models.Credits);
  };
  return User;
};
