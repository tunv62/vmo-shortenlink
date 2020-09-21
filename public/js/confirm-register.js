$(document).ready(function(){
    $('.alert-danger').hide()
    $(document).on('click', '#btn-confirm', function(){
        let email = $('#email').text()
        let code = $('#code').val()
        $.ajax({
            url: '/signup/confirm-register',
            method: 'POST',
            dataType: 'json',
            data: {
                email: email,
                code: code
            },
            success: function(dt){
                let { messages, success} = dt
                console.log(messages)
                if (success) window.location.href = '/signup'
                else {
                    $('.alert-danger').show()
                    $('#show-error').text(messages)
                }
            },
            error: function(status, err){
                console.log('error ' + status + " " + err);
            }
        })
    })
})