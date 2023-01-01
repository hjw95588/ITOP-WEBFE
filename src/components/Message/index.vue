<template>
<el-dropdown-menu style="width:510px;">
    <el-container>
      <div class="messageTitle">通知公告</div>
      <el-header>
        <div v-if="navVisible">
          <el-tabs v-model="columnTabIndex" @tab-click="handleSelect">
            <el-tab-pane name="first">
              <span slot="label">
                <i class="el-icon-bell"></i>
                <span>通知</span>
                <i class="dot">{{ noticeUnreadCont }}</i>
              </span>
            </el-tab-pane>
            <el-tab-pane name="second">
              <span slot="label">
                <i class="el-icon-document"></i>
                <span>待办</span>
                <i class="dot">{{ dealWithCont }}</i>
              </span>
            </el-tab-pane>
            <el-tab-pane name="third">
              <span slot="label">
                <i class="el-icon-chat-square"></i>
                <span>公告</span>
                <i class="dot">{{ annountCont }}</i>
              </span>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-header>
      <el-main>
        <notice v-if="columnTabIndex === 'first'" @getUnreadCont="GetUnreadCont"/>
        <deal-with v-if="columnTabIndex === 'second'" @goTaskInfo="taskInfo"/>
        <announcement v-if="columnTabIndex === 'third'" @getAnnounCont="GetAnnounCont" />
      </el-main>
    </el-container>
  </el-dropdown-menu>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import Notice from './notice'
import DealWith from './dealwith'
import Announcement from './announcement'
export default {
  name: 'Message',
  components: { Notice, DealWith, Announcement },
  props: {
    messageDialog: {
      type: Boolean,
      default: false
    },
    navVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      columnTabIndex: 'first'
    }
  },
  computed: {
    ...mapGetters(['noticeUnreadCont', 'dealWithCont', 'annountCont']),
  },
  methods: {
    ...mapActions(['GetUnreadCont', 'GetToDoCont', 'GetAnnounCont']),
    closeDialog () {
      this.columnTabIndex = ''
      this.$emit('messageDropHide')
    },
    handleSelect (tab) {
      this.columnTabIndex = tab.name
      switch (this.columnTabIndex) {
        case 'first':
          this.GetUnreadCont()
          break
        case 'second':
          this.GetToDoCont()
          break
        default:
          this.GetAnnounCont()
      }
    },
    async getAllTotal () {
      this.columnTabIndex = 'first'
    },
    taskInfo () {
      this.closeDialog()
    }
  }
}
</script>

<style lang="scss" scoped>
  // ::v-deep .el-header { height: 32px !important; box-shadow: 0 1px 4px rgba(0 21 41 / 0.08)}
  ::v-deep .el-dialog__body { padding-left: 0; padding-right: 0; padding-bottom: 0;}
  ::v-deep .el-header { padding: 5px 0 !important;
      height: auto !important;
      box-sizing: content-box;
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #333;
      line-height: 22px;
  }
  ::v-deep .el-tabs__header {
    padding: 0;
    position: relative;
  }
  ::v-deep .el-main { padding: 0 !important;}
  ::v-deep .el-tabs__item { font-size: 16px; }
  ::v-deep .el-tabs__content { display: none;}
  .messageTitle { padding: 15px 24px 15px; font-size: 18px; line-height: 1; color: rgba(0, 0, 0, 0.85); border-bottom: 1px solid rgba(0, 0, 0, 0.06);}
  .el-tabs { padding: 0 24px;}
  .dot {
    margin-left: 5px;
    padding: 0 5px;
    height: 16px;
    font-style: normal;
    border-radius: 8px;
    background: #FF6161;
    font-size: 10px;
    color: #fff;
    line-height: 16px;
  }
</style>