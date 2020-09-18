$(document).ready(function () {
    $('#inputPassword, #repeatPassword').on('keyup', function () {
        if ($('#inputPassword').val() == $('#repeatPassword').val()) {
            $('#message').html('Matching').css('color', 'green');
        } else
            $('#message').html('Not Matching').css('color', 'red');
    });
})