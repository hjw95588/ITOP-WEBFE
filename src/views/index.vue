<template>
  <div class="dashboard-editor-container">
    <div class="page-header">
      <div class="page-header-heading">
        <div class="page-header-heading-left">
          <span class="page-header-heading-title">Dashboard</span>
        </div>
      </div>
      <el-row class="page-container">
        <el-col :span="16" class="page-container-left">
          <div class="page-container-avatar">
            <span class="page-left-avatar">
              <img :src="avatar" />
            </span>
          </div>
          <div class="page-container-content">
            <div class="page-container-content-title">
              {{ timeState }}，{{ name }}，祝你开心每一天！
            </div>
            <div class="page-container-content-title2">
              {{ post }} | {{ dept }}
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="page-container-right">
            <div class="page-container-content-item">
              <div class="page-container-content-item-statistic">
                <div class="page-container-content-item-statistic-title">
                  项目数
                </div>
                <div class="page-container-content-item-statistic-content">
                  <count-to
                    ref="example1"
                    :start-val="_startVal"
                    :end-val="59"
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
            </div>
            <div class="page-container-content-item">
              <div class="page-container-content-item-statistic">
                <div class="page-container-content-item-statistic-title">
                  团队排名
                </div>
                <div class="page-container-content-item-statistic-content">
                  <count-to
                    ref="example2"
                    :start-val="_startVal"
                    :end-val="22"
                    :duration="_duration"
                    :decimals="_decimals"
                    :separator="_separator"
                    :prefix="_prefix"
                    :suffix="_suffix"
                    :autoplay="false"
                    class="example"
                  />/
                  <count-to
                    ref="example3"
                    :start-val="_startVal"
                    :end-val="889"
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
            </div>
            <div class="page-container-content-item">
              <div class="page-container-content-item-statistic">
                <div class="page-container-content-item-statistic-title">
                  项目访问
                </div>
                <div class="page-container-content-item-statistic-content">
                  <count-to
                    ref="example4"
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
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-row class="page-center">
      <el-col :span="16" style="padding-right: 16px">
        <el-card class="todo-list">
          <div slot="header">
            <span style="font-size: 16px">待办任务</span>
            <el-button
              style="float: right; padding: 3px 0"
              type="text"
              @click="getWorkList()"
              >查看更多</el-button
            >
          </div>
          <todo-list />
        </el-card>
        <el-card style="margin-top: 10px">
          <line-chart :chart-data="lineChartData" />
        </el-card>
        <el-row :gutter="16" style="margin-top: 16px">
          <el-col :xs="24" :sm="24" :lg="12">
            <div class="chart-wrapper">
              <raddar-chart />
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :lg="12">
            <div class="chart-wrapper">
              <pie-chart />
            </div>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="8">
        <el-card class="todo-list">
          <div slot="header">
            <span style="font-size: 16px">快速开始</span>
          </div>
          <el-tag
            v-for="o in 8"
            :key="o"
            effect="plain"
            size="medium"
            style="margin: 5px"
            >{{ "快速开始 " + o }}</el-tag
          >
          <el-tag effect="plain" size="medium" type="info"> + 添加</el-tag>
        </el-card>
        <el-card style="margin-top: 10px">
          <div slot="header">
            <span style="font-size: 16px">项目运行指数</span>
          </div>
          <div class="chart-wrapper">
            <raddar-chart />
          </div>
        </el-card>
        <el-row :gutter="16" style="margin-top: 16px">
          <el-col :xs="24" :sm="24" :lg="24">
            <div class="chart-wrapper">
              <bar-chart />
            </div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-tooltip placement="top" content="回到顶部">
      <back-to-top :custom-style="myBackToTopStyle" :visibility-height="200" :back-position="50" transition-name="fade" />
    </el-tooltip>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import PanelGroup from "./dashboard/PanelGroup";
import LineChart from "./dashboard/LineChart";
import RaddarChart from "./dashboard/RaddarChart";
import PieChart from "./dashboard/PieChart";
import BarChart from "./dashboard/BarChart";
import TodoList from "./dashboard/TodoList";
import countTo from "vue-count-to";
import BackToTop from '@/components/BackToTop'

const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145],
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130],
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130],
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130],
  },
};

