import Vue from "vue";
import VueRouter from "vue-router";
import View from "@/components/view";
import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css"; // progress bar style
import {
  getToken,
  removeToken,
  getCasToken,
  removeCasToken,
  setCasToken,
} from "@/utils/auth"; // get token from cookie
import { getQueryString } from "@/utils/util";

import store from "#/store";
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};

NProgress.configure({
  showSpinner: false,
}); // NProgress Configuration
const whiteList = ["/login", "/404"]; // no redirect whitelist

Vue.use(VueRouter);

//  该路由对象不需要权限
const constantRoutes = [
  {
    path: "/login",
    component: () => import("@/views/login/Login"),
    name: "login",
    hidden: true,
  },
  // 404
  {
    path: "/404",
    name: "404",
    component: () => import("@/views/unusual/NotFound"),
    hidden: true,
  },
  {
    path: "/403",
    name: "403",
    component: () => import("@/views/unusual/403"),
    hidden: true,
  },
  {
    path: "/studentInfo",
    component: View,
    name: "studentInfo",
    id: "/studentManage",
    redirect: "/studentInfo/",
    meta: {
      title: "学生信息管理",
      icon: "A1",
    },
    children: [
      {
        path: "saveStu",
        component: () => import("@/views/studentInfo/personal"),
        name: "studentInfoSave",
        meta: {
          title: "学生信息",
          icon: "A1",
          isHide: true,
          notView: true,
        },
      },
      {
        path: "stuDetail",
        component: () => import("@/views/studentInfo/personal"),
        name: "stuDetail",
        meta: {
          title: "学生信息",
          icon: "A1",
          isHide: true,
          notView: true,
        },
      },
    ],
  },
];

const router = new VueRouter({
  scrollBehavior: () => ({
    y: 0,
  }),
  routes: constantRoutes,
});

function beforeEnter(to, from, next) {
  NProgress.start();
  const hasToken = getToken();
  if (hasToken) {
    // 判断是否有token
    if (to.path === "/login") {
      next({ path: "/" });
    } else {
      if (!store.state.user.userInfo.name) {
        store.dispatch("getUserInfo").then(() => {
          next({ ...to, replace: true });
        });
      } else {
        next();
      }
    }
  } else {
    /* has no token */
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next();
    } else {
      removeToken();
      next("/login"); // 否则全部重定向到登录页
      NProgress.done(); // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
}

router.beforeEach(async (to, from, next) => {
  const newCasToken = getQueryString("token");
  const type = getQueryString("type");
  const casToken = getCasToken();
  if (newCasToken) {
    if (newCasToken == casToken) {
      beforeEnter(to, from, next);
    } else {
      store
        .dispatch("otherLogin", {
          subSystem: PROJECT.subSystem,
          token: newCasToken,
          type,
        })
        .then(() => {
          setCasToken(newCasToken);
          next({ ...to, replace: true });
        })
        .catch((err) => {
          history.go(-1);
        });
    }
  } else {
    beforeEnter(to, from, next);
  }
});

router.afterEach(() => {
  NProgress.done(); // finish progress bar
});

export function resetRouter(r) {
  const createRouter = () =>
    new VueRouter({
      scrollBehavior: () => ({
        y: 0,
      }),
      routes: constantRoutes,
    });
  const newRouter = createRouter();
  r.matcher = newRouter.matcher;
}

export default router;
