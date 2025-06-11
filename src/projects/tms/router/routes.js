// 引入自定义单文件组件
import Layout from "@/components/layout1";
import View from "@/components/view";

export const asyncRoutes = {
  path: "/",
  component: Layout,
  redirect: "/home",
  name: "main",
  children: [
    {
      path: "home",
      component: () => import("#/views/home"),
      name: "home",
      id: "ex",
      level: 1,
      meta: {
        title: "首页",
        icon: "icon-home",
        hiddeTools: true,
        headerMenu: true,
      },
    },
  ],
};

export default asyncRoutes;
