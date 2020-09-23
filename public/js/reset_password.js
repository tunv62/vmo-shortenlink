
$(document).ready(function () {
    $('.alert-danger').hide()
    $('#inputPassword, #repeatPassword').on('keyup', function () {
        if ($('#inputPassword').val() == $('#repeatPassword').val()) {
            $('#message').html('Matching').css('color', 'green');
        } else
            $('#message').html('Not Matching').css('color', 'red');
    });
    $(document).on('click', '#reset', function(){
        let arr = window.location.href.split('/')
        let token = arr[arr.length - 1]
        let password = $('#inputPassword').val()
        $.ajax({
            url: '/reset/' + token,
            method: 'POST',
            typeData: 'json',
            data: {
                password: password
            },
            success: function(dt){
                let { messages, success} = dt
                console.log(messages)
                if (success) window.location.href = '/login'
                else {
                    $('.alert-danger').show()
                    $('#show-error').text(messages)
                }
            },
            error: function(stt, err){
                console.log(stt + err)
            }
        })
    })
})