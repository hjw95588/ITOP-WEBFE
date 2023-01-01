<template>
  <div :class="{'has-logo':showLogo}"  class="horiMenu clearfix">
    <logo v-if="showLogo" :collapse="false" class="horizalLogo" />
      <!-- :background-color="setAllStyle === 'dark' ? variables.menuBg : variables.menuLightBg"
      :text-color="setAllStyle === 'dark' ? variables.menuText : variables.menuLightText"
      :active-text-color="setAllStyle === 'dark' ? variables.menuActiveText : variables.menuActiveLightText" -->
    <el-menu
      id="navMenu"
      :default-active="activeMenu"
      :unique-opened="true"
      :collapse-transition="false"
      mode="horizontal"
    >
    <!-- permission_routes -->
      <sidebar-item class="navItem" v-for="(route, index) in renderRoute" :key="route.path" :item="route" :base-path="route.path" :style="{order: index}" />
      <div v-if="isCollase">
        <sidebar-item class="navItem" v-for="route in collaseArr" :key="route.path" :item="route" :base-path="route.path" style="order: 1000" />
      </div>
    </el-menu>
    <!-- <navbar v-resize="navbarWidth" id="navbarer" /> -->
    <navbar id="navbarer" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from '../Logo/inidex.vue'
import Navbar from '../Navbar.vue'
import SidebarItem from './SidebarItem'
import variables from '@/assets/styles/variables.scss'

export default {
  components: { SidebarItem, Logo, Navbar },
  computed: {
    ...mapGetters([
      'permission_routes',
      'sidebar'
    ]),
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    // 设置菜单/整体风格
    setAllStyle () {
      return this.$store.state.settings.overallStyle
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    // isCollapse() {
    //   return !this.sidebar.opened
    // },
    // 路由搜索框是否显现
    isShowSearch () {
      return this.$store.state.settings.searchIsShow
    }
  },
  data () {
    return {
      renderRoute: [],
      unwatchSearchShow: null,
      collaseArr: [],
      isCollase: false,
      menuWidth: 0,
      searWidth: 0,
      allNavWidthArr: [] // 存储所有Nav的宽度
    }
  },
  mounted () {
    this.initPage()
    // window.onresize = this.initPage
  },
  watch: {
    isShowSearch: {
      handler: function (newVal, oldVal) {
        if (newVal) {
          this.searWidth = this.getOffsetWidth(document.getElementById('navbarer'))
          this.navComputed(this.menuWidth - this.searWidth)
        } else {
          this.navComputed(this.menuWidth)
        }
      }
    }
  },
  // directives: {
  //   resize: {
  //     bind (el, binding) {
  //       let elWidth = '', elHeight = ''
  //       clearInterval(el._vueSetInterval)
  //       function isResize () {
  //         const style = document.defaultView.getComputedStyle(el)
  //         if (elWidth !== style.width || elHeight !== style.height) {
  //           binding.value()
  //         }
  //         elWidth = style.width
  //         elHeight = style.height
  //       }
  //       el._vueSetInterval = setInterval(isResize, 300);
  //     },
  //     unbind (el) {
  //       clearInterval(el._vueSetInterval)
  //     }
  //   }
  // },
  methods: {
    // 初始化
    initPage () {
      this.menuWidth = this.getInnerWidth(document.getElementById('navMenu'))
      this.renderRoute = this.permission_routes.filter(item => !item.hidden)
      this.$nextTick(() => {
        this.getAllNavWidth()
        this.navComputed(this.menuWidth)
      })
    },
    // 获取所有Nav宽度
    getAllNavWidth () {
      return new Promise (resolve => {
        const allNavDiv = [].slice.call(document.querySelectorAll('div.navItem'))
        this.allNavWidthArr = allNavDiv.map(item => this.getOffsetWidth(item))
        resolve()
      })
    },
    navComputed (menuWidth) {
      // const menuWrap = document.getElementById('navMenu')
      // const menuWidth = menuWrap.getBoundingClientRect().width
      let itemWidthNun = 0
      // // this.$nextTick(() => {
      //   const divEl = [].slice.call(document.querySelectorAll('div.navItem'))
      //   try {
      //     divEl.forEach((el, index) => {
      //       itemWidthNun = itemWidthNun + el.clientWidth
      //       if (menuWidth - itemWidthNun - 52 < el.clientWidth) {
      //         this.isCollase = true
      //         throw Error(index + 1)
      //       } else {
      //         this.isCollase = false
      //       }
      //     })
      //   } catch (e) {
          let hiddenIndex = this.allNavWidthArr.findIndex(x => {
            itemWidthNun += x
            return itemWidthNun > menuWidth
          })
          this.renderRoute = this.permission_routes.filter(item => !item.hidden)
          if (hiddenIndex > 0) {
            const sliceArr = this.renderRoute.splice(hiddenIndex)
            const lastRoute = {
              meta: {
                title: '...'
              },
              path: '/collsice',
              children: sliceArr
            }
            this.collaseArr = [lastRoute]
            this.isCollase = true
          } else {
            this.collaseArr = []
            this.isCollase = false
          }
        // }
      // })
    },
    // 获取元素内部可用宽度，抛去边框和内边距之后
    getInnerWidth(el) {
      let computedStyles = window.getComputedStyle(el);
      let leftP = parseInt(computedStyles["padding-left"].slice(0, -2));
      let rightP = parseInt(computedStyles["padding-right"].slice(0, -2));
      let leftB = parseInt(computedStyles["border-left"].slice(0, -2));
      let rightB = parseInt(computedStyles["border-right"].slice(0, -2));
      return leftP + leftB + el.offsetWidth + rightB + rightP;
    },
    // 获取元素实际高度，包括margin
    getOffsetWidth(el) {
      let computedStyles = window.getComputedStyle(el);
      let left = parseInt(computedStyles["margin-left"].slice(0, -2));
      let right = parseInt(computedStyles["margin-right"].slice(0, -2));
      return left + el.offsetWidth + right;
    }
  },
  // beforeDestroy () {
  //   this.unwatchSearchShow()
  // }
}
</script>
<style lang="scss" scoped>
  .horiMenu { position: absolute; top: 0; left: 0; right: 0; box-shadow: 0 1px 4px rgba(0 21 41 / 0.08);}
</style>
