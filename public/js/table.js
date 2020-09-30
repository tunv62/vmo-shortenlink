$(document).ready(function(){
    $(document).on('click', '#btn-dashboard', function(){
        $('#body-content').html(formDataTable())
        $('#dataTable').DataTable({
          "columnDefs": [
            { className: "text-center", "targets": [5,6] }
          ]
        })
    })
})

function formDataTable(){
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
                <th>Name</th>
                <th>Position</th>
                <th>Office</th>
                <th>Age</th>
                <th>Start date</th>
                <th>Salary</th>
                <th>option</th>
              </tr>
            </thead>
            <tfoot>
              <tr>
                <th>Name</th>
                <th>Position</th>
                <th>Office</th>
                <th>Age</th>
                <th>Start date</th>
                <th>Salary</th>
                <th>option</th>
              </tr>
            </tfoot>
            <tbody>
              <tr>
                <td>Tiger Nixon</td>
                <td>System Architect</td>
                <td>Edinburgh</td>
                <td>61</td>
                <td>2011/04/25</td>
                <td>$320,800</td>
                <td>
                  <span class="hover-icon" style="color: cyan;"><i class="fas fa-edit"></i></span>
                  <span>---</span>
                  <span class="hover-icon" style="color: red;"><i class="fas fa-trash-alt"></i></span>
                </td>
                
              </tr>
              <tr>
                <td>Tiger Nixon</td>
                <td>System Architect</td>
                <td>Edinburgh</td>
                <td>61</td>
                <td>2011/04/25</td>
                <td>$320,800</td>
                <td>
                  <span class="hover-icon"><i class="fas fa-edit hover-icon"></i></span>
                  <span class="hover-icon"><i class="fas fa-trash-alt hover-icon"></i></span>
                </td>
                
              </tr>
              <tr>
                <td>Tiger Nixon</td>
                <td>System Architect</td>
                <td>Edinburgh</td>
                <td>61</td>
                <td>2011/04/25</td>
                <td>$320,800</td>
                <td>
                  <span class="hover-icon"><i class="fas fa-edit"></i></span>
                  <span class="hover-icon"><i class="fas fa-trash-alt"></i></span>
                </td>
                
              </tr>
              <tr>
                <td>Tiger Nixon</td>
                <td>System Architect</td>
                <td>Edinburgh</td>
                <td>61</td>
                <td>2011/04/25</td>
                <td>$320,800</td>
                <td>
                  <span class="center"><i class="fas fa-edit"></i></span>
                  <span class="center"><i class="fas fa-trash-alt"></i></span>
                </td>
                
              </tr>
              <tr>
                <td>Tiger Nixon</td>
                <td>System Architect</td>
                <td>Edinburgh</td>
                <td>61</td>
                <td>2011/04/25</td>
                <td>$320,800</td>
                <td>
                  <span class="center"><i class="fas fa-edit"></i></span>
                  <span class="center"><i class="fas fa-trash-alt"></i></span>
                </td>
                
              </tr>
        
            </tbody>
          </table>
        </div>
      </div>
    </div>
</div>
    `
}