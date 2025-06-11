import View from "@/components/view";

export const routes = [
  {
    path: "/sysManage",
    component: View,
    name: "sysManage",
    redirect: "/sysManage/userManage",
    id: "/sysManage",
    meta: {
      title: "系统管理",
      icon: "icon-sys",
    },
    children: [
      // {
      //   path: 'intelligentDispatch',
      //   component: () => import('@/views/intelligentDispatch/index'),
      //   name: 'intelligentDispatch',
      //   id: '/intelligentDispatch',
      //   meta: {
      //     title: '智能排线'
      //   }
      // },
      {
        path: "roleManage",
        component: () => import("@/views/authorization/roleManage"),
        name: "roleManage",
        id: "/roleManage",
        meta: {
          title: "角色管理",
        },
      },
      {
        path: "userManage",
        component: () => import("@/views/authorization/userManage"),
        name: "userManage",
        id: "/userManage",
        meta: {
          title: "用户管理",
        },
      },
      {
        path: "sysLog",
        component: () => import("#/views/sysLog/optLog.vue"),
        name: "sysLog",
        id: "/sysLog",
        meta: {
          title: "系统日志",
        },
      },
      {
        path: "pDmcode",
        component: () => import("@/views/systemConfig/dictionary.vue"),
        name: "pDmcode",
        id: "/pDmcode",
        meta: {
          title: "字典管理",
          submodel: "GY",
        },
      },
    ],
  },
];

export default routes;
