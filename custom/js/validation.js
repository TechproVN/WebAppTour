class Validation{
  static checkEmpty(value){
    if(!value) return false;
    if(value.trim() == '') return false;
    return true;
  }
  static checkIsNumber(val){
    if(val == '') return false;
    if(isNaN(val)) return false;
    return true;
  }
  static checkPositiveNumber(val){
    if(!Validation.checkIsNumber(val)) return false;
    if(Number(val) < 0) return false;
    return true;
  }
}