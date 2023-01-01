<template>
  <div class="picturePreview">
    <img style="display: none;" id="img" ref="imgEle" :src="imgSrc">
  </div>
</template>

<script>
import 'viewerjs/dist/viewer.css';
import Viewer from 'viewerjs';
export default {
  name: 'Picture',
  props: {
    imgSrc: ''
  },
  data () {
    return {
      unPriviewWath: null
    }
  },
  mounted () {
    const self = this
    this.unPriviewWath = this.$watch('imgSrc', (newVal) => {
      if (newVal) {
        const element = document.getElementById('img')
        const viewerCon = new Viewer(element, {
          inline: true,
          viewed() {
            viewerCon.zoomTo(1);
          },
          button: false,
          fullscreen: false
        });
        viewerCon.show()
      }
    }, {
      immediate: true
    })
  },
  beforeDestroy () {
    this.unPriviewWath()
  }
}
</script>

<style lang="scss" scoped>
  .picturePreview { height: 100%;}
  ::v-deep .viewer-container.viewer-backdrop { position: relative; height: 100%!important;}
</style>