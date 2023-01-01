const mixin = {
  data () {
    return {
      tabContainerHeight: 0,
      elCardContainerHeight: 0,
      elCanvasContainerHeight: 0
    }
  },
  created(){},
  mounted() {
    this.getTableHeight();
    window.onresize = () => {
      this.getTableHeight();
    };
  },
  methods:{
    // 解决页面表单动态高度问题
    getTableHeight() {
      // 页面头部固定高度84；
      // 主页部分有20的padding；
      // 下面按钮占130高度；
      this.$nextTick(() => {
        let offsetHeight = 84 + 20;
        let windowHeight = document.documentElement.clientHeight;
        this.tabContainerHeight = windowHeight - offsetHeight - 83 + "px";
        this.elCardContainerHeight = windowHeight - offsetHeight - 89 + "px";
        this.elCanvasContainerHeight = windowHeight - offsetHeight - 119 + "px";
        // console.log('表格高度',this.tabContainerHeight)
      });
    },
    // 页面”关闭“按钮，返回上一页
    pageBack() {
      this.$router.go(-1);
    },
  },
}
export default mixin
