<template>
  <div class="pdfPreviewIframe">
    <iframe src="" width="100%" height="100%" frameborder="0"></iframe>
  </div>
</template>

<script>
export default {
  name: 'PdfView',
  props: {
    pdfSrc: ''
  },
  data () {
    return {
      unPdfWatch: null
    }
  },
  mounted () {
    const urlIp = document.location.origin.toString()
    this.unPdfWatch = this.$watch('pdfSrc', (newVal) => {
      if (newVal) {
        document.getElementsByTagName('iframe')[0].src = `${process.env.BASE_URL}pdfjs/web/viewer.html?file=${this.pdfSrc}&disabledownload=true`;
      }
    }, {
      immediate: true
    })
  },
  methods: {
    closePreviewer () {
      this.$emit('clicPdfkModal')
    }
  }
}
</script>
<style lang="scss" scoped>
  .pdfPreviewIframe { height: 100%;}
</style>