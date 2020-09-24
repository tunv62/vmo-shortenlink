function disableBtn(id){
    $(id).prop('disabled', true)
    $(id).html('Loading...<span class="spinner-grow spinner-grow-sm"></span><span class="spinner-grow spinner-grow-sm"></span><span class="spinner-grow spinner-grow-sm"></span>')
}

function enableBtn(id, content){
    $(id).prop('disabled', false)
    $(id).text(content)
}

$(document).ready(function () {
    $('.alert-danger').hide()
    $('#inputPassword, #repeatPassword').on('keyup', function () {
        if ($('#inputPassword').val() == $('#repeatPassword').val())
            $('#message').html('Matching').css('color', 'green')
        else $('#message').html('Not Matching').css('color', 'red')
    })
    $(document).on('click', '#reset', function(){
        disableBtn('#reset')
        let arr = window.location.href.split('/')
        let token = arr[arr.length - 1]
        let password = $('#inputPassword').val()
        $.ajax({
            url: '/reset/' + token,
            method: 'POST',
            typeData: 'json',
            data: {
                token: token,
                password: password
            },
            success: function(dt){
                let { messages, success} = dt
                enableBtn('#reset', 'Reset')
                if (success) window.location.href = '/login'
                else {
                    if(!messages) window.location.href = '/page-not-found'
                    else {
                        $('.alert-danger').show()
                        $('#show-error').text(' password 3-10 character, least 1 character and 1 number')
                    }
                }
            },
            error: function(stt, err){
                console.log(stt + err)
            }
        })
    })
})