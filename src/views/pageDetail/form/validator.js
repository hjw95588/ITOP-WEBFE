// 数字输入框，有多个小数点的校验提示
export const NumberReg = function(rule, value, callback){
  let arr = value.trim().match(/\./g)
  if(arr && arr.length > 1){
    callback(new Error('格式不正确'))
  }else{
    callback();
  }
}

// 百分位数字校验
export const PercentNumberReg = function(rule, value, callback){
  let arr = value.trim().match(/\./g)
  let num = +value.trim();
  if(arr && arr.length > 1){
    callback(new Error('格式不正确'))
  }else if(num<0 || num>100){
    callback(new Error('数字范围有误'))
  }else{
    callback();
  }
}

