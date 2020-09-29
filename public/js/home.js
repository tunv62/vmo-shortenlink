function disableBtn(id){
    $(id).prop('disabled', true)
    $(id).html('<span class="spinner-grow spinner-grow-sm"></span><span>  </span><span class="spinner-grow spinner-grow-sm"></span><span>  </span><span class="spinner-grow spinner-grow-sm"></span>')
}

function enableBtn(id, content){
    $(id).prop('disabled', false)
    $(id).text(content)
}

function showError(message){
    return '<div class="alert alert-danger mx-auto">'
                +'<strong>Opps, </strong><span>'+message+'</span> <br>'
            +'</div>'
}

function shortenLink(shorten){
    return '<span class="mx-auto mb-2"><i id="btn-copy" style="cursor: pointer;" class="far fa-copy"></i> <span id="content-copy">http://localhost:4000/'+shorten+'</span>  </span>'
}

$(document).ready(function(){
    $(document).on('click', '#get-short-link-guest', function(){
        disableBtn('#get-short-link-guest')
        let longLink = $('#long-link').val()

        $.ajax({
            url: '/short-link-guest',
            method: 'POST',
            dataType: 'json',
            data: { longLink: longLink},
            success: function(dt){
                enableBtn('#get-short-link-guest', 'shorter')
                let { message, success } = dt
                if ( success ) $('#shorten-link').html(shortenLink(message))
                else $('#shorten-link').html(showError(message))
            },
            error: function(stt, err){
                console.log(stt + err)
            }
        })
    })

    // $(document).on('click', '#btn-copy', function(){
    //     console.log('----------')
    //     var copyText = document.getElementById("#content-copy");
    //     copyText.select();
    //     copyText.setSelectionRange(0, 2000)
    //     document.execCommand("copy");
    //     alert("Copied the text: " + copyText.value);
    // })
})