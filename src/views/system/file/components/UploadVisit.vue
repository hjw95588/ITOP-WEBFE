<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import * as echarts from 'echarts';
require('echarts/theme/macarons') // echarts theme
import resize from '../mixins/resize'

export default {
  name: 'UploadVisit',
  mixins: [resize],
  props: {
    uploadData: {
      type: Array,
      default: () => {[]}
    },
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
  computed: {
    _nameData () {
      const nameArr = this.uploadData.map(item => item.repositoryCode)
      return nameArr
    },
    _valData () {
      const valArr = this.uploadData.map(item => item.num_30)
      return valArr
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
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          bottom: '0',
          left: 'center'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '10%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          boundaryGap: [0, 0.005]
        },
        yAxis: {
          type: 'category',
          data: this._nameData
        },
        series: [
          {
            name: '上传量',
            type: 'bar',
            data: this._valData
          }
        ]
      })
    }
  }
}
</script>
