let appCurrentLang = "en";

const dictionary = {
  "Main View": {
    vn: "Trang Chủ"
  },
  "Tours": {
    vn: "Chuyến đi tuần"
  },
  "Incidents": {
    vn: "Sự cố"
  },
  "Assets": {
    vn: "Tài Sản"
  },
  "Settings": {
    vn: "Các tính nắng khác"
  },
  "Daily Patrolling Results": {
    vn: "Kết quả tuần tra hằng ngày"
  },
  "Violation Reports": {
    vn: "Báo cáo tình trạng sự cố"
  },
  "Security": {
    vn: "An ninh"
  },
  "Weekly (Monthly) Patrolling Reports": {
    vn: "Báo cáo tuần tra hằng tuần (hằng tháng)"
  },
  "Report Attendance": {
    vn: "Báo cáo tham gia"
  },
  "Create Check Points": {
    vn: "Tạo check points"
  },
  "Security Guard Profile": {
    vn: "Thông tin an ninh bảo vệ"
  },
  "Create Zone": {
    vn: "Tạo khu vực"
  },
  "Create Route": {
    vn: "Tạo tuyến đi tuần"
  },
  "Create Schedule": {
    vn: "Tạo lịch trình"
  },
  "Define Incidents": {
    vn: "Khởi tạo các loại sự cố"
  },
  "Define Devices": {
    vn: "Khởi tạo các loại thiết bị"
  },
  "Reports": {
    vn: "Báo cáo"
  },
  "Report": {
    vn: "Báo cáo"
  },
  "Refresh":{
    vn:"Quay lại"
  },
  "Guards": {
     vn: "Bảo vệ"
  },
  "Guard": {
    vn: "Bảo vệ"
  },
  "Map":{
    vn:"Bản đồ"
  },
  "Name":{
    vn:"Tên"
  },
  "Last visited":{
    vn:"Lần cuối tới thăm"
  },
  "No.":{
    vn:"No."
  },
  "Speed":{
    vn:"Tốc độ"
  },
  "Attendance":{
    vn:"Tập hợp"
  },
  "Send message":{
    vn:"Gủi tin nhắn"
  },
  "Guard ID":{
    vn:"Bao ve ID"
  },
  "Guard Name":{
    vn:"Tên bảo vệ "
  },
  "ID":{
    vn:"ID"
  },
  "Events":{
    vn:"Các sự kiện"
  },
  "Date":{
    vn:"Ngày tháng năm"
  },
  "Event type":{
    vn:"Loại sự kiện"
  },
  "Event Details":{
    vn:"Chi tiết sự kiện"
  },
  "Check point":{
    vn:"Nơi kiểm tra"
  },
  "Tour ID":{
    vn:"Tour ID"
  },
  "Image | Audio":{
    vn:"Am thanh | Hinh anh"
  },
  "English":{
    vn:"Tieng Viet"
  },
  "Filters":{
    vn:"Lọc thông tin"
  },
  "Filters":{
    vn:"Lọc thông tin"
  },
  "Start Time":{
    vn:"Thời gian bắt đầu"
  },
  "End Time":{
    vn:"Thời gian kết thúc"
  },
  "Route Name":{
    vn:"Tên tuyến"
  },
  "Device Name":{
    vn:"Tên thiết bị"
  },
  "View":{
    vn:"Xem"
  },
  "Zone":{
    vn:"Khu vực"
  },
  "Name":{
    vn:"Tên"
  },
  "Device":{
    vn:"Thiết bị"
  },
  "Date":{
    vn:"Ngày tháng năm"
  },
  "Started":{
    vn:"Bắt đầu"
  },
  "Finished":{
    vn:"Kết thúc"
  },
  "Point":{
    vn:"Điểm"
  },
  "Checked":{
    vn:"Đã kiểm tra"
  },
  "Timing":{
    vn:"Thời gian"
  },
  "Current":{
    vn:"Hiện tại"
  },
  "Distance":{
    vn:"Khoảng cách"
  },
  "Details":{
    vn:"Chi tiết"
  },
  "Close":{
    vn:"Đóng"
  },
  "Tour Map":{
    vn:"Bản đồ tour đi tuần"
  },
  "Action":{
    vn:"Xử lý"
  },
  "Map":{
    vn:"Bản đồ"
  },
  "Point ID":{
    vn:"Điểm ID"
  },
  "Status":{
    vn:"Trạng thái"
  },
  "Datetime":{
    vn:"Ngày giờ"
  },
  "KindCheck":{
    vn:"Kiểm tra"
  },
  "Tour lists":{
    vn:"Danh sách đi tuần"
  },
  "Total tours":{
    vn:"Tổng số chuyến đi tuần"
  },
  "Device name":{
    vn:"Tổng số chuyến đi tuần"
  },
  
}

var translator = $('body').translate({lang: "en", t: dictionary}); //use English
$('#changeLanguage').click(changeLanguage);
// translator.lang("vn"); //change to Vietnamese

function changeLanguage(){
  if(appCurrentLang == "vn") return changeLangIntoEnglish();
  changeLangIntoVietnamese()
}

function changeLangIntoEnglish(){
  appCurrentLang = 'en';
  translator.lang("en");
}

function changeLangIntoVietnamese(){
  appCurrentLang = 'vn';
  translator.lang("vn");
}

