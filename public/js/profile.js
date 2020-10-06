$(document).ready(function () {
    var readURL = function (input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader()
            reader.onload = function (e) {
                $('.avatar').replaceWith(`<img src="` + e.target.result + `" style="height: 200px;"
                                        class="avatar rounded-circle" alt="avatar">`)
                // $('.avatar').attr('src', e.target.result)
            }
            reader.readAsDataURL(input.files[0])
        }
    }

    $(document).on('change', '.file-upload', function () {
        readURL(this)
    })

    $(document).on('click', '#btn-show-profile', function () {
        $.ajax({
            url: '/auth/profile',
            method: 'GET',
            dataType: 'json',
            success: function (dt) {
                let { message, success } = dt
                if (success) {
                    $('#body-content').html(formProfile(message.firstname
                        , message.lastname, checkUnderfined(message.description)))
                } else window.location.href = '/login'
            },
            error: function (stt, err) {
                console.log(stt, err)
            }
        })
    })
    $(document).on('click', '#confirm-update-profile', function () {
        let firstname = $('#first_name').val()
        let lastname = $('#last_name').val()
        let description = $('#description').text()
        $.ajax({
            url: '/auth/profile',
            method: 'POST',
            dataType: 'json',
            data: {
                firstname: firstname,
                lastname: lastname,
                description: description
            },
            success: function (dt) {
                let { message, success } = dt
                if (success) {
                    $('#status-update').text(message)
                    $('#status-update').attr('class', 'text-info')
                    // $('#status-update').text(message)
                    // $('#status-update').attr('class', 'text-danger')
                } else window.location.href = '/login'
            },
            error: function (stt, err) {
                console.log(stt, err)
            }
        })
    })
})

function checkUnderfined(check) {
    if (check) return check
    else return ''
}

function formProfile(firstname, lastname, description) {
    return `
    <div class="container">
    <div class="row">
      <div class="col-sm-10">
        <h1>Information</h1>
      </div>
    </div>
    <div class="row">
      <div class="col-sm-3">
        <!--left col-->
        <div class="text-center">
            <img src="/img/testimonials-1.jpg" style="height: 200px;"
            class="avatar rounded-circle" alt="avatar">
              <div class="input-file-container">
            <input class="input-file file-upload" id="my-file" type="file">
            <label tabindex="0" for="my-file" class="input-file-trigger">PHOTO</label>
          </div>
        </div>
        </hr><br>
        <ul class="list-group">
          <li class="list-group-item text-muted">Activity <i class="fa fa-dashboard fa-1x"></i></li>
          <li class="list-group-item text-right"><span class="pull-left"><strong>Shares</strong></span> 125</li>
          <li class="list-group-item text-right"><span class="pull-left"><strong>Likes</strong></span> 13</li>
          <li class="list-group-item text-right"><span class="pull-left"><strong>Posts</strong></span> 37</li>
          <li class="list-group-item text-right"><span class="pull-left"><strong>Followers</strong></span> 78</li>
        </ul>
      </div>
      <!--/col-3-->
      <div class="col-sm-9">
        <ul class="nav nav-tabs" role="tablist">
          <li class="nav-item">
            <a class="nav-link active" data-toggle="tab" href="#profile">profile</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" data-toggle="tab" href="#change-password">change password</a>
          </li>
        </ul>


        <div class="tab-content">
          <div class="container tab-pane active" id="profile">
            <hr>
            <div >
              <div class="form-group">
                <div class="col-xs-6">
                  <label for="first_name">
                    <h4>First name</h4>
                  </label>
                  <input type="text" class="form-control" name="first_name" id="first_name" value="`+ firstname + `" placeholder="first name"
                    title="enter your first name if any.">
                </div>
              </div>
              <div class="form-group">

                <div class="col-xs-6">
                  <label for="last_name">
                    <h4>Last name</h4>
                  </label>
                  <input type="text" class="form-control" name="last_name" id="last_name" value="`+ lastname + `" placeholder="last name"
                    title="enter your last name if any.">
                </div>
              </div>
              <div class="form-group">
                <div class="col-xs-6">
                  <label for="description">
                    <h4>description</h4>
                  </label>
                  <textarea class="form-control" id="description" rows="3">`+ description + `</textarea>
                </div>
              </div>
              <div class="form-group">
                <div class="col-xs-12">
                  <br>
                  <button id="btn-update-profile" class="btn btn-lg btn-success" data-toggle="modal" data-target="#updateModal">Save</button>
                </div>
              </div>
              <div class="form-group">
                <strong id="status-update"></strong>
              </div>
            </div>

            <hr>

          </div>
          <!--/tab-pane-->
          <div class="container tab-pane" id="change-password">

            <hr>
            <div class="form" action="##" method="post" id="registrationForm">
              <div class="form-group">
                <div class="col-xs-6">
                  <label for="currentPassword">
                    <h4>Current password</h4>
                  </label>
                  <input type="password" class="form-control" name="currentPassword" id="current-password" placeholder="current password"
                    title="enter your password.">
                </div>
              </div>
              <div class="form-group">
                <div class="col-xs-6">
                  <label for="newPassword">
                    <h4>New password</h4>
                  </label>
                  <input type="password" class="form-control" name="newPassword" id="new-password" placeholder="new password"
                    title="enter your password.">
                </div>
              </div>
              <div class="form-group">

                <div class="col-xs-6">
                  <label for="repeatPassword">
                    <h4>Repeat password</h4>
                  </label>
                  <input type="password" class="form-control" name="repeatPassword" id="repeat-password" placeholder="repeat password"
                    title="enter your password.">
                </div>
              </div>
              <div class="form-group">
                <div class="col-xs-12">
                  <br>
                  <button id="btn-change-password" class="btn btn-lg btn-success" data-toggle="modal" data-target="#changePasswordModal">Save</button>
                </div>
              </div>
            </div>

          </div>
          <!--/tab-pane-->
        </div>
        <!--/tab-pane-->
      </div>
      <!--/tab-content-->

    </div>
    <!--/col-9-->
  </div>
  <!--/row-->
    `
}