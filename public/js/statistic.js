

// Set new default font family and font color to mimic Bootstrap's default styling


$(document).ready(function(){
    $(document).on('click', '.btn-area-chart', function(){
        let idLink = $(this).parent().parent().attr('id')
        console.log('check-----' + idLink)
        
        $.ajax({
            url: '/auth/user/statistic',
            method: 'POST',
            dataType: 'json',
            data:{ id: idLink },
            success: function(dt){
                let { message, success } = dt
				console.log(success)
				if (success) {
					if (message) {
                        $('#body-content').html(formStatistic())
                        console.log(message)
                        // var ctx = $("#myAreaChart")
                        //configLineChart(ctx)
                    }
					else alert('wrong')
				} else window.location.href = '/login'
            },
            error: function(stt, err){
                console.log(stt, err)
            }
        })

        
    })
})

function getSevenDaysAgo(date) {
    return new Promise(resolve => {
        var days = []
        for (let i = 0; i < 7; i++) {
            days.push(date.toString())
            date.setDate(date.getDate() - 1)
        }
        const reserse = days.reverse()
        return resolve(reserse)
    })
}

function fiterIndexStartOfData(days, data) {
    return new Promise(resolve => {
        let start = 0
        let startDate = new Date(days[0])
        startDate.setHours(00)
        startDate.setMinutes(00)
        startDate.setSeconds(00)
        for (let i = 0; i < data.length; i++) {
            let d = new Date(data[i])
            if (startDate > d) start = i + 1
            else break
        }
        console.log(start)
        return resolve(start)
    })
}

function filterIndexStartOfDays(days, dt) {
    return new Promise(resolve => {
        let start = 0
        let startDate = new Date(dt)
        startDate.setHours(00)
        startDate.setMinutes(00)
        startDate.setSeconds(00)
        for (let i = 0; i < days.length; i++) {
            if (startDate > new Date(days[i])) start = i + 1
            else break
        }
        console.log(start)
        return resolve(start)
    })
}

function countClicksAWeek(days, indexDay, indexData, data) {
    return new Promise(resolve => {
        let count = [0, 0, 0, 0, 0, 0, 0]
        for (let i = indexData; i < data.length; i++) {
            let temp = data[i].slice(4, 15)
            for (let j = indexDay; j < days.length; j++) {
                if (temp == days[j].slice(4, 15)) {
                    count[j] += 1
                    break
                }
            }
        }
        return resolve(count)
    })
}

async function processData(data) {
    try {
        let days = await getSevenDaysAgo(new Date())
        let indexOfData = await fiterIndexStartOfData(days, data)
        if ( indexOfData > data.length - 1) indexOfData = data.length - 1
        let indexOfDays = await filterIndexStartOfDays(days, data[indexOfData])
        if ( indexOfDays > days.length - 1) indexOfDays = days.length - 1
        let result = await countClicksAWeek(days, indexOfDays, indexOfData, data)
        configLineChart(result)
    } catch (e) {
        console.log(e)
    }
}

// Area Chart Example
Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';

function configLineChart(dt){
var ctx = document.getElementById("myAreaChart");
var myLineChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [{
      label: "clicks",
      lineTension: 0.3,
      backgroundColor: "rgba(78, 115, 223, 0.05)",
      borderColor: "rgba(78, 115, 223, 1)",
      pointRadius: 3,
      pointBackgroundColor: "rgba(78, 115, 223, 1)",
      pointBorderColor: "rgba(78, 115, 223, 1)",
      pointHoverRadius: 3,
      pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
      pointHoverBorderColor: "rgba(78, 115, 223, 1)",
      pointHitRadius: 10,
      pointBorderWidth: 2,
      data: dt,
    }],
  },
  options: {
    maintainAspectRatio: false,
    layout: {
      padding: {
        left: 10,
        right: 25,
        top: 25,
        bottom: 0
      }
    },
    scales: {
      xAxes: [{
        time: {
          unit: 'date'
        },
        gridLines: {
          display: false,
          drawBorder: false
        },
        ticks: {
          maxTicksLimit: 7
        }
      }],
      yAxes: [{
        ticks: {
          maxTicksLimit: 5,
          padding: 10,
          // Include a dollar sign in the ticks
          callback: function(value, index, values) {
            return '$' + number_format(value);
          }
        },
        gridLines: {
          color: "rgb(234, 236, 244)",
          zeroLineColor: "rgb(234, 236, 244)",
          drawBorder: false,
          borderDash: [2],
          zeroLineBorderDash: [2]
        }
      }],
    },
    legend: {
      display: false
    },
    tooltips: {
      backgroundColor: "rgb(255,255,255)",
      bodyFontColor: "#858796",
      titleMarginBottom: 10,
      titleFontColor: '#6e707e',
      titleFontSize: 14,
      borderColor: '#dddfeb',
      borderWidth: 1,
      xPadding: 15,
      yPadding: 15,
      displayColors: false,
      intersect: false,
      mode: 'index',
      caretPadding: 10,
      callbacks: {
        label: function(tooltipItem, chart) {
          var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
          return datasetLabel + ': $' + number_format(tooltipItem.yLabel);
        }
      }
    }
  }
})
}

