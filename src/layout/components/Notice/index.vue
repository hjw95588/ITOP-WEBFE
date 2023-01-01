<template>
  <el-dropdown class="right-menu-item" trigger="click" ref="messageDrop" @visible-change="visibaleChange">
    <div class="notice-container">
      <svg-icon icon-class="bell" />
      <el-badge
        v-if="unreadTotal > 0"
        :value="unreadTotal"
        :max="99"
        class="right-menu-bage"
      />
    </div>
    <message :navVisible="isVisible" @messageDropHide="messageDropHide"></message>
  </el-dropdown>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import Message from "@/components/Message";
export default {
  components: { Message },
  data() {
    return {
      isVisible: false // 控制子组件tab
    };
  },
  created() {
    this.getUnreadTotal();
  },
  computed: {
    ...mapGetters(["noticeUnreadCont", "dealWithCont", "annountCont"]),
    unreadTotal: (vm) => {
      const total = vm.noticeUnreadCont + vm.annountCont + vm.dealWithCont;
      return total;
    },
  },
  methods: {
    ...mapActions(["GetUnreadCont", "GetToDoCont", "GetAnnounCont"]),
    async getUnreadTotal() {
      await this.GetUnreadCont();
      await this.GetToDoCont();
      await this.GetAnnounCont();
    },
    messageDropHide() {
      this.$refs.messageDrop.hide();
    },
    visibaleChange (val) {
      this.isVisible = val
    }
  },
};
</script>

<style lang="scss" scoped>
.notice-container {
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0;
  cursor: pointer;
  transition: all 0.3s;
  .right-menu-bage {
    margin: -12px -17px 0px -10px;
  }
}
.right-menu-item ::v-deep .el-dropdown-menu {
  padding: 0;
}
.right-menu-item ::v-deep .el-dropdown-menu--medium {
  padding: 0;
}
</style>
