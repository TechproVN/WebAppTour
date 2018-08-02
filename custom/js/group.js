$(() => {
  $('#btnViewGroupList').click(showGroups);
  $('#btnShowInsertGroupModal').click(showInsertGroupModal);
  $('#btnInsertGroup').click(insertGroup);
  $('#btnUpdateGroup').click(updateGroup);
  loadGuardsOnCombobox();
  showGroups();
})

let currentUpdateGroup = null;

async function insertGroup(){
  let name = $('#txtInsertGroupName').val();
  let guardId = $('#selectInsertGuardLeader').val();
  if(!Validation.checkEmpty(name)){
    showAlertError("Invalid data", "Group Name must be filled");
  } else{
    let sentData = { sGroupNameIN: name, iGuardIDIN: guardId, iGroupIDIN: 0, bStatusIN: 1 };
    console.log(JSON.stringify(sentData));
    let response = await Service.insertGroup(sentData);
    console.log(response);
    showGroups();
    showAlertSuccess("Insert Successfully", "", 3000);
  }
}

function showInsertGroupModal(){
  $('#modalInsertGroup').modal('show');
  $('#txtInsertGroupName').val('');
}

async function deleteGroup(group){
  let sure = await showAlertWarning("Are you sure?", "");
  if(sure){
    const { iGuardGroupID, iGuardIDLeader, sGroupName } = group;
    let sentData = { iGroupIDIN: iGuardGroupID, iGuardIDIN: iGuardIDLeader, sGroupNameIN: sGroupName, bStatusIN: 3 }
    console.log(JSON.stringify(sentData));
    let response = await Service.deleteGroup(sentData);
    console.log(response);
    showGroups();
    showAlertSuccess("Locked Successfully", "", 3000);
  }
}

function renderGroupTable(data){
  let $table = $(`<table class="table table-hover table-striped table-condensed text-center custom-table min-height-table" id="tblGroup"></table>`)
  let $thead = $('<thead></thead>');
  let $tbody = $('<tbody></tbody>');

  $thead.html(
    `
    <tr>
      <th class="trn">#</th>
      <th class="trn">Group ID</th>
      <th class="trn">Group Name</th>
      <th class="trn">Leader</th>
      <th class="trn"></th>
    </tr>
  `
  )
  if (data) {
    data.forEach((group, index) => {
      const { iGuardGroupID, iGuardIDLeader, sGroupName, sGuardName} = group
      $tbody.append(`
        <tr>
          <td>${index + 1}</td>
          <td>${iGuardGroupID}</td>
          <td>${sGroupName}</td>
          <td>${sGuardName}</td>
          <td>
            <div class="btn-group">
              <button type="button" class="btn btn-custom bg-main-color btn-custom-small dropdown-toggle trn" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Action</button>
              <div class="dropdown-menu" >
                <button class="btn btn-custom bg-info btn-custom-small dropdown-item btnShowUpdateGroupModal trn">Update</button>
                <button class="btn btn-custom bg-danger btn-custom-small dropdown-item btnDeleteGroup trn">Delete</button>
              </div>
            </div>
          </td>
        </tr>
      `)
      $tbody.find('.btnShowUpdateGroupModal').last().click(() => {
        showUpdateGroupModal(group);
      })
      $tbody.find('.btnDeleteGroup').last().click(() => {
        deleteGroup(group);
      })
    })
  }

  $table.append($thead).append($tbody);
  return $table;
}

async function updateGroup(){
  let name = $('#txtUpdateGroupName').val();
  let guardId =  $('#selectUpdateGuardLeader').val();
  let { iGuardGroupID } = currentUpdateGroup;
  if(!Validation.checkEmpty(name)) return showAlertError("Invalid data", "Group Name must be filled");
  let sentData = { sGroupNameIN: name, iGuardIDIN: guardId, iGroupIDIN: iGuardGroupID, bStatusIN: 2 };
  console.log(JSON.stringify(sentData));
  let response = await Service.updateGroup(sentData);
  console.log(response);
  showGroups();
  showAlertSuccess("Insert Successfully", "", 3000);
}

function showUpdateGroupModal(group){
  currentUpdateGroup = Object.assign({}, group);
  const { sGroupName, iGuardIDLeader } = group;
  $('#modalUpdateGroup').modal('show');
  $('#txtUpdateGroupName').val(sGroupName);
  $('#selectUpdateGuardLeader').val(iGuardIDLeader);
}

async function showGroups(){
  let groups = await Service.getGroupData();
  if(groups){
    showGroupPagination(groups);
  }else{
    resetTblGroup();
    showAlertError("No data available", "", 3000);
  }
  setDefaultLang();
}

function showGroupPagination(groups){
  $('#totalGroups').html(`<strong class="trn">Total Groups</strong>: ${groups.length}`);
  $('#pagingGroupsControl').pagination({
    dataSource: groups,
    pageSize: 10,
    className: 'paginationjs-theme-green paginationjs-big',
    showGoInput: true,
    showGoButton: true,
    callback: function (groups, pagination) {
      let $table = renderGroupTable(groups);
      $('.card-groups .table-responsive').html($table);
      setDefaultLang();
    }
  })
}

function resetTblGroup(){
  $('#totalGroups').html('');
  $('#pagingGroupsControl').html('');
  $('#tblGroup').html('');
}

