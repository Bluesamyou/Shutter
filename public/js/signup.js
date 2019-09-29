$(document).ready(function () {
    $(".submit-button").on("click", function (event) {
        // Prevent default action to refresh page
        event.preventDefault();

        // Fetch user information from form
        var username = $("#username").val();
        var email = $("#email").val();
        var password = $("#password").val();

        // Checks if all fields are populated
        if ((!username, !email, !password)) {
            return alert("Please fill all fields");
        }

        // Posts data to server
        $.ajax({
            method: "POST",
            url: "/api/create-user",
            data: {
                emailsignup: email,
                usernamesignup: username,
                passwordsignup: password
            }
        }).then(function (data) {
            if (data.success) {
                // Fires success modal
                Swal.fire({
                    title: "Account Successfully Created",
                    text: "Please login with your account details",
                    type: "success",
                    showCancelButton: false,
                    confirmButtonColor: "#3085d6",
                    confirmButtonText: "Proceed"
                }).then(function (result) {
                    if (result.value) {
                        // Reloads to login page
                        location.href = "/login";
                    }
                });
            }
        });
    });
});
