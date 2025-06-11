import home from "@/views/home";

export const commonRoutes = [
  {
    path: "/home",
    component: home,
    name: "home",
    id: "ex",
    meta: {
      title: "首页",
      icon: "el-icon-s-home",
    },
  },
];

export const route404 = [
  {
    path: "*",
    redirect: "/404",
    meta: {
      hidden: true,
    },
  },
];