export default {
  name: "Index",
  components: {
    PanelGroup,
    LineChart,
    RaddarChart,
    PieChart,
    BarChart,
    TodoList,
    countTo,
    BackToTop
  },
  data() {
    return {
      lineChartData: lineChartData.newVisitis,
      currentDate: "2020-06-19",
      timeState: "早安",
      dept: "",
      post: "",
      setStartVal: 0,
      setEndVal: 99,
      setDuration: 4000,
      setDecimals: 0,
      setSeparator: ",",
      // setSuffix: ' rmb',
      // setPrefix: '¥ '
      // customizable button style, show/hide critical point, return position
      myBackToTopStyle: {
        right: '50px',
        bottom: '50px',
        width: '40px',
        height: '40px',
        'border-radius': '4px',
        'line-height': '45px', // 请保持与高度一致以垂直居中 Please keep consistent with height to center vertically
        background: '#e7eaf1'// 按钮的背景颜色 The background color of the button
      }
    };
  },
  beforeRouteLeave (to, from, next) {
    if (to.name === 'WorkDetailBrowse' || to.name === 'WorkDetailHandle') {
      to.meta.activeMenu = '/index'
    }
    next()
  },
  mounted() {
    this.getTimeState();
    this.initPostAndDept();
    this.startCountTo();
  },
  computed: {
    ...mapGetters(["avatar", "name", "depts", "fullDepts", "posts"]),
    _startVal() {
      if (this.setStartVal) {
        return this.setStartVal;
      } else {
        return 0;
      }
    },
    _endVal() {
      if (this.setEndVal) {
        return this.setEndVal;
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
    },
  },
  methods: {
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type];
    },
    getTimeState() {
      let timeNow = new Date();
      let hours = timeNow.getHours();
      if (hours >= 0 && hours <= 10) {
        this.timeState = `早上好`;
      } else if (hours > 10 && hours <= 14) {
        this.timeState = `中午好`;
      } else if (hours > 14 && hours <= 18) {
        this.timeState = `下午好`;
      } else if (hours > 18 && hours <= 24) {
        this.timeState = `晚上好`;
      }
    },
    initPostAndDept() {
      if (this.posts.length > 0) {
        this.post = this.posts[0].postName;
      } else {
        this.post = "员工";
      }
      if (this.fullDepts != "") {
        let deptJson = JSON.parse(JSON.stringify(this.fullDepts));
        let deptStr = "";
        for (var key in deptJson) {
          deptStr += deptJson[key] + "/";
        }
        this.dept = deptStr.substr(0, deptStr.length - 1);
      } else {
        this.dept = "暂无";
      }
    },
    getWorkList() {
      this.$router.push({
        path: "/work/work-list",
      });
      return;
    },
    startCountTo() {
      this.$refs.example1.start();
      this.$refs.example2.start();
      this.$refs.example3.start();
      this.$refs.example4.start();
    },
    pauseResumeCountTo() {
      this.$refs.example.pauseResume();
    },
  },
};
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  background-color: rgb(240, 242, 245);
  position: relative;
  padding: 10px;
  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
  .page-header {
    padding: 0px 24px 16px 24px;
    background-color: #fff;
    .page-header-heading {
      margin-bottom: 8px;
      display: flex;
      justify-content: space-between;
    }
  }
  .page-header-heading-left {
    display: flex;
    align-items: center;
    margin: 4px 0px;
    overflow: hidden;
    .page-container-content {
      top: 4px;
      flex: 1 1 auto;
      margin-left: 24px;
      color: rgba(0, 0, 0, 0.45);
      line-height: 22px;
    }
  }
  .page-header-heading-title {
    margin-right: 12px;
    margin-bottom: 0px;
    color: rgba(0, 0, 0, 0.85);
    font-weight: 600;
    font-size: 20px;
    line-height: 32px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .page-container {
    display: flex;
    width: 100%;
  }
  .page-container-left {
    display: flex;
    flex: auto;
    width: 100%;
  }
  .page-left-avatar {
    flex: 0 1 72px;
    display: block;
    width: 72px;
    height: 72px;
    border-radius: 72px;
    img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .page-container-content {
    position: relative;
    top: 4px;
    flex: 1 1 auto;
    margin-left: 24px;
    color: rgba(0, 0, 0, 0.45);
    line-height: 22px;
    .page-container-content-title {
      margin-bottom: 12px;
      color: rgba(0, 0, 0, 0.85);
      font-weight: 500;
      font-size: 20px;
      line-height: 28px;
    }
    .page-container-content-title2 {
      box-sizing: border-box;
      color: rgba(0, 0, 0, 0.45);
      font-size: 16px;
    }
  }
  .page-container-right {
    zoom: 1;
    float: right;
    white-space: nowrap;
    .page-container-content-item {
      position: relative;
      display: inline-block;
      padding: 0 32px;
      ::after {
        position: absolute;
        top: 8px;
        right: 0;
        width: 1px;
        height: 40px;
        background-color: #f0f0f0;
        content: "";
      }
      :last-child {
        padding-right: 0px;
      }
      .page-container-content-item-statistic {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        color: rgba(0, 0, 0, 0.85);
        font-size: 14px;
        font-variant: tabular-nums;
        line-height: 1.5715;
        list-style: none;
        font-feature-settings: "tnum", "tnum";
      }
      .page-container-content-item-statistic-title {
        margin-bottom: 4px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
      }
      .page-container-content-item-statistic-content {
        color: #2a435b;
        font-size: 24px;
        font-weight: bold;
      }
    }
  }
  .page-center {
    margin-bottom: 16px;
    margin-top: 16px;
  }
  .button-new-tag {
    height: 30px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
}
</style>