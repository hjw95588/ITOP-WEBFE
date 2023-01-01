<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import * as echarts from 'echarts';
require('echarts/theme/macarons') // echarts theme
import resize from '../mixins/resize'

export default {
  name: 'DoughnutChart',
  mixins: [resize],
  props: {
    doughuntData: {
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
      const nameArr = this.doughuntData.map(item => item.repositoryCode)
      return nameArr
    },
    _valData () {
      const valArr = this.doughuntData.map(item => ({
        name: item.repositoryCode,
        value: item.num
      }))
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
          trigger: 'item'
        },
        legend: {
          bottom: '0',
          left: 'center',
          // data: ['Search', 'Direct', 'Email', 'Union', 'Video']
          data: this._nameData
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '40',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: this._valData
            // data: [
            //   { value: 1048, name: 'Search' },
            //   { value: 735, name: 'Direct' },
            //   { value: 580, name: 'Email' },
            //   { value: 484, name: 'Union' },
            //   { value: 300, name: 'Video' }
            // ]
          }
        ]
      })
    }
  }
}
</script>
