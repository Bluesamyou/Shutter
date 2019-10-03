$("document").ready(function() {
  if (localStorage.getItem("account")) {
    var account = JSON.parse(localStorage.getItem("account"));
    var credits = null;

    $.ajax({
      method: "GET",
      url: "/api/credits/" + account.id
    }).then(function(data) {
      console.log(data);
      credits = data.credits;

      var appendHTML =
        "<img width='50' height='50' style='display :inline-block;' src='" +
        account.avatar +
        "'> <p>" +
        account.username +
        " " +
        "</p> <br>" +
        "<p> (" +
        credits +
        ")</p>" +
        "<button class='upload-image'>Upload an image</button><button class='logout'>logout</button>" +
        "<form style='display:none;' action='/api/upload' method='post' enctype='multipart/form-data'><input type='file' accept='image/*' name='upload-image' class='image-upload-input'><input name='user' value='" +
        account.id +
        "'><button type='submit' class='post-image'>Submit</button></form>";
      $(".user-footer").html(appendHTML);
    });
  }

  $.ajax({
    method: "GET",
    url: "api/images"
  }).then(function(data) {
    var card = "";
    data.forEach(function(image) {
      card =
        "<div class='card'><div class='card-header'>" +
        "Credits : " +
        image.downloadCreditAmount +
        "</div><div class='card-image'><img class='card-image' src='/" +
        image.imageUrl +
        "' alt='' /></div><div class='card-button-container'><button class='like'><i class='far fa-heart'></i></button><button class='donate'><i class='fas fa-donate'></i></button><button class='download'><i class='fas fa-cloud-download-alt'></i></button></div></div>";
      $(".card-container").append(card);
    });
  });

  $(".login-button").on("click", function(e) {
    e.preventDefault();
    window.location.href = "/login";
  });

  $(".user-footer").on("click", ".upload-image", function(e) {
    e.preventDefault();
    $(".image-upload-input").click();
    $(".image-upload-input").change(function(e) {
      e.preventDefault();
      $(".post-image").click();
    });
  });

  $(".user-footer").on("click", ".logout", function(e) {
    e.preventDefault();
    localStorage.removeItem("account");
    window.location.href = "/";
  });
});
