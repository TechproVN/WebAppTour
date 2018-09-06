$(async () => {
  
  $('#btnViewReport').click(() => {
    showReportData();
    setTimeout(() => {
      buildChartPatrollingPerformance('printingPatrollingPerformanceChart')
      buildChartTimePerformance('printingTimePerformanceChart');
    }, 500);
  });
  $('#btnExportReport2Excel').click(openPrintReportWindow);
  $('#btnChartReport').click(showChartReport);
  $('#btnEnterManager').click(showModalEnterManager);
  $('#btnSaveManagerName').click(saveManagerName);
  arrRoutes = await showRouteList();
  formatTodayReport();

})
  let chartTime = null;
  let chartPatrolling = null;
  let arrRoutes = [];
  let currentOverallPerformance = 0;

  const arrCriteriaReport = [
    'Time per Route (min)',
    'Expected Executed Routes',
    'Actual Executed Routes',
    'Time spent on resolving non-conformities (minutes)',
    'Missed routes due to resolving non-conformities',
    'Corrected Executed Routes',
    'Performance Routes (%)',
    'Successful routes within time schedule',
    'Performance Timing (%)',
    'Successful routes with correct routing',
    'Performance Routing (%)',
    'Routing Mistakes',
    'Overall performance (%)',
    'Number of reports issued',
    'Actual Patrolling Time (min)',
    'Allowed Interval between trip',
    'Total patroling time in minutes',
    'Perfomance Time %',
    'Total Idling Time (min)',
    'Idling Time in %',
  ]

  const arrCriteriaReport_1 = [
    'Time per Route /Thời gian đi tuần(min)',
    'Expected Executed Routes/ Số lần đi tuần cần thực hiện ',
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
    $('#modalChartReport').modal('show');
  }

function showModalEnterManager(){
  $('#modalEnterManager').modal('show');
  $('#txtManagerName').val('');
}

function saveManagerName(){
  let name = $('#txtManagerName').val();
  if(name.trim() == '') return showAlertError('You have to input name!!!', '', 5000);
  $('.manager-name').text(name);
  $('#modalEnterManager').modal('hide');
}

function buildChartPatrollingPerformance(id){
  if(currentDataChartPatrollingPerformance.length == 0) {
    chartPatrolling = null;
    $(`#${id}`).html('');
    return;
  }
  if(!id) id = 'chartPatrollingPerformance';
  let $chartArea = $('<canvas style="width: 100%" height="400"></canvas>');
  $(`#${id}`).html($chartArea);
  let ctx = $chartArea[0].getContext('2d');
  let { data, options } = getInfoOfChartPatrolling();
  chartPatrolling = createChart(ctx, 'bar', data, options);
}

