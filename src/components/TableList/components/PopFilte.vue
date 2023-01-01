<template>
  <el-popover placement="bottom" width="250" :ref="`popItem-${popIndex}`" trigger="manual" v-model="visible">
    <!--文本框-->
    <el-input
     @show="showPopover"
      v-if="componentModule == 'input'"
      placeholder="请输入内容"
      v-model="value"
      clearable
      @keyup.enter.native="confirm"
      ref="sInput"
    >
    </el-input>
    <!--下拉框-->
    <el-select v-if="componentModule == 'select'" v-model="value" placeholder="请选择" style="width:100%">
      <el-option
        v-for="item in options"
        :key="item.dictValue"
        :label="item.dictLabel"
        :value="item.dictValue">
      </el-option>
    </el-select>
    <!--时间选择器-->
    <el-date-picker
      v-if="componentModule == 'date'"
      v-model="value"
      type='date'
      style='width:100%;'
      value-format="yyyy-MM-dd"
      placeholder='请选择时间'
      @blur="confirmDateFn"></el-date-picker>
    <!--时间范围选择器-->
    <el-date-picker
      style="width:100%"
      class="dateBox"
      v-if="componentModule == 'datepicker'"
      v-model="value"
      type="daterange"
      value-format="yyyy-MM-dd"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      @blur="confirmDateFn">
    </el-date-picker>
    <!--月份选择器-->
    <el-date-picker
      clearable
      size="small"
      style="100%"
      v-model="value"
      type="month"
      v-if="componentModule == 'month'"
      value-format="yyyy-MM"
      placeholder="选择考勤周期"
    >
    </el-date-picker>
    <div class="pop_btn">
      <el-button type="primary" size="medium" @click="confirm">搜索</el-button>
      <el-button type="default" size="medium" @click="resetData">重置</el-button>
    </div>
    <div slot="reference" style="margin-left:5px" @click.stop="popClick" v-outside="closeOver">
      <span class="el-icon-arrow-down curser" :style="{'color':iconColor? 'rgb(16, 142, 233)': ''}"/>
    </div>
  </el-popover>
</template>
<script>
import { mapState } from 'vuex'
export default {
  name: 'PopFilte',
  data () {
    return {
      value: '',
      visible: false,
      iconColor: false,
      smallValue: undefined,
      bigValue: undefined,
      options: [],
      unwatchDict: null
    }
  },
  props: {
    componentModule: {
      type: String,
      default: ''
    },
    tableType: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: ''
    },
    defaultValue: {
      type: String,
      default: ''
    },
    optionsname: {
      type: String,
      default: ''
    },
    popIndex: {
      type: Number,
      default: 0
    },
    defaultProps: {
      type: Object,
      default: function () {
        return {
          label: 'label',
          value: 'value'
        }
      }
    }
  },
  computed: {
    ...mapState({
      dict: state => state.dict
    })
  },
  created () {
    if (this.componentModule === 'select') {
      this.unwatchDict = this.$watch('dict', val => {
        if (Object.keys(val).length !== 0) {
          this.options = val[this.optionsname]
        }
      }, {
        deep: true,
        immediate: true
      })
    } else {
      this.unwatchDict && this.unwatchDict()
    }
  },
  watch: {
    defaultValue (newVal, oldVal) {
      const self = this
      self.value = newVal
    }
  },
  methods: {
    showPopover () {
      this.$nextTick(() => {
        this.$refs.sInput.focus()
      })
    },
    resetData () {
      if (this.componentModule == 'datepicker') {
        this.value = []
      } else {
        this.value = ''
      }
      this.smallValue = undefined
      this.bigValue = undefined
      this.visible = false
      this.iconColor = false
      const self = this
      self.$emit('onResetFun', { [self.tableType]: self.value })
    },
    // 时间-日期选择阻止冒泡
    dateTimePickerClick (e) {
      console.log(e)
    },
    closeOver (e) {
      if (e.target.nodeName == 'BODY') return
      this.visible = false
    },
    popClick (e) {
      const chidcomponents = [].slice.call(this.$parent.$children)
      chidcomponents.forEach(item => {
        const keys = Object.keys(item.$refs).join()
        const isPopItem = keys.includes('popItem-')
        isPopItem && this.$set(item, 'visible', false)
      })
      this.visible = !this.visible
    },
    confirmDateFn(){
      this.visible = true
    },
    confirm () {
      this.visible = false
      this.iconColor = true
      const self = this
      if (this.componentModule == 'amountInput') {
        if (!self.smallValue && !self.bigValue) {
          this.iconColor = false
        }
        let values = [self.smallValue, self.bigValue]
        self.$emit('onSearchFun', { value: values, tableType: self.tableType })
      }else {
        if (!self.value) {
          this.iconColor = false
        }
        self.$emit('onSearchFun', { [self.tableType]: self.value })
      }
    }
  },
  directives: {
    outside: {
      bind (el, binding, vnode) {
        function clickHandler (e) {
          // 这里判断点击的元素是否是本身，是本身，则返回
          if (el.contains(e.target)) {
            return false
          }
          // 判断指令中是否绑定了函数
          if (binding.expression) {
            // 如果绑定了函数 则调用那个函数，此处binding.value就是handleClose方法
              binding.value(e)
          }
        }
        // 给当前元素绑定个私有变量，方便在unbind中可以解除事件监听
        el.__vueClickOutside__ = clickHandler
        document.addEventListener('click', clickHandler)
      },
      update () {},
      unbind (el, binding) {
        // 解除事件监听
        document.removeEventListener('click', el.__vueClickOutside__)
        delete el.__vueClickOutside__
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.dateBox ::v-deep .el-range-input {
  font-size: 12px !important;
}
.dateBox ::v-deep .el-range-separator{
  font-size: 12px !important;
}
.amountInput {
  width: 100%;
  .smallValue {
    float: left;
    width: 46%;
  }
  .between{
    float: left;
    width: 8%;
    height: 35px;
    line-height: 35px;
    text-align: center;
  }
  .bigValue{
    float:right;
    width: 46%;
  }
}
.pop_btn { display: flex; justify-content: flex-end; margin-top: 5px; }
.curser { cursor: pointer;}
</style>
