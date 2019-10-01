$(document).ready(function() {
  $(".submit-button").on("click", function(event) {
    // Prevent default action to refresh page
    event.preventDefault();

    // Fetch user information from form
    var email = $("#email").val();
    var password = $("#password").val();

    // Checks if all fields are populated
    if ((!email, !password)) {
      return alert("Please fill all fields");
    }

    // Posts data to server
    $.ajax({
      method: "POST",
      url: "/api/login",
      data: { email: email, password: password }
    })
      .then(function(data) {
        if (data.success) {
          console.log(data);
          localStorage.setItem("account", JSON.stringify(data.data));
          // Fires success modal
          Swal.fire({
            title: "Successfully logged in as " + data.data.username,
            type: "success",
            showCancelButton: false,
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Proceed"
          }).then(function(result) {
            if (result.value) {
              location.href = "/";
            }
          });
        }
      })
      .fail(function(err) {
        console.log(err);
        Swal.fire({
          title: "Error logging in",
          text: err.responseJSON.message,
          type: "error",
          showCancelButton: false,
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Proceed"
        }).then(function(result) {
          if (result.value) {
            location.href = "/login";
          }
        });
      });
  });
});
