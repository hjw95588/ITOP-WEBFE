module.exports = {
  presets: [
    '@vue/app',
  ],
  sourceType: 'unambiguous',
  plugins: [
    ["@babel/plugin-proposal-optional-chaining"]  //解析 可选链式语法
  ]
}
