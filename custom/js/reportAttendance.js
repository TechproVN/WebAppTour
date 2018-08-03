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
    showReportAttPagination(data)
  }else{
    showAlertError('No data available', '', 3000);
    resetTblReportAttData();
  }
  setDefaultLang();
}

function showReportAttPagination(data){
  $('#totalReportAtt').html(`<strong class="trn">Total rows</strong> ${data.length}`)
  $('#pagingReportAttendanceControl').pagination({
    dataSource: data,
    pageSize: 10,
    className: 'paginationjs-theme-green paginationjs-big',
    showGoInput: true,
    showGoButton: true,
    callback: function (data, pagination) {
      // template method of yourself
      let $table = renderReportAttTable(data);
      $('.card-reportAttendance .table-responsive').html($table);
      setDefaultLang();
    }
  })
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
        <th class="trn">Image</th>
        <th class="trn">Checked</th>
      </tr>
    `)
  if (data) {
    console.log(data);
    data.forEach((report) => {
      const { bCheck, dDateTimeCheck, sGuardName, sImageUrl } = report;
      let img;
      console.log(typeof sImageUrl)
      if(!sImageUrl) img = 'No Image';
      else{
        const imgUrl = `${APP_DOMAIN}${sImageUrl}`;
       img = `<img src="${imgUrl}" alt="Image here" class="img-report-att" style="width:80px; height: 120px">`
      }
      $tbody.append(`
        <tr>
          <td>${sGuardName}</td>
          <td>${dDateTimeCheck}</td>
          <td>${img}</td>
          <td>${bCheck}</td>
        </tr>
      `)
      if(sImageUrl)
      $tbody.find('.img-report-att').last().click(() => {
        showImageReportAtt(imgUrl);
      })
    })
  }

  $table.append($thead).append($tbody);
  return $table;
}

function showImageReportAtt(imgUrl){
  $('#modalImgReportAtt').modal('show');
  $('#modalImgReportAtt').find('.modal-body img').attr({'src': imgUrl});
}

function formatTodayReportAttendance() {
  $('#reportAttDate').val(formatToday());
  showDataAttendance();
}