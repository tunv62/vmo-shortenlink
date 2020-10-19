
$(document).ready(function () {
	var status = false
	$('#shorten-link').fadeToggle()
	// $('#btn-copy').tooltip()
	$('#option-div').fadeToggle()
	$(document).on('click', '#get-short-link-guest', function () {
		disableBtn('#get-short-link-guest')
		$('#shorten-link').fadeOut()
		let longLink = $('#long-link').val()
		$.ajax({
			url: '/short-link-guest',
			method: 'POST',
			dataType: 'json',
			data: { longLink: longLink },
			success: function (dt) {
				enableBtn('#get-short-link-guest', 'shorter')
				let { message, success } = dt
				if (success) {
					$('#shorten-link').html(shortenLink(message))
					$('#btn-copy').tooltip()
				} else $('#shorten-link').html(showError(message))
				$('#shorten-link').fadeIn()
			},
			error: function (stt, err) {
				console.log(stt + err)
			}
		})
	})
	$(document).on('click', '#get-short-link-user', function () {
		disableBtn('#get-short-link-user')
		$('#shorten-link').fadeOut()
		let longLink = $('#long-link').val()
		let password = $('#password').val()
		let customLink = $('#custom-link').val()
		let expire = $('#expire').val()
		let selected = $('#select-option').find(":selected").val()
		$.ajax({
			url: '/short-link-user',
			method: 'POST',
			dataType: 'json',
			data: {
				longLink: longLink,
				password: password,
				customLink: customLink,
				expire: expire,
				selected: selected
			},
			success: function (dt) {
				let { message, success } = dt
				if (success == '1') {
					$('#shorten-link').html(shortenLink(message))
					$('#btn-copy').tooltip()
				}
				else if (success == '0')
					$('#shorten-link').html(showError(message))
				else window.location.href = '/login'
				enableBtn('#get-short-link-user', 'shorter')
				// if (success) 
				// else $('#shorten-link').html(showError(message))
				$('#shorten-link').fadeIn()
			},
			error: function (stt, err) {
				console.log(stt + err)
			}
		})
	})
	$(document).on('click', '#btn-copy', function () {
		// console.log('check----')
		$('#btn-copy').tooltip('hide').attr('data-original-title', 'copied').tooltip('show')
		var temp = $("<input>")
		$("body").append(temp)
		temp.val($('#content-copy').text()).select()
		document.execCommand("copy")
		temp.remove()
	})
	$(document).on('click', '#option-advanced', function () {
		if (!status)
			$.ajax({
				url: '/option-advanced',
				method: 'POST',
				dataType: 'json',
				success: function (dt) {
					let { logged } = dt
					if (logged) {
						status = logged
						$('#option-div').append(optionAdvanced())
						$('#option-div').fadeIn()
					} 
					else {
						$('#shorten-link').fadeOut()
						$('#shorten-link').html(showError('you need login to use option advanced'))
						$('#shorten-link').fadeIn()
					}
				},
				error: function (stt, err) {
					console.log(stt + err)
				}
			})
		else $('#option-div').fadeToggle()
	})

})

function disableBtn(id) {
	$(id).prop('disabled', true)
	$(id).html('<span class="spinner-grow spinner-grow-sm"></span><span>  </span><span class="spinner-grow spinner-grow-sm"></span><span>  </span><span class="spinner-grow spinner-grow-sm"></span>')
}

function enableBtn(id, content) {
	$(id).prop('disabled', false)
	$(id).text(content)
}

function showError(message) {
	return '<div class="alert alert-danger mx-auto">'
		+ '<strong>Oops, </strong><span>' + message + '</span> <br>'
		+ '</div>'
}

function shortenLink(shorten) {
	// return '<span class="mx-auto mb-2"><i id="btn-copy" style="cursor: pointer;" class="far fa-copy"></i> <span id="content-copy">http://localhost:4000/'+shorten+'</span>  </span>'
	return `<p class="mx-auto mb-2"><i id="btn-copy" style="cursor:pointer;" class="far fa-copy fa-lg" data-toggle="tooltip" data-placement="top" title="click to copy"></i> 
	<span id="content-copy" class="bg-light text-dark">`+ shorten +`</span> </p>`
}

function optionAdvanced() {
	return `<div class="form-group row">
	<div class="col-xs-6 col-sm-6 col-md-6">
    <div class="form-group">
      <input type="text" name="password" id="password" class="form-control input-sm rounded-pill" placeholder="password">
    </div>
  </div>
  <div class="col-xs-6 col-sm-6 col-md-6">
    <div class="form-group">
      <input type="text" name="custom-link" id="custom-link" class="form-control input-sm rounded-pill"
        placeholder="custom address">
    </div>
  </div>
  </div>
  <div class="col-xs-5 col-sm-5 col-md-5">
    <div class="row">
      <div class="col-xs-6 col-sm-6 col-md-6">
        <div class="form-group">
          <input type="text" name="expire" id="expire" class="form-control input-sm rounded-pill" placeholder="times">
        </div>
      </div>
      <div class="col-xs-6 col-sm-6 col-md-6">
        <div class="form-group">
          <select class="form-control rounded-pill" id="select-option">
            <option value="0">minutes</option>
            <option value="1">hours</option>
            <option value="2">day</option>
          </select>
        </div>
      </div>
    </div>
  </div>`
} 