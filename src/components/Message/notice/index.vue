<template>
  <div class="container">
    <div class="noticeHeader">
      <div class="btnTab">
        <el-button :type="activeName === '0' ? 'primary' : '' " @click="handleClick('0')">未读</el-button>
        <el-button :type="activeName === '1' ? 'primary' : '' " @click="handleClick('1')">已读</el-button>
      </div>
      <el-button v-show="activeName === '0'" :disabled="canClick" class="textBtn" type="text" @click="readAll">全部已读</el-button>
    </div>
    <div class="noticeMain" v-if="noticeTotal !== 0">
      <ul class="noticeList">
        <li class="noticeItem" v-for="noticeItem in noticeList" :key="noticeItem.noticeId" @click="lookCont(noticeItem.noticeId)">
          <div class="iconWrap"><span class="el-icon-chat-dot-square"></span></div>
          <div class="noticConWrap">
            <p class="noticTitle">{{noticeItem.noticeTitle}}</p>
            <p class="noticCreTime" style="color: #666; font-size: 12px; font-weight: 400;">{{noticeItem.createTime}}</p>
          </div>
        </li>
      </ul>
      <pagination
        v-show="noticeTotal>0"
        :total="noticeTotal"
        :layout="pageNationLay"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getNoticeList"
      />
    </div>
    <notice-cont v-if="noticeTotal !== 0" :showCont.sync="isShowCont" @closeConte="closeChildCont" :noticCon="noticeContent"></notice-cont>
    <el-empty v-if="noticeTotal === 0" description="暂无数据"></el-empty>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import Pagination from '@/components/Pagination'
import NoticeCont from './components/noticeCont'
import { noticeAnoun, annouNotic, toReadAll } from '@/api/system/notice'
export default {
  name: 'Notice',
  components: { Pagination, NoticeCont },
  data () {
    return {
      activeName: '0', // 未读已读标记
      noticeList: [], // 通知列表
      canClick: true, // 全部已读按钮是否可点
      noticeTotal: 0, // 数据总数
      pageNationLay: 'prev, pager, next', // 分页器的功能
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        noticeType: '1',
        readState: '0'
      },
      notListHeight: 0, // 列表高度
      isShowCont: false, // 控制通知详情
      noticeContent: {} // 通知详细
    }
  },
  created () {
    this.getNoticeList()
  },
  mounted () {
    this.$nextTick(() => {
      const windowHeight = document.documentElement.clientHeight; // 屏幕高度
      const offsetHeight = 40 + 50 + 30 + 40 + 60
      this.notListHeight = windowHeight - offsetHeight + 'px'
    })
  },
  methods: {
    ...mapActions(['GetUnreadCont']),
    handleClick (numString) {
      this.activeName = numString
      this.queryParams.readState = this.activeName
      this.getNoticeList()
    },
    // 获取通知列表
    async getNoticeList () {
      await noticeAnoun(this.queryParams).then(res => {
        if (res.code === 200) {
          this.noticeList = res.rows
          this.noticeTotal = res.total
           this.canClick = (this.activeName === '0' && res.total !== 0) ? false : true
        }
      })
    },
    // 查看详情
    lookCont (id) {
      annouNotic(id).then(res => {
        if (res.code === 200) {
          this.noticeContent = res.data
          this.isShowCont = true
          if (this.activeName === '0') {
            console.log('我掉了啊')
            this.$emit('getUnreadCont')
          }
        }
      })
    },
    // 全部已读按钮
    readAll () {
      toReadAll({ noticeType: '1' }).then(res => {
        if (res.code === 200) {
          this.GetUnreadCont()
          this.getNoticeList()
        }
      })
    },
    // 子组件关闭
    async closeChildCont (value) {
      if (this.activeName === '0') {
        this.getNoticeList()
      }
      this.isShowCont = value
    }
  }
}
</script>

<style lang="scss" scoped>
// box-shadow: 0 1px 4px rgba(0 21 41 / 0.08/)
  .container { position: relative; }
  .noticeMain { overflow: hidden; padding-top: 10px;}
  .noticeHeader { padding: 5px 24px;}
  .noticeList { height: 400px; margin: 0; padding: 0 24px; overflow: auto; }
  .noticeItem { display: flex; justify-content: flex-start; padding: 8px 0 10px 8px; border: 1px solid rgba(151, 151, 151, 0.35); border-radius: 10px; margin-top: 18px;
    &:first-child { margin: 0; }
    .noticConWrap { width: 90%; margin-left: 15px;  }
    .el-icon-chat-dot-square { position: relative; width: 40px; height: 40px; border-radius: 50%; background: #efecff; text-align: center;
      &::before { width: 30px; height: 30px; font-size: 20px; position: absolute; bottom: 0; left: 0; right: 0; margin: auto; color: #9a7efd }
    }
    .noticTitle { margin: 0; line-height: 22px; font-size: 16px; font-weight: 500; color: #333; text-overflow: ellipsis; overflow: hidden; white-space: nowrap; }
    .noticCreTime { font-size: 13px; line-height: 18px; color: #999; margin: 5px 0 0;}
  }
  ::v-deep .pagination-container {margin: 5px 0 0 0 !important; padding: 0 !important;}
  ::v-deep .el-empty { height: 437px; padding: 0 !important;}
</style>