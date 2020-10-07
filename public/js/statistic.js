

// Set new default font family and font color to mimic Bootstrap's default styling

var dataOfChart = []
$(document).ready(function(){
    $(document).on('click', '.btn-area-chart', function(){
        let idLink = $(this).parent().parent().attr('id')
        $.ajax({
            url: '/auth/user/statistic',
            method: 'POST',
            dataType: 'json',
            data:{ id: idLink },
            success: function(dt){
                let { message, success } = dt
				if (success) {
					if (message) {
                        $('#body-content').html(formStatistic())
                        processDataOfChart(message, 7)
                        dataOfChart = message.slice()
                    }
					else alert('wrong ,you have to refresh page')
				} else window.location.href = '/login'
            },
            error: function(stt, err){
                console.log(stt, err)
            }
        })
    })

    $(document).on('click', '#btn-chart-link-week', function(){
        if (dataOfChart.length > 0) {
            $('#myAreaChart').remove() // this is my <canvas> element
            $('.chart-area').append('<canvas id="myAreaChart"><canvas>')
            processDataOfChart(dataOfChart, 7)
        }
    })

    $(document).on('click', '#btn-chart-line-month', function(){
        if (dataOfChart.length > 0) {
            $('#myAreaChart').remove() // this is my <canvas> element
            $('.chart-area').append('<canvas id="myAreaChart"><canvas>')
            processDataOfChart(dataOfChart, 30)
        }
    })
})
// week
async function processDataOfChart(data, number) {
    try {
      if (data.length > 0){
        let days = await getNumberDaysAgo(new Date(), number)
        let indexOfData = await fiterIndexStartOfData(days, data)
        if ( indexOfData > data.length - 1) indexOfData = data.length - 1
        let indexOfDays = await filterIndexStartOfDays(days, data[indexOfData])
        if ( indexOfDays > days.length - 1) indexOfDays = days.length - 1
        let result = await countClicksAWeek(days, indexOfDays, indexOfData, data)
        configLineChart(result, days)
      }
    } catch (e) {
        console.log(e)
    }
}

function getNumberDaysAgo(date, number) {
    return new Promise(resolve => {
        var days = []
        // console.log(typeof number)
        for (let i = 0; i < number; i++) {
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
        // console.log(start)
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
        // console.log(start)
        return resolve(start)
    })
}

function countClicksAWeek(days, indexDay, indexData, data) {
    return new Promise(resolve => {
        // if (days.length > 7) 
        //     let count = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        // else let count = [0, 0, 0, 0, 0, 0, 0]
        let count = Array.apply(null, Array(days.length)).map(function(){return 0})
        
        for (let i = indexData; i < data.length; i++) {
            let temp = data[i].slice(4, 15)
            for (let j = indexDay; j < days.length; j++) {
                if (temp == days[j].slice(4, 15)) {
                    count[j] += 1
                    break
                }
            }
        }
        // console.log(count.join('-'))
        return resolve(count)
    })
}
// end week

// Area Chart Example
Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';
// var dataOfChart = []
// var labelOfWeek = []
// var labelOfMonth = []

function proccessLable(days){ // 0 is week, 1 is month
    if (days.length < 8) 
        for (let i = 0; i < days.length; i++)
            days[i] = days[i].slice(0, 15)
    else 
        for (let i = 0; i < days.length; i++)
            days[i] = days[i].slice(4, 15)
    return days
}

function getTopAndTotal(dt, days, number){
    let top = Array.apply(null, Array(number+2)).map(function(){ return 0})
    top[top.length-1] = 100000
    let sum = 0
    let top1 = Array.apply(null, Array(number+2)).map(function(){ return ''})
    for (let i = 0; i < dt.length; i++){
        sum += dt[i]
        for (let j = 1; j < top.length; j++){
            if (dt[i] <= top[j]) {
                if (dt[i] !== 0) {
                    let getB = top[j-1]
                    let setA = 0
                    let getB1 = top1[j-1]
                    let setA1 = ''
                    for (let k = j-1; k > 0; k--){
                        
                        setA = top[k-1]
                        top[k-1] = getB
                        getB = setA

                        setA1 = top1[k-1]
                        top1[k-1] = getB1
                        getB1 = setA1
                        
                    }
                    top[j-1] = dt[i]
                    top1[j-1] = days[i]
                }
                break
            }
        }
    }
    top1.pop()
    top1.shift()
    setValueOfTopAndTotal(top1, sum)
}

function setValueOfTopAndTotal(top, sum){
    $('.total-access').text(sum)
    $('.top1').text(top[top.length - 1])
    $('.top2').text(top[top.length - 2])
    $('.top3').text(top[top.length - 3])
}

function configLineChart(dt, days){
var ctx = document.getElementById("myAreaChart")
var myLineChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: proccessLable(days),
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
          maxTicksLimit: 5
        }
      }],
      yAxes: [{
        ticks: {
          maxTicksLimit: 5,
          padding: 10,
          // Include a dollar sign in the ticks
          callback: function(value, index, values) {
            return 'clicks:' + number_format(value);
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
          return datasetLabel + ':' + number_format(tooltipItem.yLabel);
        }
      }
    }
  }
})
getTopAndTotal(dt, days, 3)
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
              <div class="row no-gutters align-items-center card-total">
                <div class="col mr-2">
                <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">Total of Access</div>
                <div class="h5 mb-0 font-weight-bold text-gray-800 total-access">0</div>
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
              <div class="row no-gutters align-items-center card-top">
                <div class="col mr-2">
                    <div class="text-sm font-weight-bold text-warning text-uppercase mb-1 top1">Top</div>
                    <div class="text-sm font-weight-bold text-secondary text-uppercase mb-1 top2">Top</div>
                    <div class="text-sm font-weight-bold text-info text-uppercase mb-1 top3">Top</div>
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
                <h6 class="m-0 font-weight-bold text-primary">the number of access</h6>
                <div class="dropdown no-arrow">
                  <a class="dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <i class="fas fa-ellipsis-v fa-sm fa-fw text-gray-400"></i>
                  </a>
                  <div class="dropdown-menu dropdown-menu-right shadow animated--fade-in" aria-labelledby="dropdownMenuLink">
                  <div class="dropdown-header">Option:</div>
                  <button id="btn-chart-link-week" class="dropdown-item">a week</button>
                  <button id="btn-chart-line-month" class="dropdown-item">a Month</button>
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