$(document).ready(function(){
    $('.alert-danger').hide()
    $(document).on('click', '#btn-reset', function(){
        let email = $('#email').val()
        $.ajax({
            url: '/login/forgot-password',
            method: 'POST',
            dataType: 'json',
            data: {
                email: email
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
            error: function(status, err){
                console.log('error ' + status + " " + err);
            }
        })
    })
})