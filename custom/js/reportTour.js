$(() => {
  $('#btnViewReportTour').click(showTourDetailsTable);
  $('#reportTourDatetime').val(formatToday());
  loadGuardsOnCombobox();
  showTourDetailsTable();
})

async function loadGuardsOnCombobox(){
  let guards = await Service.getGuardsData();
  showGuardsOnCombobox(guards);
}


async function showTourDetailsTable(){
  let iGuardIDIN = $('#comboboxGuardReportTour').val();
  let date = $('#reportTourDatetime').val();
  if(date.trim() == '') return showAlertError("Invalid datetime", "Datetime must be filled", 3000);
  let sentData = {iGuardIDIN, dDateTimeIN: changeFormatDateTime(date)};
  let data = await Service.getTourDetail(sentData);
  console.log(data);
  if(data){
    $('#totalTourReportRows').html(`<strong>Total rows: </strong>${data.length}`);
    $('#pagingToursControl').pagination({
      dataSource: data,
      pageSize: 10,
      showGoInput: true,
      showGoButton: true,
      callback: function (data, pagination) {
        let $table = renderTourReportTable(data);
        $('.card-tourReport .table-responsive').html($table);
      }
    })
  }
}

function renderTourReportTable(data) {
  let $table = $(`<table class="table table-hover table-striped table-condensed text-center custom-table" id="tblReportTour"></table>`)
  let $thead = $('<thead></thead>');
  let $tbody = $('<tbody></tbody>');

  $thead.html(
    `
      <tr>
        <th class="trn">Guard</th>
        <th class="trn">Zone</th>
        <th class="trn">Checking code</th>
        <th class="trn">Initial Date</th>
        <th class="trn">Time start</th>
        <th class="trn">Time end</th>
        <th class="trn">NoTour</th>
        <th class="trn">TimeTour</th>
        <th class="trn">Time Schedule</th>
        <th class="trn">checkedPoint</th>
      </tr>
    `
  )
  if (data) {
    data.forEach((tour) => {
      const { dDateTimeEnd, dDateTimeIntinial, dDateTimeStart, dPointChecked, dTimeSchedule, dTimeTour, iNoTour, sCheckingCode, sGuardName, sZoneName } = tour;
      $tbody.append(`
        <tr>
          <td>${sGuardName}</td>
          <td>${sZoneName}</td>
          <td>${sCheckingCode}</td>
          <td>${dDateTimeIntinial}</td>
          <td>${dDateTimeStart}</td>
          <td>${dDateTimeEnd}</td>
          <td>${iNoTour}</td>
          <td>${dTimeTour}</td>
          <td>${dTimeSchedule}</td>
          <td>${dPointChecked}</td>
        </tr>
      `)
    })
  }

  $table.append($thead).append($tbody);
  return $table;
}