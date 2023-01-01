<template>
  <div class="formItem">
    <span class="ops-label-item">历史处理记录分组</span>
    <el-table :data="list" border style="width: 100%">
      <el-table-column prop="nodeName" label="步骤" width="180"> </el-table-column>
      <el-table-column prop="handler" label="处理人" width="180"> </el-table-column>
      <el-table-column prop="handlerDept" label="处理人部门"> </el-table-column>
      <el-table-column prop="result" label="处理结果"> </el-table-column>
      <el-table-column prop="handlerTime" label="处理时间"> </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {
  getHistoryList,
} from "@/api/work";
import { mapGetters } from 'vuex'
export default {
  components: {},
  name: "OpsList",
  inject: ['changeReadOnlyState'],
  data() {
    return {
      list: []
    };
  },
  computed:{
    ...mapGetters([
      "workDetail",
      "browseWorkDetail"
    ]),
    readOnlyState () {
      return this.changeReadOnlyState()
    },
  },
  created() {
    this.getList();
  },
  methods: {
    getList(){
      let processInstanceId = this.readOnlyState ? this.browseWorkDetail.processInstanceId : this.workDetail.processInstanceId;
      getHistoryList({processInstanceId}).then(
        res => {
          this.list = res.data;
        }
      );
    }
  },
  mounted() {}
};
</script>
<style lang="scss" scoped>
.ops-label-item {
  display: inline-block;
  line-height: 30px;
  padding: 0 10px;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  height: 30px;
  background-image: linear-gradient(to right, #d9e6eb, #4f7d96);
  color: #3a556e;
  font-weight: 600;
  font-size: 16px;
}
</style>
