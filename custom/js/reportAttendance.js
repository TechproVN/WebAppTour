$(() => {
  $('#btnShowDataAttendance').click(showDataAttendance);
  formatTodayReportAttendance();
})

async function showDataAttendance(){
  let date = $('#reportAttDate').val();
  if(date == '') return showAlertError("Invalid date", "Please choose date");
  let sentData = { dDateTimeIN : changeFormatDateTime(date) };
  console.log(JSON.stringify(sentData));
  let data = await Service.getDataAttandance(sentData);
  if(data){
    $('#totalReportAtt').html(`<strong>Total Rows:</strong> ${data.length}`)
    $('#pagingReportAttendanceControl').pagination({
      dataSource: data,
      pageSize: 10,
      showGoInput: true,
      showGoButton: true,
      callback: function (data, pagination) {
        // template method of yourself
        let $table = renderReportAttTable(data);
        $('.card-reportAttendance .table-responsive').html($table);
      }
    })
  }else{
    resetTblReportAttData();
  }
}

function resetTblReportAttData(){
  $('#totalReportAtt').html('');
  $('#pagingReportAttendanceControl').html('');
  $('#tblReportAttendance').find('tbody').html('');
}

function renderReportAttTable(data) {
  let $table = $(`<table class="table table-hover table-striped table-condensed text-center custom-table" id="tblReportAttendance"></table>`)
  let $thead = $('<thead></thead>');
  let $tbody = $('<tbody></tbody>');
  $thead.html(
    `
      <tr>
        <th class="trn">Guard Name</th>
        <th class="trn">DateTime</th>
        <th class="trn">Checked</th>
      </tr>
    `
  )
  if (data) {
    data.forEach((report) => {
      const { bCheck, dDateTimeCheck, sGuardName } = report;
      $tbody.append(`
        <tr>
          <td>${sGuardName}</td>
          <td>${dDateTimeCheck}</td>
          <td>${bCheck}</td>
        </tr>
      `)
    })
  }

  $table.append($thead).append($tbody);
  return $table;
}

function formatTodayReportAttendance() {
  $('#reportAttDate').val(formatToday());
  showDataAttendance();
}