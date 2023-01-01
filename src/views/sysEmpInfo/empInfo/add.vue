<template>
  <div class="app-container">
    <div class="main ebank-form">
      <el-tabs v-model="tabsValue" type="border-card" @tab-click="tabClickHander">
        <el-tab-pane
          v-for="(item, index) in tabList"
          :key="index"
          :label="item.title"
          :name="item.name"
        >
        </el-tab-pane>
      </el-tabs>
      <div class="content of-auto" :style="{ height: tabContainerHeight }">
        <!-- 基本信息 tabContainerHeight-->
        <div
          class="tab-container"
          v-if="tabsShow[0]"
          v-show="tabsValue === '1'"
        >
          <addForm ref="basicForm" :basicInfo="basicInfo" :detailDisabled="detailDisabled"/>
        </div>
      </div>
    </div>

    <div class="footer w-100 pad-t-10 pf r-0 b-10">
      <el-button type="primary" plain @click="closeMethod">关 闭</el-button>
    </div>
  </div>


</template>

<script>
import {  getEmpInfo } from "@/api/sysEmpInfo/empInfo";
import mixin from "@/views/pageDetail/mixin.js";
import AddForm from "./addForm"
export default {
  mixins: [mixin],
  name: 'add',
  components: {AddForm},
  data(){
    return{
      tabList: [
        { title: "业务信息", name: "1",}
      ],
      //信息
      basicInfo:{
      },
      tabsShow: [true, false, false, false],
      tabsValue: '1',
      processInstanceId: '',//流程实例id
      id: '',
      type: '',
      detailDisabled: false,//详情
    }
  },
  created() {
    const _params=this.$route.params;
    this.id=_params.id;
    this.type=_params.type;
    //如果id存在
    if(this.id) {
      if (this.type == 'detail') {
        // 详情页面 隐藏 保存，提交
        this.detailDisabled = true
      }else {
        this.tabList = this.tabList.slice(0, 1);
      }
      this.getDetail();//查询详情
    }else {
      //如果id不存在
      this.tabList = this.tabList.slice(0, 1);
    }
  },
  activated() {
    this.initPage();
  },
  methods: {
    /*切换table页*/
    tabClickHander() {
      let index = this.tabsValue - 1;
      this.tabsShow[index] = true;
    },
    /** 查看详情 */
    getDetail() {
      getEmpInfo(this.id).then(res => {
        if (res.code == 200) {
          this.basicInfo = res.data;//赋值

        }
      })
    },
    initPage() {
      let tabsShow = Array(4).fill(false);
      tabsShow[0] = true;
      this.tabsShow = JSON.parse(JSON.stringify(tabsShow));
      this.tabsValue = "1";
    },
    /** 关闭 */
    closeMethod(){
      this.$store.dispatch("tagsView/delView", this.$route);
      this.$router.go(-1);
    },
  }
}
</script>

<style lang="scss" scoped>
.el-select {
  width: 100%;
}

.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 100%;
}
.app-container {
  padding-bottom: 0;
}
.b-10 {
  padding-top: 10px;
  position: static;
}
@import "~@/assets/styles/ebank-form.scss";
</style>
