$(() => {
  
  $('#btnViewReport').click(showReportData);
  $('#btnExportReport2Excel').click(openPrintReportWindow);
  $('#btnChartReport').click(showChartReport);
  // $('#btnPrintDailyReport').click(printDailyReportContent);
  showGuardReportPage();
  formatTodayReport();

})
  
  const arrCriteriaReport = [
    'Time per Route /Thời gian đi tuần(min)',
    'Expected Executed Routes/ Số lần đi tuần cần thực hiện (13hrs)',
    'Actual Executed Routes/ Số lần đi tuần thực tế',
    'Time spent on resolving non-conformities / Thời gian xử lý các tình huống bất thường (minutes)',
    'Missed routes due to resolving non-conformities/ Số lần tuần tra bị nhỡ do giải quyết sự cố',
    'Corrected Executed Routes/ Số lần đi tuần đã được hiệu chỉnh',
    'Performance Routes / Hiệu suất đi tuần theo số lần đi tuần (%)',
    'Successful routes within time schedule/ Số lần đi tuần trong thời gian cho phép',
    'Performance Timing / Hiệu suất đi tuần theo thời gian(%)',
    'Successful routes with correct routing/ Số lần đi tuần đi đúng thứ tự các điểm tuần tra',
    'Performance Routing/Hiệu suất đi tuần đi đúng các điểm tuần tra (%)',
    'Routing Mistakes/ Lỗi đi tuần',
    'Overall performance/Hiệu suất chung (%)',
    'Number of reports issued/ Số lượng sự cố được xử lý',
    'Actual Patrolling Time/ Thời gian làm việc (min)',
    'Allowed Interval between trip/ Thời gian nghỉ giữa các lần đi tuần cho phép (15x27)',
    'Total patroling time in minutes/ Thời gian đi tuần tính bằng phút',
    'Perfomance Time/ Hiệu suất thời gian %',
    'Total Idling Time/Thời gian không làm việc (min)',
    'Idling Time in %/ Thời gian không làm việc %',
  ]

  const arrReportCal = [1, 2, 3, 4, '5  =4:1', '6=3+5', '7=6:2', 8, '9=8:3', 10, '11=6:3', '', '12=7*9*11', 13, 14, 15, 16, 17, 18, 19];

  const arrPropsReport = ['iTime_per_Route', 'iExpected_Executed_Routes', 'iActual_Executed_Routes', 'iTime_spent_on_resolving_non_conformities', 'iMissed_routes_due_to_resolving_non_conformities', 'iCorrected_Executed_Routes', 'dPerformance_Routes', 'iSuccessful_routes_within_time_schedule', 'dPerformance_Timing', 'iSuccessful_routes_with_correct_routing', 'dPerformance_Routing', 'iRouting_Mistakes', 'dOverall_performance', 'iNumber_of_reports_issued', 'iActual_Patrolling_Time', 'iAllowed_Interval_between_trip', 'iTotal_patroling_time_in_minutes', 'dPerfomance_Time', 'iTotal_Idling_Time', 'dIdling_Time_in'];

  const unitsOfData = ['min', '', '', 'min', '', '', '%', '', '%','', '%', '', '%', '','min', 'min', 'min', '%', 'min', '%'];

  let currentDataChartTimePerformance = [];
  let currentDataChartPatrollingPerformance = [];
  let arrGuardList = [];
  let guardHeader = '';

  function showChartReport(){
    buildChartPatrollingPerformance();
    buildChartTimePerformance();
    $('.headerChartReport').text(guardHeader);
    $('#modalChartReport').modal('show');
  }

function buildChartPatrollingPerformance(id = 'chartPatrollingPerformance'){
  let $chartArea = $('<canvas style="width: 100%" height="300"></canvas>');
  $(`#${id}`).html($chartArea);
  let $chartPatrolling = $(`#${id} > canvas`);
  let ctx = $chartPatrolling[0].getContext('2d');
  var chartPatroll = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: [["Performance", "Routes"], ["Performance", "Timing"], ["Performance", "Routing"]],
        datasets: [{
            label: 'Performance',
            data: currentDataChartPatrollingPerformance,
            backgroundColor: [
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
      title: {
        display: true,
        text: 'Patrolling Performance'
      },
      responsive: true,
        scales: {
          xAxes: [{
            display: true,
            scaleLabel: {
                display: true,
            }
          }], 
          yAxes: [{
              ticks: {
                beginAtZero: true,
                // steps: 10,
                // stepValue: 20,
                stepSize: 10,
                max: 110,
                min: 0,
                callback: function(value, index, values) {
                    return value + "%";
                },
              },
              scaleLabel: {
                display: true,
                // labelString: '%'
              }
          }],
        }
    }
  });
  return chartPatroll;
}

function buildChartTimePerformance(id = 'chartTimePerformance'){
  let $chartArea = $('<canvas style="width: 100%" height="300"></canvas>');
  $(`#${id}`).html($chartArea);
  let $chartTiming = $(`#${id} > canvas`);
  let ctx = $chartTiming[0].getContext('2d');
  var chartTime = new Chart(ctx, {
    type: 'pie',
    data: {
        labels: ["Perfomance Time/ Hiệu suất thời gian %", "Idling Time in %/ Thời gian không làm việc %"],
        datasets: [{
            label: '# of Votes',
            data: currentDataChartTimePerformance,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
            ],
            borderColor: [
              'rgba(255,99,132,1)',
              'rgba(54, 162, 235, 1)',
            ],
            borderWidth: 1
        }]
    },
    options:{
      title: {
        display: true,
        text: 'Time Performance'
      },
      hover: {
        mode: 'nearest',
        intersect: true
      },
    }
  });
  return chartTime;
}

