import View from "@/components/view";

export const routes = [
  {
    path: "/baseInfo",
    component: View,
    name: "BaseInfo",
    redirect: "/baseInfo/driverManage",
    id: "/baseInfo",
    meta: {
      title: "基础信息",
      icon: "icon-syslog",
    },
    children: [
      {
        path: "driverManage",
        component: () => import("#/views/baseInfo/driverManage/index.vue"),
        name: "DriverManage",
        id: "/driverManage",
        meta: {
          title: "司机管理",
        },
      },
      {
        path: "vehicleManage",
        component: () => import("#/views/baseInfo/vehicleManage/index.vue"),
        name: "VehicleManage",
        id: "/vehicleManage",
        meta: {
          title: "车辆管理",
        },
      },
      {
        path: "storeManage",
        component: () => import("#/views/baseInfo/storeManage/index.vue"),
        name: "StoreManage",
        id: "/storeManage",
        meta: {
          title: "门店管理",
        },
      },
    ],
  },
  {
    path: "deliveryTasks",
    component: () => import("#/views/deliveryTasks"),
    name: "DeliveryTasks",
    id: "/deliveryTasks",
    level: 1,
    meta: {
      title: "配送任务",
      icon: "icon-syslog",
      hiddeTools: true,
      headerMenu: true,
    },
  },
  {
    path: "/smartCable",
    component: View,
    name: "SmartCable",
    redirect: "/smartCable/driverManage",
    id: "/smartCable",
    meta: {
      title: "智能排线",
      icon: "icon-syslog",
    },
    children: [
      {
        path: "dispatchSchedules",
        component: () => import("#/views/dispatchSchedules/index.vue"),
        name: "DispatchSchedules",
        id: "/dispatchSchedules",
        meta: {
          title: "排线调度",
        },
      },
    ],
  },
  {
    path: "dispatchOrder",
    component: () => import("#/views/dispatchOrder"),
    name: "DispatchOrder",
    id: "/dispatchOrder",
    level: 1,
    meta: {
      title: "派送订单",
      icon: "icon-syslog",
      hiddeTools: true,
      headerMenu: true,
    },
  },
  // {
  //     path: 'sysLog',
  //     component: () => import('#/views/sysLog/optLog'),
  //     name: 'SysLog',
  //     id: '/sysLog',
  //     level: 1,
  //     meta: {
  //         title: '系统日志',
  //         icon: 'icon-syslog',
  //         hiddeTools: true,
  //         headerMenu: true
  //     },
  // },
];

export default routes;
