var jwt = require("jsonwebtoken");
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

  var upload = multer({
    storage: storage
  }).single("upload-image");
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

  app.post("/api/donate", function(req, res) {
    console.log(req.body.donationAmount);
    db.Credits.findOne({ where: { UserId: req.body.userId } }).then(function(
      donateUser
    ) {
      console.log(donateUser);
      donateUser
        .update({
          totalCredits: donateUser.totalCredits - req.body.donationAmount
        })
        .then(function(updatedUser) {
          console.log(req.body.imageId);
          console.log(updatedUser);
          db.Images.findOne({ where: { id: req.body.imageId } }).then(function(
            image
          ) {
            db.Credits.findOne({ where: { UserId: image.UserId } }).then(
              function(donateRec) {
                donateRec
                  .update({
                    totalCredits:
                      donateUser.totalCredits +
                      parseInt(req.body.donationAmount)
                  })
                  .then(function(success) {
                    console.log(success);
                    res.status(200).redirect("/");
                  });
              }
            );
          });
        });
    });
  });

  app.get("/api/downloadUrl/:id", function(req, res) {
    db.Images.findOne({
      where: { id: req.params.id }
    })
      .then(function(image) {
        res.status(200).json({ url: image.imageUrl });
      })
      .catch(function(err) {
        console.log(err);
        res.status(500).end();
      });
  });
  app.post("/api/upload", function(req, res) {
    upload(req, res, function(err) {
      if (err) {
        console.log(err);
        res.status(500).end();
      } else {
        db.Images.create({
          imageUrl: "uploads/" + req.file.filename,
          downloadCreditAmount: 20,
          likes: 0,
          UserId: req.body.user
        });
        res.status(200).redirect("/");
      }
    });
  });

  app.get("/api/images", function(req, res) {
    db.Images.findAll({ order: [["likes", "DESC"]] }).then(function(
      allUserImages
    ) {
      res.json(allUserImages);
    });
  });

  app.post("/api/image/:id/likes", function(req, res) {
    db.Images.findOne({
      where: {
        id: req.params.id
      }
    }).then(function(image) {
      console.log(image.UserId);
      if (image === null) {
        console.log("dhafdas");
        console.log(image);
        res.status(500).end();
      } else {
        image.increment("likes");
        // first from the images we need to find the user
        db.Credits.findOne({
          where: {
            UserId: image.UserId
          }
        })
          .then(function(credit) {
            credit.increment("totalCredits");
            res.status(200).end();
          })
          .catch(function(err) {
            console.log(err);
          });
      }
    });
  });
};
