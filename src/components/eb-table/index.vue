<template>
  <div class="ebank-form-table">
    <div class="label" :class="{ 'is-required': required }" :style="{width:labelWidth+'px'}">
      {{ label }}
    </div>
    <div class="right">
      <div class="table-container">
        <div class="header">
          <div class="item" v-for="(item, index) in tableHeader" :key="index">
            {{ item.label }}
          </div>
          <div class="item">
            <i class="el-icon-circle-plus-outline" @click="addTableItem"></i>
          </div>
        </div>
        <div class="main">
          <div class="row" v-for="(item, index) in tableList" :key="index">
            <div class="item" v-for="(it, ind) in tableHeader" :key="ind">
              <!-- {{it.type}} -->
              <el-input
                :type="it.type"
                v-model="tableList[index][it.prop]"
                placeholder="请输入内容"
              ></el-input>
            </div>
            <div class="item">
              <i
                class="el-icon-remove-outline"
                @click="removeTableItem(index)"
              ></i>
            </div>
          </div>
        </div>
      </div>
      <div class="tip" v-if="showValidateText">{{label}}不能为空</div>
    </div>
  </div>
</template>
<script>
import deepClone from "clone-deep";
export default {
  props: {
    labelWidth: {
      type: String,
      default: "200"
    },
    label: {
      type: String,
      default: ""
    },
    required: {
      type: Boolean,
      default: false
    },
    tableHeader: {
      type: Array,
      default: () => []
    },
    tableItemBak: {
      type: Object,
      default: () => ({})
    },
    tableList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      showValidateText:false
      /* tableHeader: [
        { label: "姓名", prop: "name", type: "text" },
        { label: "性别", prop: "gender", type: "number" },
        { label: "年龄", prop: "age", type: "number" }
      ],
      tableItemBak: {
        name: "",
        gender: "",
        age: ""
      },
      tableList: [
        {
          name: "1",
          gender: "11",
          age: "111"
        },
        {
          name: "2",
          gender: "22",
          age: "111"
        }
      ] */
    };
  },
  methods: {
    addTableItem() {
      let item = deepClone(this.tableItemBak);
      this.tableList.push(item);
    },
    removeTableItem(index) {
      this.tableList.splice(index, 1);
    },
    // true--校验通过;false--校验不通过
    validate() {
      let list = this.tableList;
      if (list.length === 0) {
        this.showValidateText = false
        return true;
      }
      let res = list.every(item => {
        let flag = true;
        for (let i in item) {
          if (!item[i]) {
            flag = false;
            break;
          }
        }
        return flag;
      });
      this.showValidateText = !res
      return res;
    }
  }
};
</script>
<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';
.ebank-form-table {
  display: flex;
  font-size: 14px;
  border-left: 1px solid #fff;
  .label {
    width: 200px;
    text-align: right;
    color: #606266;
    padding: 10px;
    &.is-required::before {
      content: "*";
      color: $colorDanger;
      margin-right: 4px;
    }
  }
  .right{
    flex: 1;
  }
  .table-container {

    border-left: 1px solid #dcdfe6;
    border-top: 1px solid #dcdfe6;
  }
  .header {
    display: flex;
    height: 34px;
    // background-color: #4F7D96;
    background-image: linear-gradient(to right, #D9E6EB , #4F7D96);
    .item {
      text-align: center;
    }
  }
  .row {
    display: flex;
    .item {
      ::v-deep .el-input .el-input__inner {
        border: 0 !important;
      }
    }
    .item:nth-last-child(1) {
      text-align: center;
    }
  }
  .item {
    flex: 1;
    line-height: 34px;
    border-right: 1px solid #dcdfe6;
    border-bottom: 1px solid #dcdfe6;
  }
  .item:nth-last-child(1) {
    flex: none;
    width: 50px;
  }
  .tip{
    color: $colorDanger;
    font-size: 12px;
    line-height: 1;
    padding-top: 4px;
  }
}
</style>
