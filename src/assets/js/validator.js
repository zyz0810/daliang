// 验证密码
export function validatePassword (rule, value, callback) {
  const reg = /^([A-Z]|[a-z]|[0-9]|[`~!@#$%^&*()+=|{}':;',\\\\[\\\\].<>\/?~！@#￥%……&*（）――+|{}【】‘；：”“'。，、？]){6,20}$/
  if (value == '' || value == undefined || value == null) {
    callback()
  } else {
    if (!reg.test(value)) {
      callback(new Error('请输入6-20位的密码'))
    } else {
      callback()
    }
  }
}
