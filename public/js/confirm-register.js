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
    $(document).on('click', '#btn-confirm', function(){
        disableBtn('#btn-confirm')
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
                setTimeout(() => {
                    enableBtn('#btn-confirm', 'Confirm Register')
                }, 500);
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