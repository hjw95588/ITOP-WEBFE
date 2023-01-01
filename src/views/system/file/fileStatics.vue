<template>
  <div class="app-container" v-loading="loading">
    <div class="chartParent">
      <div class="border chart_item">
        <div class="chart_title">文档统计</div>
        <div class="chart_body">
          <div class="staticsItem">
            <div class="item_left">
              <div class="item_title">文件总数</div>
              <div class="item_count orange">
                  <count-to
                    ref="example1"
                    :start-val="_startVal"
                    :endVal="total"
                    :duration="_duration"
                    :decimals="_decimals"
                    :separator="_separator"
                    :prefix="_prefix"
                    :suffix="_suffix"
                    :autoplay="false"
                    class="example"
                  />
              </div>
            </div>
            <div class="item_right">
              <img src="@/assets/image/total.png" alt="">
            </div>
          </div>
          <div class="staticsItem">
            <div class="item_left">
              <div class="item_title">昨日上传</div>
              <div class="item_count green">
                  <count-to
                    ref="example2"
                    :start-val="_startVal"
                    :end-val="yesterdayUpTotal"
                    :duration="_duration"
                    :decimals="_decimals"
                    :separator="_separator"
                    :prefix="_prefix"
                    :suffix="_suffix"
                    :autoplay="false"
                    class="example"
                  />
              </div>
            </div>
            <div class="item_right">
              <img src="@/assets/image/yupload.png" alt="">
            </div>
          </div>
          <!-- <div class="staticsItem">
            <div class="item_left">
              <div class="item_title">累计访问</div>
              <div class="item_count blue">
                  <count-to
                    ref="example3"
                    :start-val="_startVal"
                    :end-val="32434"
                    :duration="_duration"
                    :decimals="_decimals"
                    :separator="_separator"
                    :prefix="_prefix"
                    :suffix="_suffix"
                    :autoplay="false"
                    class="example"
                  />
              </div>
            </div>
            <div class="item_right">
              <img src="@/assets/image/visitTotal.png" alt="">
            </div>
          </div> -->
        </div>
      </div>
      <div class="chart_item chart_middle">
        <div class="border total_left">
          <div class="chart_title">文档数量</div>
          <div class="chart_body">
            <doughnut-chart v-if="isRequestComplete" :doughuntData="staticsData" />
          </div>
        </div>
        <div class="border total_right">
          <div class="chart_title">上传与访问量(单位)</div>
          <div class="chart_body">
            <upload-visit v-if="isRequestComplete" :uploadData="staticsData" />
          </div>
        </div>
      </div>
      <div class="border chart_item">
        <div class="chart_title">上传与访问量</div>
        <div class="chart_body">
          <upload-visit-line />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import countTo from "vue-count-to";
import DoughnutChart from './components/DoughnutChart.vue'
import UploadVisit from './components/UploadVisit.vue'
import UploadVisitLine from './components/UploadVisitLine.vue'
import { getFileStatics } from '@/api/system/file'
export default {
  name: 'StaticsChart',
  components: { countTo, DoughnutChart, UploadVisit, UploadVisitLine },
  data () {
    return {
      // COUNTTO参数
      setStartVal: 0,
      total: 0, // 总访问量
      yesterdayUpTotal: 0,
      setDuration: 0,
      setDecimals: 0,
      setSeparator: ",",
      staticsData: [],
      isRequestComplete: false, // 请求是否完成
      loading: false // 家在状态
    }
  },
  computed: {
     _startVal() {
      if (this.setStartVal) {
        return this.setStartVal;
      } else {
        return 0;
      }
    },
    _duration() {
      if (this.setDuration) {
        return this.setDuration;
      } else {
        return 100;
      }
    },
    _decimals() {
      if (this.setDecimals) {
        if (this.setDecimals < 0 || this.setDecimals > 20) {
          alert("digits argument must be between 0 and 20");
          return 0;
        }
        return this.setDecimals;
      } else {
        return 0;
      }
    },
    _separator() {
      return this.setSeparator;
    },
    _suffix() {
      return this.setSuffix;
    },
    _prefix() {
      return this.setPrefix;
    }
  },
  created () {
    this.getFileStatics()
  },
  methods: {
    // 获取统计数据
    getFileStatics () {
      this.loading = true
      getFileStatics().then(res => {
        if (res.code === 200) {
          this.total = res.data.totalNum
          this.yesterdayUpTotal = res.data.yesterdayNum
          this.staticsData = res.data.numStatisticsList
          this.startCountTo()
          this.isRequestComplete = true
          this.loading = false
        }
      })
    },
    startCountTo() {
      this.$refs.example1.start();
      this.$refs.example2.start();
    }
  }
}
</script>

<style scope lang="scss">
  .chartParent { padding: 10px 10px 24px; background: #fff;
    .chart_item { margin-bottom: 24px;
      &:last-child { margin: 0; }
    }
    .chart_middle { display: flex; justify-content: space-between;
      .total_left { width: 420px; margin-right: 24px;}
      .total_right { flex: 1;}
    }
    .border { border: 1px solid #E5E5E5; }
    .chart_title { height: 54px; padding-left: 24px; background: #F7F7F7; font-size: 14px; line-height: 54px;
      color: rgba(0, 0, 0, 0.85); font-family: PingFangSC-Regular, PingFang SC; font-weight: 400; border-bottom: 1px solid #E5E5E5;}
    .chart_body { display: flex; justify-content: space-around; padding: 30px;
      .staticsItem { display: flex; justify-content: space-between; align-items: center; width: 410px; box-sizing: content-box;
        padding: 16px 23px 16px 16px; border: 1px solid #E5E5E5; border-radius: 5px;
        .item_left { padding-right: 7; flex: 1;
          .item_title { font-size: 14px; font-family: PingFangSC-Regular, PingFang SC; font-weight: 400; color: #000000; line-height: 22px; }
          .item_count { font-size: 26px; font-family: PingFangSC-Semibold, PingFang SC; font-weight: 600; line-height: 38px; letter-spacing: 1px; text-overflow: ellipsis;
            overflow: hidden;
            &.orange { color: #EE8423;}
            &.green { color: #00BC97;}
            &.blue { color: #1A8CFF;}
          }
        }
        .item_right { width: 46px; height: 46px;
          img { display: block; width: 100%; height: 100%; }
        }
      }
    }
  }
</style>