function getInfoOfChartPatrolling(){
  let lineData = [ currentOverallPerformance, currentOverallPerformance, currentOverallPerformance ]
  let data = {
    labels: [["Performance", "Routes"], ["Performance", "Timing"], ["Performance", "Routing"]],
    datasets: [{
        type: 'bar',
        label: 'Performance',
        data: currentDataChartPatrollingPerformance,
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1
    },{
      type: 'line',
      label: 'Overall Performance',
      borderColor: 'green',
      backgroundColor: 'green',
      borderWidth: 2,
      fill: false,
      data: lineData
    }]
  }

  let options = {
    title: {
      display: true,
      text: 'Patrolling Performance',
      fontSize: 20
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
  return { data, options };
}

function getInfoOfChartTimePerformance(){
  let data = {
    labels: ["Perfomance Time/ Hiệu suất thời gian %", "Idling Time in %/ Thời gian không làm việc %"],
    datasets: [{
        label: '# of Votes',
        data: currentDataChartTimePerformance,
        backgroundColor: [
          '#4286f4',
          '#d82b42',
        ],
        borderColor: [
          'rgba(255,99,132,1)',
          'rgba(54, 162, 235, 1)',
        ],
        borderWidth: 1
    }]
  };

  let options = {
    // showAllTooltips: true,
    title: {
      display: true,
      text: 'Time Performance',
      fontSize: 20
    },
    legend: {
      display: false
    },
    pieceLabel: {
      render: 'percentage',
      fontColor: 'white',
      fontSize: 20,
      precision: 2
    },
    hover: {
      mode: 'nearest',
      intersect: true
    },
  };
  return { data, options };
}

function buildChartTimePerformance(id){
  if(currentDataChartTimePerformance.length == 0) {
      chartTime = null;
     $(`#${id}`).html('');
     return;
  }
  if(!id) id = 'chartTimePerformance';
  let $chartArea = $('<canvas style="width: 100%" height="400"></canvas>');
  $(`#${id}`).html($chartArea);
  let ctx = $chartArea[0].getContext('2d');
  let { data, options } = getInfoOfChartTimePerformance();
  chartTime = createChart(ctx, 'pie', data, options);
}

function showChartImage(id, chart){
  if(!chart) return;
  var url = chart.toBase64Image();
  let img = `<img src="${url}" class="img-fluid">`;
  $(`#${id}`).html(img);
}

function createChart(ctx, type, data, options){
  return new Chart(ctx, { type, data, options });
}

function renderReportTable(data){
  let $table = $('#tblReports');
  $table.html('');
  let $thead = $('<thead class="custom-table-header"></thead>');
  let $tbody = $('<tbody></tbody>');
  $thead.html(`
      <tr>
        <th class="trn text-center">No.</th>
        <th class="trn">Criteria</th>
        <th class="trn text-center">Cal</th>
        <th class="trn text-center">Patrol Guard Route</th>
      </tr>
    `)
  if (data) {
    for(let i = 0; i < 20; i++){
      $tbody.append(`
        <tr>
          <td class="trn text-center">${i + 1}</td>
          <td class="trn">${arrCriteriaReport[i]}</td>
          <td class="trn text-center">${arrReportCal[i]}</td>
          <td class="trn text-center">${data[0][arrPropsReport[i]]} ${unitsOfData[i]} </td>
        </tr>
      `)
    }
  }
  $table.append($thead).append($tbody);
}

function showTimeReportOnHeader(time){
  $('.fromDateReport').text(`${time} 00:00AM`);
  $('.toDateReport').text(`${time} 11:59PM`);
}

function showRouteName(){
  let id = $('#selectRouteList').val();
  let g = arrRoutes.find(g => g.iRouteID == id);
  $('.route-name').text(g.sRouteName);
}

async function showReportData(){
  let RouteID = $('#selectRouteList').val();
  let time = $('#reportDatetime').val();
  if(time == '') return alert('No date time submitted');
  showTimeReportOnHeader(time);
  showRouteName();
  let dDateTime = changeFormatDateTime(time);
  let sentData = { RouteID, dDateTime }
  const data = await Service.reportRoutebydate(sentData);
  renderReportTable(data);
  setDefaultLang();
  if(data){
    const { dIdling_Time_in, dPerfomance_Time, dPerformance_Routes, dPerformance_Routing, dPerformance_Timing, dOverall_performance } = data[0];

    currentDataChartTimePerformance = [
      Number(dIdling_Time_in), 
      Number(dPerfomance_Time)
    ];
    currentDataChartPatrollingPerformance = [
      Number(dPerformance_Routes), 
      Number(dPerformance_Timing), 
      Number(dPerformance_Routing)
    ];
    currentOverallPerformance = Number(dOverall_performance);
  }else{
    currentDataChartTimePerformance = [];
    currentDataChartPatrollingPerformance = [];

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
  setTimeout(showReportData, 200);
  setTimeout(() => {
    buildChartPatrollingPerformance('printingPatrollingPerformanceChart')
    buildChartTimePerformance('printingTimePerformanceChart');
  }, 500);
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
  let head = renderHeadOfPage();
  let script = renderScript();
  showChartImage('chartImagePatrolling', chartPatrolling);
  showChartImage('chartImageTime', chartTime);
  setTimeout(() => {
    let report = $('.printing-area').html();
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
  setTimeout(() => {
    $('#chartImagePatrolling').html('');
    $('#chartImageTime').html('');
  }, 1500);
}

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