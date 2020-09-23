$(document).ready(function () {
    $(document).on('click', '#showPassword', function(){
        let check = $('#password').attr('type')
        console.log(check)
        if(check === 'password') $('#password').attr('type', 'text')
        else $('#password').attr('type', 'password')
    })
})