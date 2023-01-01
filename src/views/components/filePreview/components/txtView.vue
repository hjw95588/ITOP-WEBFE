<template>
  <div style="background: #fff;">
    <div class="container">
      <div class="panel panel-default">
        <div class="panel-heading">
          <h4 class="panel-title">
            <a data-toggle="collapse" data-parent="#accordion" href="#collapseOne">{{fileName}}</a>
          </h4>
        </div>
        <div class="panel-body">
          <div v-if="suffix === 'txt'" id="divContent" class="divContent" v-html="htmlTxt"></div>
          <div ref="coder" v-else id="code" class='code'></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Base64 from '@/assets/js/base64.min.js'
import HightLight from '@/assets/js/highlight.min.js'
export default {
  name: 'TxtView',
  props: {
    textContent: {
      type: String,
      default: ''
    },
    fileName: {
      type: String
    },
    suffix: {
      type: String
    }
  },
  data () {
    return {
      txtEncodeCon: '',
      htmlTxt: ''
    }
  },
  created () {
    if (this.suffix === 'html') {
      HightLight.highlightAll()
    }
  },
  mounted () {
    this.loadTxt()
  },
  methods: {
    // 加载文本
    loadTxt () {
      if (this.textContent) {
        const base64data = this.textContent
        this.txtEncodeCon = Base64.decode(base64data);
        this.htmlTxt = "<pre><code>" + this.txtEncodeCon + "</code></pre>"
        if (this.suffix === 'html') {
          document.getElementById('code').innerHTML = this.htmlTxt
          document.querySelectorAll('div.code').forEach(block => {
            HightLight.highlightBlock(block)
          })
        }
      }
    },
    closePreviewer () {
      this.$emit('clickTxtModal')
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../../../../assets/styles/viewtxt";
  @import "../../../../assets/styles/hl-default";
  .container { height: 100%; overflow-y: auto; }
  div.code { white-space: pre; }
  .divContent { color: #fff; font-family: "SimHei"; padding-bottom: 10px; white-space: pre-wrap; word-wrap: break-word; /*InternetExplorer5.5+*/
    background-color: #000;}
</style>
