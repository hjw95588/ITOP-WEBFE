<template>
  <div class="table_list">
    <!-- v-if="tableData.length !== 0 " -->
    <el-table
      :data="tableData"
      highlight-current-row
      :cell-class-name="cellStyle"
      @cell-click="cellClick"
      @row-click="ClickCurrentRow"
      :fit="true"
    >
      <el-table-column label="序号" :width="indexWidth" align="center">
        <template slot-scope="scope">
          <span>{{ (pageNum - 1) * pageSize + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <template v-for="(columHeader, index) in headerData">
        <el-table-column
          v-if="!!columHeader.filltype && columHeader.filltype!='birth'"
          :key="columHeader.prop"
          :prop="columHeader.prop"
          :align="columHeader.align"
          v-bind="columHeader.attrs"
          :width="columHeader.width || 'auto'"
        >
          <template slot="header">
            <div class="filt_wrap">
              <span>{{ columHeader.label }}</span>
              <pop-filte class="pop_wrap"
                         :popIndex="index"
                         :componentModule="columHeader.filltype"
                         v-on="columHeader.listeners"
                         :tableType="columHeader.tableType"
                         :optionsname="columHeader.optionsname" />
            </div>
          </template>
        </el-table-column>
        <el-table-column
          v-else-if="!!columHeader.filltype && columHeader.filltype=='birth'"
          :key="columHeader.prop"
          :label="columHeader.label"
          :align="columHeader.align"
          v-bind="columHeader.attrs"
          :width="columHeader.width || 'auto'"
        >
          <template  slot-scope="scope">
            <xin :userInfo="tableData[scope.$index]"></xin>
          </template>
        </el-table-column>

        <el-table-column
          v-else
          :key="columHeader.prop"
          :prop="columHeader.prop"
          :label="columHeader.label"
          :align="columHeader.align"
          v-bind="columHeader.attrs"
          :width="columHeader.width || 'auto'"
        >
        </el-table-column>


      </template>
    </el-table>
  </div>
</template>

<script>
import PopFilte from './components/PopFilte.vue'
import xin from "./components/xin"
export default {
  name: 'TableList',
  components: { PopFilte,xin },
  props: {
    //每一列样式
    cellStyle:{
    },
    tableData: {
      type: Array,
      default: () => []
    },
    headerData: {
      require: true,
      type: Array
    },
    indexWidth: {
      type: String,
      default: '50'
    },
    pageNum: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 10
    }
  },
  // watch: {
  //   tableData: {
  //     handler: function (val) {
  //       if (val.length !== 0) {
  //         this.$nextTick(() => {
  //           this.columHeaders = this.headerData
  //         })
  //       }
  //     },
  //     deep: true,
  //     immediate: true
  //   }
  // },
  // created () {
  //   console.log(this.headerData)
  // },
  data () {
    return {
      iconColor: false,
      columHeaders: []
    }
  },
  methods: {
    ClickCurrentRow (row) { // 点击列表当前行
      this.$emit('ClickRow', row)
    },
    cellClick(row, column, cell, event){
      //点击 某一cell(单元格)
      this.$emit('cellClick', row, column, cell, event)
    }
  }
}
</script>

<style lang="scss" scoped>
.filt_wrap { display: flex;  justify-content: center; }
::v-deep .el-table__body-wrapper::-webkit-scrollbar { height: 9px; border-radius: 5px;}
::v-deep .el-table__body-wrapper::-webkit-scrollbar-thumb { height: 9px; background: rgba(0,0,0,0.05); border-radius: 5px; }
</style>
