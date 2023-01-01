const chokidar = require("chokidar");
const bodyParser = require("body-parser");
const chalk = require("chalk");
const path = require("path");
const Mock = require("mockjs");

const mockDir = path.join(process.cwd(), "mock");

// 注册mock接口路径
function registerRoutes(app) {
  let mockLastIndex;
  const { mocks } = require("./index.js");
  const mocksForServer = mocks.map(route => {
    return responseFake(route.url, route.type, route.response);
  });
  // 注册接口
  for (const mock of mocksForServer) {
    app[mock.type](mock.url, mock.response);
    mockLastIndex = app._router.stack.length;
  }
  // 获取接口的长度
  const mockRoutesLength = Object.keys(mocksForServer).length;
  // 注意：mockRoutesLength并不等于定于路由路径的数量，还包括其他路由
  return {
    mockRoutesLength: mockRoutesLength,
    mockStartIndex: mockLastIndex - mockRoutesLength
  };
}

// 移除路由
function unregisterRoutes() {
  Object.keys(require.cache).forEach(i => {
    if (i.includes(mockDir)) {
      delete require.cache[require.resolve(i)];
    }
  });
}

// 模拟mock server
const responseFake = (url, type, respond) => {
  return {
    url: new RegExp(`${process.env.VUE_APP_BASE_API}${url}`),
    type: type || "get",
    response(req, res) {
      console.log("request invoke:" + req.path);
      res.json(
        Mock.mock(respond instanceof Function ? respond(req, res) : respond)
      );
    }
  };
};

// 导出服务器app
module.exports = app => {
  // parse app.body
  // https://expressjs.com/en/4x/api.html#req.body
  // 解析post数据
  app.use(bodyParser.json());
  app.use(
    bodyParser.urlencoded({
      extended: true
    })
  );

  // 注册路由表到app上
  const mockRoutes = registerRoutes(app);
  var mockRoutesLength = mockRoutes.mockRoutesLength;
  var mockStartIndex = mockRoutes.mockStartIndex;

  // watch files, hot reload mock server
  // 观察mock下的文件变化（不包括mock-server.js），热更新文件，这样添加数据路由就不用重启了
  chokidar
    .watch(mockDir, {
      ignored: /mock-server/,
      ignoreInitial: true
    })
    .on("all", (event, path) => {
      if (event === "change" || event === "add") {
        try {
          // remove mock routes stack
          app._router.stack.splice(mockStartIndex, mockRoutesLength);

          // clear routes cache
          unregisterRoutes();

          const mockRoutes = registerRoutes(app);
          mockRoutesLength = mockRoutes.mockRoutesLength;
          mockStartIndex = mockRoutes.mockStartIndex;

          console.log(
            chalk.magentaBright(
              `\n > Mock Server hot reload success! changed  ${path}`
            )
          );
        } catch (error) {
          console.log(chalk.redBright(error));
        }
      }
    });
};
