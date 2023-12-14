export default {
  PASSWORD_RULE: "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\\S+$).{8,20}$",
  AGE_RULE:"[1-9]\d*",
  // 验证非法字符
  checkInvalidWord(str) {
    const pat=new RegExp("[^a-zA-Z0-9\_\u4e00-\u9fa5\u3002\uff1b\uff0c\uff1a\u201c\u201d\uff08\uff09\u3001\uff1f\u300a\u300b]","i");   
    return !pat.test(str)
  }
}