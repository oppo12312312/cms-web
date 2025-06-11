import View from "@/components/view";

export const servies = [
  {
    path: "/authorization",
    component: View,
    name: "authorization",
    redirect: "/authorization/",
    id: "/home",
    meta: {
      title: "授权中心",
      icon: "A1",
      headerMenu: true,
    },
    children: [],
  },
  {
    path: "roleManage",
    component: () => import("@/views/authorization/roleManage"),
    name: "roleManage",
    id: "/role",
    meta: {
      title: "角色管理",
      icon: "A1",
    },
  },
  {
    path: "userManage",
    component: () => import("@/views/authorization/userManage"),
    name: "userManage",
    id: "/user",
    meta: {
      title: "用户管理",
      icon: "A1",
    },
  },
  {
    path: "roleAuthorization",
    component: () => import("@/views/authorization/roleAuthorization"),
    name: "roleAuthorization",
    id: "/roleuser",
    meta: {
      title: "角色权限管理",
      icon: "A1",
    },
  },
  {
    path: "menuManage",
    component: () => import("@/views/authorization/menu"),
    name: "menuManage",
    id: "/sysresource",
    meta: {
      title: "菜单管理",
      icon: "A1",
    },
  },
  {
    path: "grant",
    component: () => import("@/views/authorization/grant"),
    name: "grant",
    id: "/userrole",
    meta: {
      title: "用户授权",
      icon: "A1",
    },
  },
  {
    path: "fdyManage",
    component: View,
    name: "fdyManage",
    redirect: "/fdyManage/",
    id: "/xgFdy",
    meta: {
      title: "辅导员队伍管理",
      icon: "",
    },
    children: [],
  },
  {
    path: "names",
    component: () => import("@/views/fdyManage/names"),
    name: "fdyList",
    id: "/xgAssFdy",
    meta: {
      title: "辅导员名单管理",
      icon: "A1",
    },
  },
  {
    path: "appointment",
    component: () => import("@/views/fdyManage/appointment"),
    name: "fdyAppointment",
    id: "/xgAssFdyClass",
    meta: {
      title: "辅导员任命",
      icon: "A1",
    },
  },
  {
    path: "bzrAppointment",
    component: () => import("@/views/fdyManage/bzrAppointment"),
    name: "bzrAppointment",
    id: "/xgAssBzrClass",
    meta: {
      title: "班主任任命",
      icon: "A1",
    },
  },
  {
    path: "bjzlAppointment",
    component: () => import("@/views/fdyManage/bjzlAppointment"),
    name: "bjzlAppointment",
    id: "/xgAssBjzlClass",
    meta: {
      title: "班级助理任命",
      icon: "A1",
    },
  },
  {
    path: "systemConfig",
    component: View,
    name: "systemConfig",
    redirect: "/systemConfig/",
    id: "/system",
    meta: {
      title: "系统管理",
      icon: "",
    },
    children: [],
  },
  {
    path: "deptManage",
    component: () => import("@/views/systemConfig/deptManage"),
    name: "deptManage",
    id: "/dept",
    meta: {
      title: "部门管理",
      icon: "A1",
    },
  },
  {
    path: "dictionary",
    component: () => import("@/views/systemConfig/dictionary"),
    name: "dictionary",
    id: "/dictionary",
    meta: {
      title: "字典管理",
      icon: "A1",
    },
  },
  {
    path: "loginlog",
    component: () => import("@/views/systemConfig/loginlog"),
    name: "loginlog",
    id: "/loginlog",
    meta: {
      title: "登录日志",
      icon: "A1",
    },
  },
  {
    path: "systemlog",
    component: () => import("@/views/systemConfig/systemlog"),
    name: "systemlog",
    id: "/systemlog",
    meta: {
      title: "系统日志",
      icon: "A1",
    },
  },
  {
    path: "noticeManage",
    component: View,
    name: "noticeManage",
    redirect: "/noticeManage/",
    id: "/info",
    meta: {
      title: "通知公告管理",
      icon: "",
    },
    children: [],
  },
  {
    path: "chanel",
    component: () => import("@/views/noticeManage/chanel"),
    name: "chanel",
    id: "/channel",
    meta: {
      title: "栏目管理",
      icon: "A1",
    },
  },
  {
    path: "information",
    component: () => import("@/views/noticeManage/information"),
    name: "information",
    id: "/content",
    meta: {
      title: "信息管理",
      icon: "A1",
    },
  },
  {
    path: "/leave",
    component: View,
    name: "leave",
    redirect: "/leave/",
    id: "/leave",
    meta: {
      title: "请假",
      icon: "A1",
    },
    children: [],
  },
  {
    path: "config",
    component: () => import("@/views/leave/config"),
    name: "leaveConfig",
    id: "",
    meta: {
      title: "请假基础设置",
      icon: "A1",
    },
  },
  {
    path: "baseConfig",
    component: () => import("@/views/leave/baseConfig"),
    name: "leaveBaseConfig",
    id: "/leaveProcessSetting",
    meta: {
      title: "请假流程设置",
      icon: "A1",
    },
  },
  {
    path: "approve",
    component: () => import("@/views/leave/approve"),
    name: "leaveApprove",
    id: "/leaveApprove",
    meta: {
      title: "请假审批",
      icon: "A1",
    },
  },
  {
    path: "leaveModuleDfi",
    component: () => import("@/views/leave/leaveModule"),
    name: "leaveModuleDfi",
    id: "/leaveModuleDfi",
    meta: {
      title: "请假须知设置",
      icon: "A1",
    },
  },
  {
    path: "record",
    component: () => import("@/views/leave/record"),
    name: "leaveRecord",
    id: "/leaveHistory",
    meta: {
      title: "请假记录",
      icon: "A1",
    },
  },
  {
    path: "leaveStu",
    component: View,
    name: "leaveStu",
    id: "/leaveApply",
    redirect: "/leave/leaveStu/",
    meta: {
      title: "请假",
      icon: "A1",
    },
    children: [
      {
        path: "list",
        component: () => import("@/views/leave/student/list"),
        name: "leaveStuList",
        meta: {
          title: "请假",
          icon: "A1",
        },
      },
      {
        path: "info",
        component: () => import("@/views/leave/student/info"),
        name: "leaveStuInfo",
        meta: {
          title: "请假须知",
          icon: "A1",
          notView: true,
        },
      },
      {
        path: "save",
        component: () => import("@/views/leave/student/save"),
        name: "leaveStuSave",
        meta: {
          title: "请假申请",
          icon: "A1",
          notView: true,
        },
      },
    ],
  },
  {
    path: "loanManage",
    component: View,
    name: "loanManage",
    redirect: "/loanManage/",
    id: "/xgLoan",
    meta: {
      title: "贷款管理",
      icon: "A1",
    },
    children: [],
  },
  {
    path: "sydLoan",
    component: () => import("@/views/loanManage/sydLoan"),
    name: "sydLoan",
    id: "/xgLoanSyd",
    meta: {
      title: "生源地贷款管理",
      icon: "A1",
    },
  },
  {
    path: "xydLoan",
    component: () => import("@/views/loanManage/xydLoan"),
    name: "xydLoan",
    id: "/xgLoanXyd",
    meta: {
      title: "校园地贷款管理",
      icon: "A1",
    },
  },
  /* {
        path: 'punishManage',
        component: View,
        name: 'punishManage',
        redirect: '/punishManage/',
        id: 'ex',
        meta: {
            title: '违纪处分管理',
            icon: 'A1'
        },
        children: []
    }, */
  {
    path: "punishment",
    component: () => import("@/views/punishManage/punishment"),
    name: "punishment",
    id: "/punishment",
    meta: {
      title: "违纪处分管理",
      icon: "A1",
    },
  },
  {
    path: "personal",
    component: View,
    name: "personal",
    redirect: "/personal/",
    id: "/personal",
    meta: {
      title: "个人中心",
      icon: "",
    },
    children: [],
  },
  {
    path: "fdyFile",
    component: () => import("@/views/personal/fdyFile"),
    name: "fdyFile",
    id: "/myFdyInfo",
    meta: {
      title: "辅导员个人档案信息",
      icon: "A1",
    },
  },

  {
    path: "manage",
    component: () => import("@/views/studentInfo/manage"),
    name: "studentInfoManage",
    id: "/stdInfo",
    meta: {
      title: "学生信息管理",
      icon: "A1",
    },
  },
  {
    path: "score",
    component: () => import("@/views/studentInfo/score"),
    name: "studentInfoscore",
    id: "/stdCoursescore",
    meta: {
      title: "学生课程成绩",
      icon: "A1",
    },
  },
  {
    path: "generalScore",
    component: () => import("@/views/studentInfo/generalScore"),
    name: "studentInfoGeneralScore",
    id: "/stdSumscore",
    meta: {
      title: "学生总评成绩",
      icon: "A1",
    },
  },
  {
    path: "config",
    component: () => import("@/views/studentInfo/config"),
    name: "studentInfoConfig",
    id: "/stdInfoSetting",
    meta: {
      title: "学生信息修改配置",
      icon: "A1",
    },
  },
  {
    path: "student",
    component: () => import("@/views/studentInfo/personal"),
    name: "studentInfoPersonal",
    id: "/student",
    meta: {
      title: "个人信息",
      icon: "A1",
      headerMenu: true,
    },
  },
];

export default servies;
