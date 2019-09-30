var express = require("express");
var images = require("../models/images");
var app = express();
var googleStorage = require("@google-cloud/storage");
var Multer = require("multer");

var storage = googleStorage({
  projectId: "shutter-102c2",
  keyFilename: "./firebase/shutterFirebaseConfig.json"
});

var bucket = storage.bucket("gs://shutter-102c2.appspot.com/");

var multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // no larger than 5mb, you can change as needed.
  }
});

app.listen(3000, function() {
  console.log("App listening to port 3000");
});

/**
 * Adding new file to the storage
 */
app.post("/upload", multer.single("file"), function(req, res) {
  console.log("Upload Image");

  var file = req.file;
  if (file) {
    uploadImageToStorage(file)
      .then(function(success) {
        res.status(200).send({
          status: "success"
        });
        console.error(success);
      })
      .catch(function(error) {
        console.error(error);
      });
  }
});

/**
 * Upload the image file to Google Storage
 * @param {File} file object that will be uploaded to Google Storage
 */
var uploadImageToStorage = function uploadImageToStorage(file) {
  return new Promise(function(resolve, reject) {
    if (!file) {
      reject("No image file");
    }
    var newFileName = file.originalname + "_" + Date.now();

    var fileUpload = bucket.file(newFileName);

    var blobStream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype
      }
    });

    blobStream.on("error", function(error) {
      reject("Something is wrong! Unable to upload at the moment.");
    });

    blobStream.on("finish", function() {
      // The public URL can be used to directly access the file via HTTP.
      var url = format(
        "https://storage.googleapis.com/" + bucket.name + "/" + fileUpload.name
      );
      resolve(url);
    });

    blobStream.end(file.buffer);
  });
};
