$(document).ready(function () {
	$(document).on('click', '#btn-dashboard', function () {
		$.ajax({
			url: '/auth/user/get-shortenlink',
			method: 'GET',
			dataType: 'json',
			success: function (dt) {
				let { data } = dt
				$('#body-content').html(formDataTable(data))
				$('#dataTable').DataTable({
					"columnDefs": [
					    { className: "text-center", "targets": [2,4,5, 7] }
					]
				})
			},
			error: function (stt, err) {
				console.log(stt, err)
			}
		})
		// $('#body-content').html(formDataTable())
		// $('#dataTable').DataTable({
		//   "columnDefs": [
		//     { className: "text-center", "targets": [5,6] }
		//   ]
		// })
	})
})
function checkStatus(isBlock, expire){
	if (isBlock) return '<span class="bg-danger text-dark">Blocked</span>'
	else if (expire){
		if ( Date.parse(expire)  <= Date.now()) return '<span class="bg-warning text-dark">Expired</span>'
	} else return '<span class="bg-info text-dark">Active</span>'
}

function checkUnderfined(check){
	if (check) return check
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
			<td>`+link.createAt+`</td>
			<td>`+link.clicks+`</td>
			<td>`+checkUnderfined(link.password)+`</td>
			<td>`+checkUnderfined(link.expire)+`</td>
			<td>
				<span class="hover-icon"><i class="fas fa-edit fa-lg"></i></span>
				<span>-</span>
				<span class="hover-icon"><i class="fas fa-trash-alt fa-lg"></i></span>
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
    <h1 class="h3 mb-2 text-gray-800">Tables</h1>
    <p class="mb-4">DataTables is a third party plugin that is used to generate the demo table below. For more information about DataTables, please visit the <a target="_blank" href="https://datatables.net">official DataTables documentation</a>.</p>

    <!-- DataTales Example -->
    <div class="card shadow mb-4">
      <div class="card-header py-3">
        <h6 class="m-0 font-weight-bold text-primary">DataTables Example</h6>
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