

$(() => {
  $('#btnViewIncidentsReport').click(showIncidentReport);
  formatCurrentTime();
  showIncidentReport();
})

function formatCurrentTime(){
  let today = getCurrentDate();
  let prevDay = get4DayAgo();
  let to = `${today.month + 1}/${today.day}/${today.year}`;
  let from = `${prevDay.month + 1}/${prevDay.day}/${prevDay.year}`;
  $('#incidentFromDatetime').val(from);
  $('#incidentToDatetime').val(to);
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
  $table.append($thead).append($tbody);
}

async function showIncidentReport(){
  let from = $('#incidentFromDatetime').val();
  let to = $('#incidentToDatetime').val();
  if(!checkDate(from, to)) return;
  let sentData = { dfromDate: changeFormatDateTime(from), dtoDate: changeFormatDateTime(to) };
  let data = await Service.getIncidentReport(sentData);
  arrIncidents = getIncidentsArr(data);
  arrRows = getRowsViolationsByDate(data);
  console.log(data);
  renderTblIncidentReport();
}

function getIncidentsArr(data){
  let incidentsSet = new Set(data.map(incident => incident.sAlertContent));
  return [...incidentsSet];
}

function getRowsViolationsByDate(data){
  let dateSet = new Set(data.map(item => item.dDate));
  let arrRows = []
  dateSet.forEach(value => {
    let arrTemp = data.filter(item => item.dDate == value);
    console.log(arrTemp);
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