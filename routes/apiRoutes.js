var jwt = require("jsonwebtoken");
var toonavatar = require("cartoon-avatar");

module.exports = function(app) {
  // app.post("/api/login", function(req, res) {
  //   console.log(req.params);

  //   jwt.sign({ user: user }, "MySecretKey", function(err, token) {
  //     if (err) {
  //       throw err;
  //     }
  //     res.json({ token: token });
  //   });
  // });

  var db = require("../models");
  var bcrypt = require("bcrypt");
  var saltRounds = 10;

  //register: storing name, email and password and redirecting to home page after signup

  app.post("/api/create-user", function(req, res) {
    // var User = req.body;
    bcrypt.hash(req.body.passwordsignup, saltRounds, function(err, hash) {
      db.User.create({
        name: req.body.usernamesignup,
        email: req.body.emailsignup,
        password: hash,
        avatar: toonavatar.generate_avatar()
      })
        .then(function(data) {
          if (data) {
            res.status(200).json({
              success: true,
              message: "Succesfully added in user " + data.name
            });
          }
        })
        .catch(function(err) {
          if (err) {
            res.status(500).json({ success: false, message: err.message });
          }
        });
    });
  });

  //login page: storing and comparing email and password,and redirecting to home page after login
  app.post("/api/login", function(req, res) {
    db.User.findOne({
      where: {
        email: req.body.email
      }
    }).then(function(user) {
      if (!user) {
        res.status(500).json({
          success: false,
          message:
            "User not found in the system, please check your details or register for an account"
        });
      } else {
        bcrypt.compare(req.body.password, user.password, function(err, result) {
          console.log(user.email);
          console.log(user.name);
          if (result) {
            var client = {
              id: user.id,
              username: user.name,
              email: user.email,
              avatar: user.avatar
            };
            jwt.sign({ data: client }, "secretkey", function(err, token) {
              if (err) {
                res.status(500).json({
                  success: false,
                  message: "Unable to retrieve secure token"
                });
              }

              console.log(token);
              res.status(200).json({
                success: true,
                message: "Logged in user",
                data: {
                  token: token,
                  username: user.name,
                  email: user.email
                }
              });
            });
          } else {
            res.status(500).json({
              success: false,
              message: "Incorrect password",
              user: {
                username: user.username,
                email: user.email
              }
            });
          }
        });
      }
    });
  });
};
