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
	var id = ''
	$(document).on('click', '.btn-update-link', function(){
		id = $(this).attr('id')
		let shortUrl = $(this).parent().parent().find('td:eq(0)').html()
		let longUrl = $(this).parent().parent().find('td:eq(1)').html()
		let status = $(this).parent().parent().find('td:eq(2)').html()
		let password = $(this).parent().parent().find('td:eq(5)').html()
		console.log($(this).parent().parent())
		$('#shortUrl').val(shortUrl)
		$('#longUrl').val(longUrl)
		$('#status-link').html(status)
		$('#password').val(password)
		$('#UpdateLinkModal').modal('show')
	})
	$(document).on('click', '#confirm-update-link', function(){
		let password =  $('#password').val()
		let customLink = $('#custom-link').val()
		let expire = $('#expire').val()
		let selected = $('#select-option').find(":selected").val()
		$.ajax({
			url: '/auth/user/update-info-shortenlink',
			method: 'PUT',
			dataType: 'json',
			data: {
				id: id,
				password: password,
				customLink: customLink,
				expire: expire,
				selected: selected
			},
			success: function(dt){
				let { message, success } = dt
				if (success) {
					if (message)
						$('#update-show-error').text(message)
					else {
						$('#update-show-error').text('')
						$('#UpdateLinkModal').modal('hide')
					}
				} else {
					window.location.href = '/login'
					// $('#UpdateLinkModal').modal('hide')
				}
			},
			error: function(stt, err){
				console.log(stt, err)
			}
		})
	})
})
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
		<tr>
			<td>`+link.shortUrl+`</td>
			<td>`+link.longUrl+`</td>
			<td>`+checkStatus(link.isBlock ,link.expire)+`</td>
			<td>`+parseDate(link.createAt)+`</td>
			<td>`+link.clicks+`</td>
			<td>`+checkUnderfined(link.password)+`</td>
			<td>`+parseDate(link.expire)+`</td>
			<td>
				<span id="`+ link._id +`" class="hover-icon btn-update-link" data-target="#UpdateLinkModal"><i class="fas fa-edit fa-lg"></i></span>
				<span>-</span>
				<span id="`+ link._id +`" class="hover-icon btn-delete-link"><i class="fas fa-trash-alt fa-lg"></i></span>
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
        <h6 class="m-0 font-weight-bold text-primary">DataTables</h6>
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