$(document).ready(function () {
    $('#inputPassword, #repeatPassword').on('keyup', function () {
        if ($('#inputPassword').val() == $('#repeatPassword').val()) 
            $('#message').html('Matching').css('color', 'green')
        else $('#message').html('Not Matching').css('color', 'red')
    })
    $('form').submit(function(){
        $('.btn').prop('disabled', true)
        $('button.btn').append('<span class="spinner-grow spinner-grow-sm"></span><span class="spinner-grow spinner-grow-sm"></span><span class="spinner-grow spinner-grow-sm"></span>')
    })
})