import { constantRoutes } from "@/router";
import { getRouters } from "@/api/menu";
import Layout from "@/layout/index";

const permission = {
  state: {
    routes: [],
    addRoutes: [],
    mixedSidbarRoutes: [] // 混合模式下侧边栏数据
  },
  mutations: {
    SET_ROUTES: (state, routes) => {
      state.addRoutes = routes;
      state.routes = constantRoutes.concat(routes);
    },
    // 设置混合模式侧边栏
    SET_SIDE_ROUTES: (state, routes) => {
      state.mixedSidbarRoutes = routes
    }
  },
  actions: {
    // 生成路由
    GenerateRoutes({ commit }) {
      return new Promise(resolve => {
        // 向后端请求路由数据
        getRouters().then(res => {
          // console.log("后端返回数据", res.data);
          const accessedRoutes = filterAsyncRouter(res.data.router);
          // const accessedRoutes = filterAsyncRouter(res.data);
          accessedRoutes.push({ path: "*", redirect: "/404", hidden: true });
          commit("SET_ROUTES", accessedRoutes);
          resolve(accessedRoutes);
        });
      });
    }
  }
};

// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap) {
  return asyncRouterMap.filter(route => {
    if (route.component) {
      // Layout组件特殊处理
      if (route.component === "Layout") {
        route.component = Layout;
      } else {
        route.component = loadView(route.component);
      }
    }
    if (route.children != null && route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children);
    }
    return true;
  });
}

// 动态路由加载
export const loadView = view => {
  return resolve => require([`@/views/${view}`], resolve);
};

export default permission;
