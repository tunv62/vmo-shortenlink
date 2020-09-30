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
        console.log('run-----')
        disableBtn('#btn-confirm')
        let shortUrl = $('#shortUrl').text()
        let password = $('#password').val()
        $.ajax({
            url: '/password-access-link',
            method: 'POST',
            dataType: 'json',
            data: {
                shortUrl: shortUrl,
                password: password
            },
            success: function(dt){
                console.log('result -----')
                let { message, success} = dt
                setTimeout(() => {
                    enableBtn('#btn-confirm', 'Confirm')
                }, 300)
                if (success) window.location.href = message
                else {
                    $('.alert-danger').show()
                    $('#show-error').text(message)
                }
            },
            error: function(status, err){
                console.log('error ' + status + " " + err);
            }
        })
    })
})