function number_format(number, decimals, dec_point, thousands_sep) {
  // *     example: number_format(1234.56, 2, ',', ' ');
  // *     return: '1 234,56'
  number = (number + '').replace(',', '').replace(' ', '');
  var n = !isFinite(+number) ? 0 : +number,
    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
    sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
    dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
    s = '',
    toFixedFix = function(n, prec) {
      var k = Math.pow(10, prec);
      return '' + Math.round(n * k) / k;
    };
  // Fix for IE parseFloat(0.55).toFixed(0) = 0;
  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
  if (s[0].length > 3) {
    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
  }
  if ((s[1] || '').length < prec) {
    s[1] = s[1] || '';
    s[1] += new Array(prec - s[1].length + 1).join('0');
  }
  return s.join(dec);
}

function formStatistic(){
    return `
    <div class="container">
    <!-- Content Row -->
    <div class="row">

        <!-- Earnings (Monthly) Card Example -->
        <div class="col-xl-3 col-md-6 mb-4">
          <div class="card border-left-primary shadow h-100 py-2">
            <div class="card-body">
              <div class="row no-gutters align-items-center">
                <div class="col mr-2">
                  <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">Earnings (Monthly)</div>
                  <div class="h5 mb-0 font-weight-bold text-gray-800">$40,000</div>
                </div>
                <div class="col-auto">
                  <i class="fas fa-calendar fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Earnings (Monthly) Card Example -->
        <div class="col-xl-3 col-md-6 mb-4">
          <div class="card border-left-success shadow h-100 py-2">
            <div class="card-body">
              <div class="row no-gutters align-items-center">
                <div class="col mr-2">
                  <div class="text-xs font-weight-bold text-success text-uppercase mb-1">Earnings (Annual)</div>
                  <div class="h5 mb-0 font-weight-bold text-gray-800 scroll-top">
                    <p>$215,000</p> 
                    <p>343434</p>
                  </div>
                </div>
                <div class="col-auto">
                  <i class="fas fa-dollar-sign fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div class="row">
        <div class="col-xl-12 col-lg-12">
            <div class="card shadow mb-4">
              <!-- Card Header - Dropdown -->
              <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                <h6 class="m-0 font-weight-bold text-primary">Earnings Overview</h6>
                <div class="dropdown no-arrow">
                  <a class="dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <i class="fas fa-ellipsis-v fa-sm fa-fw text-gray-400"></i>
                  </a>
                  <div class="dropdown-menu dropdown-menu-right shadow animated--fade-in" aria-labelledby="dropdownMenuLink">
                    <div class="dropdown-header">Dropdown Header:</div>
                    <a class="dropdown-item" href="#">Action</a>
                    <a class="dropdown-item" href="#">Another action</a>
                    <div class="dropdown-divider"></div>
                    <a class="dropdown-item" href="#">Something else here</a>
                  </div>
                </div>
              </div>
              <!-- Card Body -->
              <div class="card-body">
                <div class="chart-area">
                  <canvas id="myAreaChart"></canvas>
                </div>
              </div>
            </div>
          </div>
      </div>

      
  </div>
  <!--/row-->
    `
}