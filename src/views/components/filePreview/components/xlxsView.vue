<template>
  <div style="height: 100%; background: #fff;">
    <iframe :src="xlxsSrc" width="100%" height="100%" frameborder="0"></iframe>
  </div>
</template>

<script>
export default {
  name: 'PdfView',
  props: {
    xlxsSrc: ''
  }
}
</script>
