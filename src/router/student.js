// 引入自定义单文件组件
import Layout from "@/components/layout/components/layout1";
import View from "@/components/view";

export const asyncRoutes = {
  path: "/",
  component: Layout,
  redirect: "/home",
  name: "main",
  children: [
    {
      path: "home",
      component: () => import("@/views/home"),
      name: "home",
      id: "ex",
      meta: {
        title: "我的工作台",
        icon: "A1",
        hiddeTools: true,
        headerMenu: true,
        layout: true,
      },
    },
    {
      path: "business",
      component: () => import("@/views/business/stuBusiness"),
      name: "business",
      id: "ex",
      meta: {
        title: "业务中心",
        icon: "A1",
        hiddeTools: true,
        headerMenu: true,
      },
    },
    {
      path: "/messages",
      component: () => import("@/views/home"),
      name: "messages",
      id: "ex",
      meta: {
        title: "消息中心",
        icon: "A1",
        hiddeTools: true,
        headerMenu: true,
        layout: true,
      },
    },
    {
      path: "/tasks",
      component: () => import("@/views/home"),
      name: "tasks",
      id: "ex",
      meta: {
        title: "待办中心",
        icon: "A1",
        hiddeTools: true,
        headerMenu: true,
        layout: true,
      },
    },
  ],
};

export default asyncRoutes;
