<template>
  <div id="app">
    <el-button @click="mapVisible=!mapVisible"> 打开 </el-button>
    <MapDialog :mapVisible="mapVisible" v-on:mapLocationClose="mapLocationClose"
                v-on:mapLocationSave="mapLocationSave"></MapDialog>
  </div>
</template>

<script>
import MapDialog from '../components/MapDialog.vue'

export default {
  name: 'app',
  components: {
    MapDialog
  },
  data () {
    return {
      mapVisible:false
    }
  },
  methods:{
    mapLocationClose(){
      this.mapVisible = false
    },
    mapLocationSave(e){
      console.log(e)
      this.mapVisible = false
    }
  }
}
</script>

