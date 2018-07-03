class Validation{
  static checkEmpty(value){
    if(!value) return false;
    if(value.trim() == '') return false;
    return true;
  }
}