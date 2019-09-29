var jwt = require("jsonwebtoken");

module.exports = function(app) {
  app.post("/api/login", function(req, res) {
    console.log("in the login endpoint");
    console.log(req.params);

    var user = { id: 1, username: "shutter", email: "shutter@gmail.com" };

    jwt.sign({ user: user }, "MySecretKey", function(err, token) {
      if (err) {
        throw err;
      }
      res.json({ token: token });
    });
  });
};
//     var user = { id: 1, username: "Shutter", email: "shutter@gmail.com" };

//     jwt.sign({ user: user}, "key", function (err, token){
//         res.json({token: token})
//     })
//     })
// }
