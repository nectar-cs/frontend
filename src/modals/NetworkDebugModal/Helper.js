export default class Helper {
  static verdictString(value){
    if(value === true) return "not the cause";
    if(value === false) return "problem lies here";
    if(value === null) return "inconclusive";
  }

  static verdictEmotion(value){
    if(value === true) return 'good';
    if(value === false) return 'failure';
    if(value === null) return 'warn2';
  }
}