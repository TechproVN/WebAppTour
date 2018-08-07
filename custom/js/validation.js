class Validation{
  static checkEmpty(value){
    if(value == null || value == undefined) return false;
    if(value.trim() == '') return false;
    return true;
  }
  static checkIsNumber(val){
    if(!Validation.checkEmpty(val)) return false;
    if(isNaN(val)) return false;
    return true;
  }
}