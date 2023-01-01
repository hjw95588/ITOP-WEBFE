const mixin = {
  data () {

    return {
    }
  },
  created(){},
  mounted() {
  },
  methods:{
    // 获取字符串中某个字符第num+1次出现的下标
    find(str,cha,num){
      var x=str.indexOf(cha);
      for(var i=0;i<num;i++){
          x=str.indexOf(cha,x+1);
      }
      return x;
    },
    // 数字输入框控制
    numberInputHandler(item) {
      let [keyRoot, keyChild] = item.split('.');
      let val = this[keyRoot][keyChild];
      // 防止出现多个小数点
      let index = this.find(val,'.',1)
      // console.log('小数点第二次出现的下标',index)
      if(index>0){
        this[keyRoot][keyChild]=val.slice(0,index);
      }
      // 去掉非数字、非小数点的字符
      if(!/^[\d.]+$/.test(val)){
        this[keyRoot][keyChild]=val.replace(/[^\d.]/g,'');
      }
    },
    // 表格嵌套输入框控制
    tableNumberInputHandler(item,itemIndex,name){
      let keyRoot = eval("this." + item);
      let val = keyRoot[itemIndex][name];
      // console.log('输入框的值',val)
      // 防止出现多个小数点
      let index = this.find(val,'.',1)
      if(index>0){
        keyRoot[itemIndex][name]=val.slice(0,index);
      }
      // 去掉非数字、非小数点的字符
      if(!/^[\d.]+$/.test(val)){
        keyRoot[itemIndex][name]=val.replace(/[^\d.]/g,'');
      }
    },

  },
}
export default mixin
