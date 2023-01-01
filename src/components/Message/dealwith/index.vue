<template>
  <div class="container">
    <div class="noticeHeader">
      <div class="btnTab">
        <el-button :type="activeName === '0' ? 'primary' : '' " @click="handleClick('0')">待办</el-button>
        <el-button :type="activeName === '1' ? 'primary' : '' " @click="handleClick('1')">已办</el-button>
      </div>
    </div>
    <div class="dealwithMain" v-if="noticeTotal !== 0">
      <ul class="noticeList">
        <li class="noticeItem" v-for="noticeItem in noticeList" :key="noticeItem.id" @click="lookDealWith(noticeItem)">
          <div class="iconWrap"><span class="el-icon-tickets"></span></div>
          <div class="noticConWrap">
            <p class="noticTitle">{{noticeItem.taskName}}</p>
            <p class="noticCreTime">{{noticeItem.createTime}}</p>
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
    <el-empty v-if="noticeTotal === 0" description="暂无数据"></el-empty>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { mapGetters } from "vuex";
import { getTaskList } from '@/api/work'
export default {
  name: 'DealWith',
  components: { Pagination },
  data () {
    return {
      activeName: '0', // 待办已办标记
      noticeList: [], // 待办列表
      noticeTotal: 0, // 数据总数
      pageNationLay: 'prev, pager, next', // 分页器的功能
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        status: '0'
      },
      notListHeight: 0, // 列表高度
    }
  },
  created () {
    this.getNoticeList()
  },
  computed: {
    ...mapGetters(["userId"]),
  },
  mounted () {
    this.$nextTick(() => {
      const windowHeight = document.documentElement.clientHeight; // 屏幕高度
      const offsetHeight = 40 + 50 + 30 + 40 + 60 + 40
      this.notListHeight = windowHeight - offsetHeight + 'px'
    })
  },
  methods: {
    handleClick (numString) {
      this.activeName = numString
      this.queryParams.status = this.activeName
      this.queryParams.pageNum = 1
      this.getNoticeList()
    },
    // 获取通知列表
    async getNoticeList () {
      let userId = this.userId
      let { status, pageSize, pageNum } = this.queryParams
      let params = {
        userId,
        pageSize,
        pageNum,
        status
      }
      await getTaskList(params).then(res => {
        if (res.code === 200) {
          this.noticeList = res.rows
          this.noticeTotal = res.total
        }
      })
    },
    // 获取待办详情
    lookDealWith (row) {
      this.$store.commit("work/UPDATE_WORK_DETAIL", {row});
      this.$router.push({
        name: "WorkDetailHandle",
        params: { itemName: row.itemName },
      });
      this.$emit('goTaskInfo')
      return;
    },
  }
}
</script>

<style lang="scss" scoped>
//  box-shadow: 0 1px 4px rgba(0 21 41 / 0.08)
  .container { position: relative; }
  .dealwithMain { overflow: hidden; padding-top: 10px; }
  .noticeHeader { padding: 5px 24px;}
  .noticeList { height: 400px; margin: 0; padding: 0 24px; overflow: auto; }
  .noticeItem { display: flex; justify-content: flex-start; padding: 8px 0 10px 8px; border: 1px solid rgba(151, 151, 151, 0.35); border-radius: 10px; margin-top: 18px;
    &:first-child { margin: 0; }
    .noticConWrap { width: 90%; margin-left: 15px; }
    .el-icon-tickets { position: relative; width: 40px; height: 40px; border-radius: 50%; background: #efecff; text-align: center;
      &::before { width: 30px; height: 30px; font-size: 20px; position: absolute; bottom: 0; left: 0; right: 0; margin: auto; color: #ffac3e }
    }
    .noticTitle { margin: 0; line-height: 22px; font-size: 16px; font-weight: 500; text-overflow: ellipsis; overflow: hidden; white-space: nowrap; }
    .noticCreTime { font-size: 13px; line-height: 18px; color: #999; margin: 5px 0 0;}
  }
  ::v-deep .pagination-container {margin: 5px 0 0 0 !important; padding: 0 !important;}
  ::v-deep .el-empty { height: 437px; padding: 0 !important;}
</style>