$("document").ready(function() {
  if (localStorage.getItem("account")) {
    var account = JSON.parse(localStorage.getItem("account"));

    var appendHTML =
      "<img width='50' height='50' style='display :inline-block;' src='" +
      account.avatar +
      "'> <p>" +
      account.username +
      "</p>";

    $(".user-footer").html(appendHTML);
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
