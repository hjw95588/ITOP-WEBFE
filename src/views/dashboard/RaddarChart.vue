<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import * as echarts from 'echarts';
require('echarts/theme/vintage')
import resize from './mixins/resize'

const animationDuration = 3000

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '500px'
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el)
      this.chart.setOption({
          title: {
              // text: '基础雷达图'
          },
          legend: {
              data: ['预算分配', '实际开销']
          },
          radar: {
              // shape: 'circle',
              indicator: [
                  { name: '销售', max: 6500},
                  { name: '管理', max: 16000},
                  { name: '信息技术', max: 30000},
                  { name: '客服', max: 38000},
                  { name: '研发', max: 52000},
                  { name: '市场', max: 25000}
              ]
          },
          series: [{
              name: '预算 vs 开销',
              type: 'radar',
              data: [
                  {
                      value: [4200, 3000, 20000, 35000, 50000, 18000],
                      name: '预算分配'
                  },
                  {
                      value: [5000, 14000, 28000, 26000, 42000, 21000],
                      name: '实际开销'
                  }
              ]
          }]
      })
    }
  }
}
</script>
