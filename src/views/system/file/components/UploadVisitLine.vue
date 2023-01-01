<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import * as echarts from 'echarts';
require('echarts/theme/macarons') // echarts theme
import resize from '../mixins/resize'

export default {
  name: 'UploadVisitLine',
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
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['1月', '2月', '3月', '4月', '5月']
        },
        legend: {
          left: 'center',
          bottom: '0',
          data: ['上传量', '访问量']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '上传量',
            symbol: 'none',
            data: [150, 230, 224, 218, 135],
            type: 'line'
          },
          {
            name: '访问量',
            symbol: 'none',
            data: [190, 240, 229, 210, 138],
            type: 'line'
          }
        ]
      })
    }
  }
}
</script>
