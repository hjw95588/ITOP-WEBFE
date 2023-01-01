"use strict";
const path = require("path");
const defaultSettings = require("./src/settings.js");

function resolve(dir) {
  return path.join(__dirname, dir);
}

const name = defaultSettings.title || "ITOP";

const port = process.env.port || process.env.npm_config_port || 20220;

module.exports = {
  // 部署生产环境和开发环境下的URL。
  // 默认情况下，Vue CLI 会假设你的应用是被部署在一个域名的根路径上
  // 例如 https://www.kevinwong.tech/。如果应用被部署在一个子路径上，你就需要用这个选项指定这个子路径。例如，如果你的应用被部署在 https://www.kevinwong.tech/admin/，则设置 baseUrl 为 /admin/。
  publicPath: process.env.NODE_ENV === "production" ? "/" : "/",
  outputDir: "dist",
  assetsDir: "static",
  // 是否开启eslint保存检测，有效值：ture | false | 'error'
  // lintOnSave: process.env.NODE_ENV === "development",
  lintOnSave: false,
  // 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建。
  productionSourceMap: false,
  devServer: {
    host: "0.0.0.0",
    port: port,
    // before: require("./mock/mock-server.js"),
    proxy: {
      [process.env.VUE_APP_BASE_API]: {
        // target: 'http://192.168.4.131:18111',
        // target: "http://192.168.8.19:18111/",
        // target: "http://82.156.182.178:18111",
        // target: "http://101.200.172.123:18111",
        target: 'http://127.0.0.1:39111',
        changeOrigin: true,
        // logLevel: "debug",
        pathRewrite: {
          ["^" + process.env.VUE_APP_BASE_API]: ""
        }
      },

    },
    disableHostCheck: true
  },
  configureWebpack: {
    name: name,
    resolve: {
      alias: {
        "@": resolve("src")
      }
    }
  },
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          'primary-color': '#a8d4f7',
          'layout-color': '#9867f7'
        },
        javascriptEnabled: true
      }
    }
  },
  transpileDependencies: ['highlight.js', 'bpmn-js', 'bpmn-js-properties-panel', 'bpmn-js-token-simulation',
    'camunda-bpmn-moddle', 'socket.io-client', 'engine.io-client', 'jsencrypt', 'pinyin', 'screenfull', 'sortablejs',
    'js-cookie', 'crypto-js'
  ],
  chainWebpack(config) {
    config.plugins.delete("preload"); // TODO: need test
    config.plugins.delete("prefetch"); // TODO: need test
    config.entry.app = ['babel-polyfill', './src/main.js']
    // set svg-sprite-loader
    config.module
      .rule("svg")
      .exclude.add(resolve("src/assets/icons"))
      .end();
    config.module
      .rule("icons")
      .test(/\.svg$/)
      .include.add(resolve("src/assets/icons"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]"
      })
      .end();

    // set preserveWhitespace
    config.module
      .rule("vue")
      .use("vue-loader")
      .loader("vue-loader")
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true;
        return options;
      })
      .end();
    // 生产环境html版本
    config.when(process.env.NODE_ENV === "production", config => {
      config.plugin('html')
        .tap(args => {
          args[0].template = 'public/index.html'
          // args[0].version = '1.0.3'
          args[0].meta = {
            'revised': { 'name': 'revised', 'content': '1.0.5' }
          }
          return args
        })
    })
    config
      .when(process.env.NODE_ENV === "development", config =>
        config.devtool("cheap-source-map")
      );

    config.when(process.env.NODE_ENV !== "development", config => {
      config
        .plugin("ScriptExtHtmlWebpackPlugin")
        .after("html")
        .use("script-ext-html-webpack-plugin", [
          {
            // `runtime` must same as runtimeChunk name. default is `runtime`
            inline: /runtime\..*\.js$/
          }
        ])
        .end();
      config.optimization.splitChunks({
        chunks: "all",
        cacheGroups: {
          libs: {
            name: "chunk-libs",
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: "initial" // only package third parties that are initially dependent
          },
          elementUI: {
            name: "chunk-elementUI", // split elementUI into a single package
            priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
            test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
          },
          commons: {
            name: "chunk-commons",
            test: resolve("src/components"), // can customize your rules
            minChunks: 3, //  minimum common number
            priority: 5,
            reuseExistingChunk: true
          }
        }
      });
      config.optimization.runtimeChunk("single");
    });
  }
};
