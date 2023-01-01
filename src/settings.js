module.exports = {
  title: 'e信打卡管理平台',
  /**
   * 是否系统布局配置
   */
  showSettings: false,

  /**
   * 是否显示 tagsView
   */
  tagsView: true,

  /**
   * 是否固定头部
   */
  fixedHeader: true,

  /**
   * 导航模式
   * @params:horizontal：顶栏模式；vertical：竖栏模式；mixed：混合模式
   */
   navbarMode: 'vertical',
  /**
   * 是否显示logo
   */
  sidebarLogo: true,

  /**
   * @type {boolean} true | false
   * @description Whether support pinyin search in headerSearch
   * Bundle size minified 47.3kb,minified + gzipped 63kb
   */
  supportPinyinSearch: true,

  /**
   * @type {string | array} 'production' | ['production', 'development']
   * @description Need show err logs component.
   * The default is only used in the production env
   * If you want to also use it in dev, you can pass ['production', 'development']
   */
  errorLog: 'production',

  /**
   * @type { string } 'blue-dark' 'blue-light'...
   * @description 系统换肤
   */
  systemFace: 'blue-dark',

  /**
   * @type { array }
   * @description 需加密传输数据API加密名单
   */
  entryptApi: ['/login','/regist','/forgetPwd','/updatePwdWhenInit','/getInfo','/getRouters'],

  /**
   * 登录方式
   * @type { boolean }
   * @description 是否为跳转登录方式
   */
  isJumpLogin: false
}
