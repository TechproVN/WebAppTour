

$(() => {
  $('#btnViewIncidentsReportByMonth').click(() => {
    showIncidentReport('month');
  })
  $('#btnViewIncidentsReportByWeek').click(() => {
    showIncidentReport('week');
  })
  showWeeksSelect();
  showMonthsSelect();
  showDataInCurrentMonth();
  setCurrentWeek()
})


function showDataInCurrentMonth(){
  let d = new Date();
  let currentMonth = d.getMonth() + 1;
  $('#reportMonth').val(currentMonth);
  showIncidentReport('month');
}

function setCurrentWeek(){
  let d = new Date();
  let currentWeek = getWeek(d);
  $('#reportWeek').val(currentWeek)
}

function get4DayAgo(){
  let timestamp = Date.now();
  let oldTimeStamp = timestamp - (1000*60*60*24*4);
  let d = new Date(oldTimeStamp);
  let year = d.getFullYear();
  let month = d.getMonth();
  let day = d.getDate();
  return { year, month, day };
}

let arrIncidents = [];
let arrRows = [];

function renderTblIncidentReport(){
  let $table = $('#tblViolationMin');
  $table.html('');
  let $thead = $('<thead></thead>');
  let $tbody = $('<tbody></tbody>');
  
  if(arrIncidents){
    $thead.append(`
      <tr>
        <th rowspan="2">Day</th>
        <th rowspan="2">Date</th>
        <th rowspan="2">Weekend NO.</th>
        <th rowspan="2">Number of Violation</th>
        <th colspan="${arrIncidents.length}">Types of Violation</th>
      </tr>
      <tr class="trIncident"></tr>
    `)
    arrIncidents.forEach(item => {
      $thead.find('tr.trIncident').append(`<th>${item}</th>`);
    });
  }
  if(arrRows){
    arrRows.forEach(row => {
      const { sDay, iWeek, dDate } = row;
      $tbody.append(`
        <tr>
          <td>${sDay}</td>
          <td>${dDate}</td>
          <td>${iWeek}</td>
          <td>${getNumOfViolationsByDate(row)}</td>
        </tr>
      `)
      arrIncidents.forEach(item => {
        $tbody.find('tr').last().append(`<td>${row[item]}</td>`);
      })
    })
  }
  $table.append($thead).append($tbody);
}

async function showIncidentReport(type){
  let sentData = { iWeek: 0, iMonth: 0 };
  if(type.toLowerCase() == 'week'){
    let week = $('#reportWeek').val();
    sentData.iWeek = week;
  }else{
    let month = $('#reportMonth').val();
    sentData.iMonth = month;
  }
  let data = await Service.reportIncidentWeekOrMonth(sentData);
  arrIncidents = getIncidentsArr(data);
  arrRows = getRowsViolationsByDate(data);
  renderTblIncidentReport();
}

function getIncidentsArr(data){
  if(!data) return null;
  if(data.length == 0) return null;
  let incidentsSet = new Set(data.map(incident => incident.sAlertContent));
  return [...incidentsSet];
}

function getRowsViolationsByDate(data){
  if(!data) return null;
  if(data.length == 0) return null;
  let dateSet = new Set(data.map(item => item.dDate));
  let arrRows = []
  dateSet.forEach(value => {
    let arrTemp = data.filter(item => item.dDate == value);
    let acc = arrTemp.reduce((acc, incident, index) => {
      const { sAlertContent, iCountAlert } = incident;
      if(index == 0){
        const { sDay, iWeek, dDate } = incident;
        acc.sDay = sDay;
        acc.iWeek = iWeek;
        acc.dDate = dDate;
      }
      if(!acc[sAlertContent]) {
        acc[sAlertContent] = 0;
      }
      acc[sAlertContent] += Number(iCountAlert);
      return acc;
    }, {});
    arrRows.push(acc);
  })
  return arrRows;
}

function getNumOfViolationsByDate(row){
  let sum = 0;
  arrIncidents.forEach(item => {
    sum += row[item];
  })
  return sum;
}