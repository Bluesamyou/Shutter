var jwt = require("jsonwebtoken");
var admin = require("firebase-admin");
console.log(admin);
var toonavatar = require("cartoon-avatar");
var db = require("../models");
var path = require("path");
var bcrypt = require("bcrypt");
var multer = require("multer");

module.exports = function(app) {
  var saltRounds = 10;

  var storage = multer.diskStorage({
    destination: function destination(req, file, cb) {
      cb(null, "./public/uploads");
    },
    filename: function filename(req, file, cb) {
      cb(
        null,
        file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      );
    }
  });

  var upload = multer({ storage: storage }).single("upload-image");
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
            console.log(data.id);
            console.log(db.Credits);
            db.Credits.create({
              UserId: data.id,
              totalCredits: 200
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
                console.log(err);
                res.status(500).end();
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
                  id: user.id,
                  email: user.email,
                  avatar: user.avatar
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

  app.get("/api/credits/:id", function(req, res) {
    db.Credits.findOne({
      where: { UserId: req.params.id }
    })
      .then(function(userCredit) {
        res.status(200).json({ credits: userCredit.totalCredits });
      })
      .catch(function(err) {
        console.log(err);
        res.status(500).end();
      });
  });

  app.post("/api/upload", function(req, res, next) {
    console.log(next);
    upload(req, res, function(err) {
      if (err) {
        res.status(500).end();
      } else {
        res.send(req.file);
      }
    });
  });

  app.get("/api/images", function(req, res) {
    db.Images.findAll({}).then(function(allUserImages) {
      res.json(allUserImages);
    });
  });

  app.post("/api/images/:id/likes", function(req, res) {
    db.Images.findOne({
      where: {
        id: req.params.id
      }
    }).then(function(images) {
      if (images === null) {
        console.log("dhafdas");
        console.log(images);
        res.status(404);
        res.send();
      } else {
        images.increment("likes");
        // first from the images we need to find the user
        // we have user - so we need to find user's credits
        // credits - need to increment the field
        // send it back to client
      }
    });
  });
};
