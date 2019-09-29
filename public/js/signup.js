$(document).ready(function () {
    $(".submit-button").on("click", function (event) {
        event.preventDefault();
        $.ajax({
            mehthod: "POST",
            url: "/api/"
        })
    });
});
