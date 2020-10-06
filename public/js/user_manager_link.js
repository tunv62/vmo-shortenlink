$(document).ready(function () {
	$(document).on('click', '#btn-dashboard', function () {
		$.ajax({
			url: '/auth/user/get-info-shortenlink',
			method: 'GET',
			dataType: 'json',
			success: function (dt) {
				let { message, success } = dt
				if ( success ) {
					$('#body-content').html(formDataTable(message))
					$('#dataTable').DataTable({
						"columnDefs": [
							{ className: "text-center", "targets": [2,4,5, 7] }
						]
					})
				}else window.location.href = '/login'
			},
			error: function (stt, err) {
				console.log(stt, err)
			}
		})
	})

	//update link
	var trUpdate = {
		_id: '', shortUrl: '', longUrl: '',
		isBlock: '', createAt: '', clicks: '', 
		password: '', expire: ''
	}
	$(document).on('click', '.btn-update-link', function(){
		let idUpdateLink = $(this).parent().parent().attr('id')
		let isBlock = $(this).parent().parent().attr('class')
		console.log(typeof isBlock)
		let shortUrl = $(this).parent().parent().find('td:eq(0)').html()
		let longUrl = $(this).parent().parent().find('td:eq(1)').html()
		let status = $(this).parent().parent().find('td:eq(2)').html()
		let createAt = $(this).parent().parent().find('td:eq(3)').html()
		let clicks = $(this).parent().parent().find('td:eq(4)').html()
		let password = $(this).parent().parent().find('td:eq(5)').html()
		let expire = $(this).parent().parent().find('td:eq(6)').html()
		//console.log($(this).parent().parent().attr('id'))
		trUpdate._id = idUpdateLink
		trUpdate.shortUrl = shortUrl
		trUpdate.longUrl = longUrl
		trUpdate.isBlock = isBlock
		trUpdate.createAt = createAt
		trUpdate.clicks = clicks
		trUpdate.password = password
		trUpdate.expire = expire
		$('#shortUrl').val(shortUrl)
		$('#longUrl').val(longUrl)
		$('#status-link').html(status)
		$('#password').val(password)
		$('#custom-link').val('')
		$('#expire').val('')
		$('#update-show-error').val('')
		$('#UpdateLinkModal').modal('show')
	})
	$(document).on('click', '#confirm-update-link', function(){
		let password =  $('#password').val()
		let customLink = $('#custom-link').val()
		let expire = $('#expire').val()
		let selected = $('#select-option').find(":selected").val()
		if ( expire && selected) {
			if (selected === '0') {
				let date = new Date()
				date.setMinutes(date.getMinutes() + parseInt(expire))
				trUpdate.expire = date
			} else if (selected === '1') {
				let date = new Date()
				date.setHours(date.getHours() + parseInt(expire) )
				trUpdate.expire = date
			} else if (selected === '2') {
				let date = new Date()
				date.setDate(date.getDate() + parseInt(expire))
				trUpdate.expire = date
			}
		}
		if (password) trUpdate.password = password
		if (customLink) trUpdate.shortUrl = customLink
		$.ajax({
			url: '/auth/user/update-info-shortenlink',
			method: 'PUT',
			dataType: 'json',
			data: {
				id: trUpdate._id,
				password: password,
				customLink: customLink,
				expire: expire,
				selected: selected
			},
			success: function(dt){
				let { message, success } = dt
				console.log(success)
				if (success) {
					if (message) $('#update-show-error').text(message)
					else {
						//$('#update-show-error').text('')
						$('#UpdateLinkModal').modal('hide')
						$('tr#'+ trUpdate._id).replaceWith(updateTrTable(trUpdate))
					}
				} else window.location.href = '/login'
				$('tr#'+ trUpdate._id).fadeOut()
				$('tr#'+ trUpdate._id).fadeIn()
			},
			error: function(stt, err){
				console.log(stt, err)
			}
		})
	})

	//delete row
	var idDelete = ''
	$(document).on('click', '.btn-delete-link', function(){
		idDelete = $(this).parent().parent().attr('id')
		//$('#delete-show-error').text('')
		$('#deleteLinkModal').modal('show')
		$('#delete-show-error').text('')
	})
	$(document).on('click', '#confirm-delete-link', function(){
		$.ajax({
			url: '/auth/user/delete-info-shortenlink',
			method: 'DELETE',
			dataType: 'json',
			data: { id: idDelete},
			success: function(dt){
				let { message, success } = dt
				if (success) {
					if (message) $('#delete-show-error').text(message)
					else {
						$('tr#'+ idDelete).fadeOut()
						//$('#delete-show-error').text('')
						$('#deleteLinkModal').modal('hide')
						//$('tr#'+ idDelete).replaceWith(updateTrTable(trUpdate))
						$('tr#'+ idDelete).remove()
					}
				} else window.location.href = '/login'
				
				// $('tr#'+ idDelete).fadeIn()
			},
			error: function(stt, err){
				console.log(stt, err)
			}
		})
	})
})

