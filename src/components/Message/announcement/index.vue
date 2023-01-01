<template>
  <div class="announMain">
    <ul class="announList" v-show="!isShowCont">
      <li
        class="announItem"
        v-for="announItem in announList"
        :key="announItem.noticeId"
        @click="lookAnnounInfo(announItem.noticeId)"
      >
        <span class="announTitle">
          <el-badge class="badgeDot" :is-dot="announItem.readState === '0'">{{
            announItem.noticeTitle
          }}</el-badge>
        </span>
        <div class="announCont" v-html="announItem.noticeContent"></div>
        <p class="annountCreaTime">{{ announItem.createTime }}</p>
      </li>
    </ul>
    <div class="btnWrap" v-show="!isShowCont">
      <el-button
        type="primary"
        plain
        :disabled="disabledStatu"
        @click="checkMore"
        >{{ btnText }}</el-button
      >
    </div>
    <announ-cont
      :isShowCon="isShowCont"
      :announCon="announContent"
      @closeConte="closeChildCont"
    ></announ-cont>
  </div>
</template>

<script>
import AnnounCont from "./components/announcont";
import { noticeAnoun, annouNotic } from "@/api/system/notice";
export default {
  name: "Announcement",
  components: { AnnounCont },
  data() {
    return {
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        noticeType: "2",
      },
      announList: [], // 公告列表
      btnText: "查看更多",
      disabledStatu: false, // 更多按钮禁点
      isShowCont: false, // 子组件状态控制
      announContent: {}, // 子组件数据
    };
  },
  created() {
    this.getAnnounList();
  },
  updated () {
    const contWrap = document.getElementsByClassName('announList')[0]
    if (contWrap) {
      const allP = contWrap.getElementsByTagName('p')
      for (var i = 0; i < allP.length; i ++) {
        allP[i].classList.add('contInfo')
      }
    }
  },
  methods: {
    // 获取列表数据
    getAnnounList() {
      noticeAnoun(this.queryParams).then((res) => {
        this.announList = this.announList.concat(res.rows);
        if (res.rows.length < this.queryParams.pageSize) {
          this.disabledStatu = true;
          this.btnText = "无更多公告";
        } else {
          this.disabledStatu = false;
          this.btnText = "查看更多";
        }
      });
    },
    // 查看更多
    checkMore() {
      this.queryParams.pageNum++;
      this.getAnnounList();
    },
    // 查看详情
    lookAnnounInfo(id) {
      annouNotic(id).then((res) => {
        if (res.code === 200) {
          this.announContent = res.data;
          this.isShowCont = true;
        }
      });
    },
    // 子组件关闭
    closeChildCont(value) {
      this.announList = [];
      this.getAnnounList();
      this.$emit("getAnnounCont");
      this.isShowCont = value;
    },
  },
};
</script>

<style lang="scss" scoped>
.announMain {
  position: relative;
  height: 470px;
  // margin: 0;
  padding: 10px 24px 0;
  overflow: auto;
  .announItem {
    border: 1px solid #d9d9d9;
    border-radius: 6px;
    margin-top: 18px;
    padding: 5px;
    &:first-child { margin: 0;}
    p { margin: 0; }
  }
  .announTitle { font-size: 16px; line-height: 22px; font-weight: 500;}
  .annountCreaTime {
    color: #999;
    text-align: right;
    font-size: 13px;
    line-height: 18px; 
  }
  .btnWrap {
    margin-top: 10px;
    text-align: center;
  }
  ul {
    padding-inline-start: 0px;
  }
}
::v-deep .badgeDot.el-badge {
  max-width: 95%;
  padding: 0;
  font-size: 14px !important;
  line-height: 16px !important;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
::v-deep .badgeDot .el-badge__content.is-fixed {
  top: 5px !important;
  right: 0px !important;
  height: 14px !important;
  width: 14px !important;
}
::v-deep .badgeDot .el-badge__content.is-fixed.is-dot {
  top: 0px !important;
  right: 0px !important;
  height: 14px !important;
  width: 14px !important;
}
::v-deep .el-button--primary.is-plain { font-size: 14px; line-height: 20px; padding: 0 15px;}
</style>