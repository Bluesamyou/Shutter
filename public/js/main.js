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
        "<button class='upload-image'>Upload an image</button><button class='logout'>logout</button>";
      $(".user-footer").html(appendHTML);
    });
  }

  $.ajax({
    method: "GET",
    url: "api/images"
  }).then(function(data) {
    console.log(data);
  });

  $(".login-button").on("click", function(e) {
    e.preventDefault();
    window.location.href = "/login";
  });
});
