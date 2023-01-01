const Mock = require("mockjs");
const lists = [];
const count = 100;
const image_uri =
  "https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3";
for (let i = 0; i < count; i++) {
  lists.push(
    Mock.mock({
      id: "@increment",
      timestamp: +Mock.Random.date("T"),
      author: "@first",
      reviewer: "@first",
      title: "@title(5, 10)",
      content_short: "mock data",
      forecast: "@float(0, 100, 2, 2)",
      importance: "@integer(1, 3)",
      "type|1": ["CN", "US", "JP", "EU"],
      "status|1": ["published", "draft"],
      display_time: "@datetime",
      comment_disabled: true,
      pageviews: "@integer(300, 5000)",
      image_uri,
      platforms: ["a-platform"]
    })
  );
}
console.log(lists);
const mocks = [
  {
    url: "/test/path",
    type: "get",
    response: (req, res) => {
      return {
        code: 200,
        data: {
          lists
        }
      };
    }
  }
];

module.exports = {
  mocks
  // mockXHR
};
