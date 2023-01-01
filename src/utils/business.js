const business = {
  // 由一个组件，向上找到最近的指定组件
  findComponentUpward(context, componentName) {
    let parent = context.$parent;
    let name = parent.$options.name;

    while (parent && (!name || [componentName].indexOf(name) < 0)) {
      parent = parent.$parent;
      if (parent) name = parent.$options.name;
    }
    return parent;
  },
  // 由一个组件，向下找到最近的指定组件
  findComponentDownward(context, componentName) {
    const childrens = context.$children;
    let children = null;
    if (childrens.length) {
      for (const child of childrens) {
        const name = child.$options.name;
        if (name === componentName) {
          children = child;
          break;
        } else {
          children = business.findComponentDownward(child, componentName);
          if (children) break;
        }
      }
    }
    return children;
  },
  /*
  *checkForm 多表单校验
  @params {String} vm 上下文对象
  @params {Array} formArr 要校验的表单数组
  @params {Boolean} formType 表单类型（normalForm/dynamicForm/projectForm）（[默认normalForm]
  @return {Boolean} true:校验通过；false:校验不通过；
  */
  async checkForm(vm, formArr, formType = 'normalForm') {
    var resultArr = []; //用来接受返回结果的数组
    var _self = vm;
    //封装验证表单的函数(普通表单)---我的工作组件组成的表单
    function checkFormItemForNormalForm(formName) {
      var result = new Promise(function(resolve, reject) {
        const refsForm = !!_self.$refs[formName].$refs.form ? _self.$refs[formName].$refs.form : _self.$refs[formName]
        refsForm.validate(valid => {
          console.log('3333工具函数中表单校验',formName,valid)
          if (valid) {
            resolve();
          } else {
            reject();
          }
        });
      });
      resultArr.push(result); //push 得到promise的结果
    }
    //封装验证表单的函数(普通表单)---兴彬项目表单验证
    function checkFormItemForProjectForm(formName) {
      var result = new Promise(function(resolve, reject) {
        _self.$refs[formName].validate(valid => {
          console.log('工具函数中表单校验',formName,valid)
          if (valid) {
            resolve();
          } else {
            reject();
          }
        });
      });
      resultArr.push(result); //push 得到promise的结果
    }
    //封装验证表单的函数(动态表单)
    function checkFormItemForDynamicForm(formName) {
      var result = new Promise(function(resolve, reject) {
        _self.$refs[formName].$refs.buildForm.validate(valid => {
          if (valid) {
            resolve();
          } else {
            reject();
          }
        });
      });
      resultArr.push(result); //push 得到promise的结果
    }
    if (formType === 'dynamicForm') {
      //根据表单的ref校验
      formArr.forEach(item => {
        checkFormItemForDynamicForm(item);
      });
    } else if (formType === 'projectForm') {
      //根据表单的ref校验
      formArr.forEach(item => {
        checkFormItemForProjectForm(item);
      });
    } else {
      //根据表单的ref校验
      formArr.forEach(item => {
        checkFormItemForNormalForm(item);
      });
    }

    console.log("---resultArr---", resultArr);
    let validateResultArr = [];
    try {
      validateResultArr = await Promise.all(resultArr);
    } catch (err) {
      console.log(err);
    }
    // console.log("validateResultArr", validateResultArr);
    // 只有数组大于0的时候，prmise.all才是所以的promise都执行成功，只要有一个失败都是返回空数组
    return validateResultArr.length > 0 ? true : false;
  },
};
export default business;
