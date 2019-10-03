var jwt = require("jsonwebtoken");

module.exports = function(app) {
  app.post("/api/login", function(req, res) {
    console.log("in the login endpoint");
    console.log(req.params);

    jwt.sign({ user: user }, "MySecretKey", function(err, token) {
      if (err) {
        throw err;
      }
      res.json({ token: token });
    });
  });

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
        password: hash
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
  app.post("/api/user", function(req, res) {
    // var User = req.body;
    db.User.findOne({
      where: {
        email: req.body.email
      }
    }).then(function(user) {
      if (!user) {
        res.redirect("/");
      } else {
        bcrypt.compare(req.body.password, user.password, function(err, result) {
          if (result === true) {
            res.redirect("/home");
          } else {
            res.send("Incorrect password");
            res.redirect("/");
          }
        });
      }
    });
  });

  app.get("api/images", function(req, res) {
    db.Images.findAll({}).then(function(allUserImages) {
      res.json(allUserImages);
    });
  });

  app.post("/api/image/:id/likes", function(req, res) {
    db.Images.findOne({
      where: {
        id: req.params.id
      }
    }).then(function(image) {
      if (image === null) {
        console.log("dhafdas");
        console.log(image);
        res.status(404);
        res.send();
      } else {
        // first from the images we need to find the user
        db.User.findOne({
          where: {
            userId: image.id
          }
        })
          .then(function(credit) {
            // we have user - so we need to find user's credits
            return db.Credits.findOne({
              where: {
                userId: credit.id
              }
            });
          })
          .then(function(incrementCredit) {
            // credits - need to increment the field
            return incrementCredit.increment("totalCredits");
          })
          .then(function(showCredits) {
            // send it back to client
            res.json(showCredits);
          });
      }
    });
  });
};
