<template>
  <div class="contentWrap" v-if="isShowCon">
    <div class="backWrap">
      <span class="el-icon-arrow-left" @click="closeCont">返回</span>
    </div>
    <div class="infoWrap">
      <div class="infoTitle">{{announCon.noticeTitle}}</div>
      <div class="infoTiem">{{announCon.createTime}}</div>
      <div class="cont" v-html="announCon.noticeContent"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AnnounCont',
  props: {
    isShowCon: {
      type: Boolean,
      default: false
    },
    announCon: {
      type: Object,
      default: () => {}
    }
  },
  updated () {
    const contWrap = document.getElementsByClassName('cont')[0]
    if (contWrap) {
      console.log(contWrap.getElementsByTagName('p'))
      const allP = contWrap.getElementsByTagName('p')
      for (var i = 0; i < allP.length; i ++) {
        allP[i].classList.add('contInfo')
      }
    }
  },
  methods: {
    closeCont () {
      this.$emit('closeConte', false)
    }
  }
}
</script>

<style lang="scss">
  .contentWrap { position: absolute; top: 0; right: 0; bottom: 0; left: 0; z-index: 99; background: #fff;
    .backWrap { height: 40px; border-bottom: 1px solid #d9d9d9; display: flex; justify-content: flex-start; align-items: center;
      .el-icon-arrow-left { height: 100%; font-size: 14px; line-height: 40px; padding-right: 10px;
        &::before { padding: 0 5px 0 20px; }
      }
    }
    .infoWrap { overflow: auto; padding: 10px 20px;
      .infoTitle { text-align: center; font-size: 16px; font-weight: 600; line-height: 22px; }
      .infoTiem { font-size: 12px; line-height: 18px; color: #999; text-align: right;}
      .cont { width: 95%; margin-left: 10px;
        .contInfo{ margin: 0; color: #999; font-size: 12px; line-height: 18px; text-indent: 10px; }
      }
    }
  }
</style>