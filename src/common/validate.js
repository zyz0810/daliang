/**
 * Created by jiachenpan on 16/11/18.
 */

export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}
/* 是否手机号码*/
export function validatePhone(rule, value,callback) {
  const reg =/^[1][3,4,5,7,8,9][0-9]{9}$/;
  if(value==''||value==undefined||value==null){
    callback();
  }else {
    if ((!reg.test(value)) && value != '') {
      callback(new Error('请输入正确的手机号码'));
    } else {
      callback();
    }
  }
}

/* 是否邮箱*/
export function validateEMail(rule, value,callback) {
  const reg =/^([a-zA-Z0-9]+[-_\.]?)+@[a-zA-Z0-9]+\.[a-z]+$/;
  if(value==''||value==undefined||value==null){
    callback();
  }else{
    if (!reg.test(value)){
      callback(new Error('请输入正确的邮箱地址'));
    } else {
      callback();
    }
  }
}

// 验证密码
export function validatePassword(rule, value,callback){
  const reg =/^([A-Z]|[a-z]|[0-9]|[`~!@#$%^&*()+=|{}':;',\\\\[\\\\].<>\/?~！@#￥%……&*（）――+|{}【】‘；：”“'。，、？]){6,20}$/;
  if(value==''||value==undefined||value==null){
    callback();
  }else{
    if (!reg.test(value)){
      callback(new Error('请输入6-20位的密码'));
    } else {
      callback();
    }
  }
}
// 验证身份证号
export function validateIdCard (rule, value, callback) {
  var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
  if (value == '' || value == undefined || value == null) {
    callback()
  } else {
    if (!reg.test(value)) {
      callback(new Error('请输入正确的身份证号'))
    } else {
      callback()
    }
  }
}

/* 验证交易密码6位数 */
export function validateTradePassword (rule, value, callback) {
  const reg = /^[0-9]{6}$/
  if (value == '' || value == undefined || value == null) {
    callback()
  } else {
    if (!reg.test(value)) {
      callback(new Error('交易密码位6位数字'))
    } else {
      callback()
    }
  }
}


// 是否是企业统一信用代码
export function validateCreditCode(rule,value,callback){
  const reg =/^[^_IOZSVa-z\W]{2}\d{6}[^_IOZSVa-z\W]{10}$/;
  if(value==''||value==undefined||value==null){
    callback();
  }else{
    if (!reg.test(value)){
      callback(new Error('请输入正确的企业统一社会信用代码'));
    } else {
      callback();
    }
  }
}

// 验证银行卡号
export function validateBankNo (rule, value, callback) {
  const reg = /^([1-9]{1})(\d{14}|\d{15}|\d{16}|\d{17}|\d{18}|\d{19})$/
  if (value == '' || value == undefined || value == null) {
    callback()
  } else {
    if (!reg.test(value)) {
      callback(new Error('请输入正确的银行卡号'))
    } else {
      callback()
    }
  }
}
// 是否是固定号码
export function validateFixPhone (rule, value, callback) {
  const reg = /^([0-9]{3,4}-)?[0-9]{7,8}$/
  if (value == '' || value == undefined || value == null) {
    callback()
  } else {
    if (!reg.test(value)) {
      callback(new Error('请输入正确的固定电话'))
    } else {
      callback()
    }
  }
}