function renderReportTable(data){
  let $table = $('#tblReports');
  $table.html('');
  let $thead = $('<thead></thead>');
  let $tbody = $('<tbody></tbody>');

  $thead.html(`
      <tr>
        <th class="trn text-center">No./STT</th>
        <th class="trn">Criteria/Các tiêu chí</th>
        <th class="trn text-center">Cal/Tính</th>
        <th class="trn text-center">
          Patrol Guard Route/Tuyến tuần tra</br>
          (Route 1 Checkpoint 1-17)
        </th>
      </tr>
    `)
  if (data) {
    for(let i = 0; i < 20; i++){
      $tbody.append(`
        <tr>
          <td class="text-center">${i + 1}</td>
          <td>${arrCriteriaReport[i]}</td>
          <td class="text-center">${arrReportCal[i]} ${unitsOfData[i]}</td>
          <td class="text-center">${data[0][arrPropsReport[i]]}</td>
        </tr>
      `)
    }
  }
  $table.append($thead).append($tbody);
}

function showTimeReportOnHeader(time){
  $('.fromDateReport').text(`${time} 11:00AM`);
  $('.toDateReport').text(`${time} 11:59PM`);
}

async function showReportData(){
  let id = $('#jcomboboxGuardReport').val();
  if(!id) GuardID = 1;
  else GuardID = Number(id);
  let time = $('#reportDatetime').val();
  if(time == '') return alert('No date time submitted');
  showTimeReportOnHeader(time);
  let dDateTime = changeFormatDateTime(time);
  let sentData = { GuardID, dDateTime }
  const data = await Service.getReportData(sentData);
  let guard = arrGuardList.find(g => g.iGuardId == GuardID);
  if (guard) {
    const { sGuardName } = guard;
    guardHeader = `${sGuardName} - ${time}`;
  }
  $('.headerTblReport').text(guardHeader);
  renderReportTable(data);

  if(data){
    const { dIdling_Time_in, dPerfomance_Time, dPerformance_Routes, dPerformance_Routing, dPerformance_Timing } = data[0];

    currentDataChartTimePerformance = [Number(dIdling_Time_in), Number(dPerfomance_Time)];
    currentDataChartPatrollingPerformance = [Number(dPerformance_Routes), Number(dPerformance_Timing), Number(dPerformance_Routing)];
  }else{
    currentDataChartTimePerformance = [];
    currentDataChartPatrollingPerformance = [];
  }
}

function renderGuardCombobox(data){
  $('#jcomboboxGuardReport').html('');
  if(data){
    data.forEach(guard => {
      const { iGuardId, sGuardName } = guard;
      $('#jcomboboxGuardReport').append(`<option value="${iGuardId}">${sGuardName}</option>`)
    })
  }
}

async function showGuardReportPage(){
  const data = await Service.getGuardsData();
  if(data) arrGuardList = data;
  else arrGuardList.length = 0;
  renderGuardCombobox(data);
}

function formatTodayReport() {
  $('#reportDatetime').val(formatToday());
  showReportData();
}

function export2Excel(){
  $("#tblReports").table2excel({
    // exclude CSS class
    // exclude: ".noExl",
    name: "Report",
    filename: "report",//do not include extension
    // fileext: ".xls",
    // exclude_img: true,
    // exclude_links: true,
    // exclude_inputs: true
  });
}
  
function openPrintReportWindow(){
  buildChartPatrollingPerformance('printingPatrollingPerformanceChart')
  buildChartTimePerformance('printingTimePerformanceChart');
  let head = renderHeadOfPage();
  let script = renderScript();
  setTimeout(() => {
    let report = $('.printing-area').html();
    console.log(report);
  let html = `<html>
                  ${head}
                <body>
                  ${report}
                </body>
              </html>`;
    let windowObject = window.open("", "PrintWindow",
    "width=850,height=650,top=50,left=50,toolbars=no,scrollbars=yes,status=no,resizable=yes");
    windowObject.document.write(html);
    windowObject.document.write('<script type="text/javascript">$(window).load(function() { window.print(); window.close(); });</script>');
    windowObject.document.close();
    windowObject.focus();
  }, 500);
}

// function openPrintModalPrintingReport(){
//   let content = $('.card-daily-report-of-guard').html();
//   $('#modalPrintReport').find('.modal-body').html(content);
//   $('#modalPrintReport').modal('show');
// }

function renderHeadOfPage(){
  let head = `<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">

    <!-- font awesome css -->
    <link rel="stylesheet" href="../plugins/font-awesome-4.7.0/css/font-awesome.min.css">

    <!-- Bootstrap core css -->
    <link rel="stylesheet" href="../MDB Free/css/bootstrap.min.css">

    <!-- Meterial Design Bootstrap -->
    <link rel="stylesheet" href="../MDB Free/css/mdb.min.css">

    <!-- datepicker css -->
    <link rel="stylesheet" href="../plugins/bootstrap-datetimepicker/css/bootstrap-datepicker3.min.css">

    <!-- bootstrap datetime picker css -->
    <link rel="stylesheet" href="../plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css">

    <!-- custom main css -->
    <link rel="stylesheet" href="../custom/css/main.css">

    <title>Report</title>
  </head>`
  return head;
}

function renderScript(){
  let script = `<script src="../plugins/chartJS/Chart.min.js"></script>`;
  return script;
}

function printDailyReportContent(){
  $('#modalPrintReport').modal('hide');
  setTimeout(() => {
    $('#modalPrintReport').find('.modal-body').printElement();
  }, 200);
}