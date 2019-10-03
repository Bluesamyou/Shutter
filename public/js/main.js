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
        "Likes : " +
        image.likes +
        "</div><div class='card-image'><img class='card-image' width='300' height='200' src='" +
        image.imageUrl +
        "' alt='' /></div><div class='card-button-container'><button class='like' data-attr='" +
        image.id +
        "'><i class='far fa-heart'></i></button><button class='donate'><i class='fas fa-donate' data-attr='" +
        image.id +
        "'></i></button><button class='download'><i class='fas fa-cloud-download-alt' data-attr='" +
        image.id +
        "'></i></button></div></div>";
      $(".card-container").append(card);
    });
  });

  $(".login-button").on("click", function(e) {
    e.preventDefault();
    window.location.href = "/login";
  });

  $(".card-container").on("click", ".like", function(e) {
    e.preventDefault();
    var id = $(this).attr("data-attr");
    $.ajax({
      method: "POST",
      url: "/api/image/" + id + "/likes"
    }).then(function() {
      Swal.fire({
        title: "Image liked",
        type: "success",
        showCancelButton: false,
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Proceed"
      }).then(function(result) {
        if (result.value) {
          location.href = "/";
        }
      });
    });
  });

  $(".card-container").on("click", ".donate", function(e) {
    e.preventDefault();
    var id = $(this).attr("data-attr");
    if (localStorage.getItem("account")) {
      $.ajax({
        method: "GET",
        url: "/api/credits/" + account.id
      }).then(function(data) {
        credits = data.credits;

        Swal.fire({
          title: "Enter a donations amount",
          html: "<P> Total Credits : " + credits + "</P>",
          input: "number",
          inputAttributes: {
            autocapitalize: "off"
          },
          showCancelButton: true,
          confirmButtonText: "Donate",
          showLoaderOnConfirm: true,
          preConfirm: function(donation) {
            return $.ajax({
              method: "POST",
              url: "/api/donate"
            })
              .then(response => {
                if (!response.ok) {
                  throw new Error(response.statusText);
                }
                return response.json();
              })
              .catch(error => {
                Swal.showValidationMessage(`Request failed: ${error}`);
              });
          },
          allowOutsideClick: () => !Swal.isLoading()
        }).then(result => {
          if (result.value) {
            Swal.fire({
              title: `${result.value.login}'s avatar`,
              imageUrl: result.value.avatar_url
            });
          }
        });
      });
    } else {
      Swal.fire({
        title: "You need to be logged in to donate",
        type: "info",
        showCancelButton: false,
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Login"
      }).then(function(result) {
        if (result.value) {
          location.href = "/login";
        }
      });
    }
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
