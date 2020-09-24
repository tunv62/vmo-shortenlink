function disableBtn(id){
    $(id).prop('disabled', true)
    $(id).html('Loading...<span class="spinner-grow spinner-grow-sm"></span><span class="spinner-grow spinner-grow-sm"></span><span class="spinner-grow spinner-grow-sm"></span>')
}

function enableBtn(id, content){
    $(id).prop('disabled', false)
    $(id).text(content)
}

$(document).ready(function(){
    $('.alert-danger').hide()
    $(document).on('click', '#btn-reset', function(){
        disableBtn('#btn-reset')
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
                enableBtn('#btn-reset', 'Reset Password')
                if (success) window.location.href = '/login'
                else {
                    if (messages){
                        $('.alert-danger').show()
                        $('#show-error').text('email invalid')
                    } else window.location.href = '/login'
                }
            },
            error: function(status, err){
                console.log('error ' + status + " " + err);
            }
        })
    })
})