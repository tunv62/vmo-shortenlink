$(document).ready(function () {
    $(document).on('click', '#showPassword', function(){
        let check = $('#Password').attr('type')
        console.log(check)
        if(check === 'password') $('#Password').attr('type', 'text')
        else $('#Password').attr('type', 'password')
    })
})