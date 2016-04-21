$(document).ready(function() {
    $("#LumiereChambre").click(function() {
        $.getJSON("/wemoApi/toggle", function(data) {
            console.log(data);
        });
    });
});