// update form
function checkStatusUpdate(isBlock, expire){
	if (isBlock === 'true') return '<span class="bg-danger text-white">Blocked</span>'
	else if (expire){
		if ( new Date(expire) <= Date.now()) 
			return '<span class="bg-warning text-dark">Expired</span>'
	}
	return '<span class="bg-info text-dark">Active</span>'
}

function updateTrTable(link) {
	let result = ''
	result += `
		<tr id="`+ link._id +`" class="`+ link.isBlock +`">
			<td>`+link.shortUrl+`</td>
			<td>  <div class=scrollable> `+link.longUrl+` </div> </td>
			<td class="text-center">`+checkStatusUpdate(link.isBlock ,link.expire)+`</td>
			<td>`+parseDate(link.createAt)+`</td>
			<td class="text-center">`+link.clicks+`</td>
			<td class="text-center">`+checkUnderfined(link.password)+`</td>
			<td>`+parseDate(link.expire)+`</td>
			<td class="text-center">

			<span class="hover-icon btn-area-chart">
			<i class="fas fa-cubes fa-lg"></i></span>
				<span class="hover-icon btn-update-link"><i class="fas fa-edit fa-lg"></i></span>
				
				<span class="hover-icon btn-delete-link"><i class="fas fa-trash-alt fa-lg"></i></span>
			</td>
		</tr>
		`
	return result
}

//
function checkStatus(isBlock, expire){
	if (isBlock) return '<span class="bg-danger text-white">Blocked</span>'
	else if (expire){
		if ( new Date(expire) <= Date.now()) 
			return '<span class="bg-warning text-dark">Expired</span>'
	}
	return '<span class="bg-info text-dark">Active</span>'
}

function checkUnderfined(check){
	if (check) return check
	else return ''
}

function parseDate(date){
	if (date) {
		let dt = new Date(date).toString()
		var arr = dt.split('GMT')
		// console.log('why------')
		// console.log(arr)
		return arr[0]
	} 
	else return ''
}

function formatData(dt) {
	let result = ''
	for (let link of dt) {
		result += `
		<tr id="`+ link._id +`" class="`+ link.isBlock +`">
			<td>`+link.shortUrl+`</td>
			<td>  <div class=scrollable> `+link.longUrl+` </div> </td>
			<td>`+checkStatus(link.isBlock ,link.expire)+`</td>
			<td>`+parseDate(link.createAt)+`</td>
			<td>`+link.clicks+`</td>
			<td>`+checkUnderfined(link.password)+`</td>
			<td>`+parseDate(link.expire)+`</td>
			<td>
			<span class="hover-icon btn-area-chart">
			<i class="fas fa-cubes fa-lg" aria-hidden="true"></i></span>
				
				<span class="hover-icon btn-update-link">
					<i class="fas fa-edit fa-lg"></i></span>
				
				<span class="hover-icon btn-delete-link">
					<i class="fas fa-trash-alt fa-lg"></i></span>
			</td>
		</tr>
		`
	}
	return result
	
}

function formDataTable(data) {
	return `
    <div class="container-fluid">
    <!-- Page Heading -->
    <h1 class="h3 mb-2 text-gray-800">shortenLink Manager</h1>
    
    <!-- DataTales Example -->
    <div class="card shadow mb-4">
      <div class="card-header py-3">
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-bordered" id="dataTable" width="100%" cellspacing="0">
            <thead>
              <tr>
                <th>ShortUrl</th>
                <th>LongUrl</th>
                <th>Status</th>
                <th>Create at</th>
                <th>Clicks</th>
				<th>Password</th>
				<th>Expire</th>
                <th>Option</th>
              </tr>
            </thead>
            <tfoot>
              <tr>
			  <th>ShortUrl</th>
			  <th>LongUrl</th>
			  <th>Status</th>
			  <th>Create at</th>
			  <th>Clicks</th>
			  <th>Password</th>
			  <th>Expire</th>
			  <th>Option</th>
              </tr>
            </tfoot>
			<tbody>
			`+ formatData(data) +`
            </tbody>
          </table>
        </div>
      </div>
    </div>
</div>
    `
}