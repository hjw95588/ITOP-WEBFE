/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

/**
 * @param {string} url
 * @returns {Boolean}
 */
export function validURL(url) {
  const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return reg.test(url)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/**
 * @param {string} email
 * @returns {Boolean}
 */
export function validEmail(email) {
  const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return reg.test(email)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function isString(str) {
  if (typeof str === 'string' || str instanceof String) {
    return true
  }
  return false
}

/**
 * @param {Array} arg
 * @returns {Boolean}
 */
export function isArray(arg) {
  if (typeof Array.isArray === 'undefined') {
    return Object.prototype.toString.call(arg) === '[object Array]'
  }
  return Array.isArray(arg)
}

/**
 * 功能：验证特殊字符
 * @param {String} value
 * @returns {Function} cb
 */
export function validateSpecialCharacters (rule, value, cb) {
  const sortReg = /[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、]/
  if (sortReg.test(String(value))) {
    cb(new Error('输入错误'))
  } else {
    cb()
  }
}

/**
 * 小数位正则：const valdateReg =  /^([1-9]\d*|0)(\.\d{1,2})?$/
 */

/***
 * 人数最大最小校验
 * @param {String} value
 * @returns {Function} cb
 */
export function validateMaxMinNum (rule, value, cb) {
  const validateReg = /^[+]{0,1}(\d+)$/
  if (!validateReg.test(value)) {
    cb(new Error('人数只能输入正整数！'))
  } else if (parseInt(value) > 999999999) {
    cb( new Error('人数最多输入999999999！') )
  } else {
    cb()
  }
}

/**
 * 最大金额校验
 */
 export function validateMaxNum (rule, value, cb) {
  const valdateReg =  /^0\.([1-9]|\d[1-9])$|^[1-9]\d{0,6}\.\d{0,4}$|^[1-9]\d{0,6}$/
  if (!valdateReg.test(value)) {
    cb(new Error('金额最大可输入数值是999！'))
  }
  cb()
}

/**
 * 比例验证：两位小数
 */
 export function validateRange (rule, value, cb) {
  const valdateReg =  /^([1-9]\d*|0)(\.\d{1,2})?$/
  if (value !== '') {
    if (parseFloat(value) > 100) {
      cb(new Error('主营市场占有率最大可输入100！'))
    } else if (!valdateReg.test(value)) {
      cb(new Error('请输入正确数值！'))
    }
  }
  cb()
}

/**
 * 验证开始-结束时间
 * @params {Object} rule
 * @params {string} values
 * @params {function} cb // 执行结果校验函数
 * @params {string} date // 开始时间
 */
 export function validateDate (rule, value, cb, date) {
  const findDate = new Date(date).setHours(0);
  const solveDate = new Date(value);
  const dateRange = solveDate - findDate;
  if (dateRange < 0) {
    cb(new Error(rule.message))
  }
  cb();
}

/**
 * 数字校验
 * numvali: '5+2'  校验6位整数，2位小数
 */
export function validNum(rule, value, cb, numvali) {
  if(!value){
    cb();
    return;
  }
  let valdateReg = '^[1-9]\\d{0,6}(\\.\\d{1,2})?$|^0(\\.\\d{1,2})?$';
  if (numvali && typeof(numvali)=='string') {
    let num = numvali.split("+");
    if (num.length == 2) {
      valdateReg = '^[1-9]\\d{0,' + num[0] + '}(\\.\\d{1,' + num[1] + '})?$|^0(\\.\\d{1,' + num[1] + '})?$';
    }
    if (num.length == 1) {
      valdateReg = '^[1-9]\\d{0,' + num[0] + '}$|^0$';
    }
  }
  if (!new RegExp(valdateReg).test(value)){
    cb(new Error(rule.message ? rule.message : '请输入正确数值'))
  }
  cb()
}
