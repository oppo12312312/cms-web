import { getOptTxt, getCodeOptions } from "@/filters/options";

import { getDeptsListOptions } from "@/filters/options";

function getOpts(commit, resolve, { key: key, value: value }) {
  getCodeOptions(value, true).then((data) => {
    commit("SET_OPTS", {
      type: key,
      data: data,
    });
    resolve();
  });
}
function getOpts2(commit, resolve, { key: key, value: value }) {
  getCodeOptions(value, true, { value: "dmcode", label: "dmname" }).then(
    (data) => {
      commit("SET_OPTS", {
        type: key,
        data: data,
      });
      resolve();
    }
  );
}

const app = {
  state: {
    xbOpts: [],
    pyccOpts: [],
    xjOpts: [],
    zzmmOpts: [],
    mzOpts: [],
    zjlxOpts: [],
    hklxOpts: [],
    njOpts: [],
    kslbOpts: [],
    lqlxOpts: [],
    xjztOpts: [],
    tsyyOpts: [],
    ydxjztOpts: [],
    ydyyOpts: [],
    sfOpts: [],
    klOpts: [],
    kslbOpts: [],
    lqfsOpts: [],
    lqfsOpts2: [],
    wyyzOpts: [],
    xzOpts: [],
    xzOpts2: [],
    ksztOpts: [],
    pcOpts: [],
    pyfsOpts: [],
    pylxOpts: [],
    xqOpts: [],
    xjxqOpts: [], // 学籍学期
    tsrylbOpts: [],
    xxxsOpts: [],
    xxfsOpts: [],
    hyzkOpts: [],
    gatqwOpts: [],
    xxOpts: [],
    rxfsOpts: [],
    jkzkOpts: [],
    xkOpts: [], // 学籍学科
    bdztOpts: [], // 报道状态

    gradeOpts: [], // 年级
    pcStatusOpts: [], // 批次状态
    bjStatusOpts: [
      { label: "在校", value: "1" },
      { label: "毕业", value: "2" },
    ],
    spjgOpts: [], //审查结果
    scztOpts: [
      { label: "未审查", value: "0" },
      { label: "已审查", value: "1" },
    ], //审查状态
    tbztOpts: [
      { label: "未同步", value: "0" },
      { label: "已同步", value: "1" },
    ], // 同步情况
    cyztOpts: [
      { label: "未传阅", value: "0" },
      { label: "已传阅", value: "1" },
    ], // 传阅状态
    wyhdlxOpts: [], // 五育活动类型
    hdjbOpts: [
      { label: "院级活动", value: "dept" },
      { label: "班级活动", value: "class" },
    ], // 活动级别,
    hjjbOpts: [], // 获奖级别
    hjdjOpts: [], // 获奖等级
    hdOpts: [
      { label: "活动", value: "wyhd" },
      { label: "招募", value: "recruit" },
      { label: "申报", value: "declare" },
    ], // 活动类型
    validOpts: [
      { label: "有效", value: "1" },
      { label: "无效", value: "0" },
    ],
    zyjszcOpts: [], // 专业技术系列职称
    jobsOpts: [], // 岗位
    jszcOpts: [], // 教师系列职称
    bzOpts: [], // 编制
    shztOpts: [
      { label: "通过", value: "1" },
      { label: "不通过", value: "2" },
    ], // 审核状态

    gczqOpts: [
      { label: "周", value: "week" },
      { label: "月", value: "month" },
      { label: "年", value: "year" },
      { label: "学期", value: "term" },
    ],

    tasktypeOpts: [
      { label: "必修", value: "1" },
      { label: "选修", value: "2" },
    ],
    // 组织级别
    orgLevelOpts: [
      { label: "校级", value: "1" },
      { label: "院级", value: "2" },
    ],
    // 数据来源
    dataSourceOpts: [
      // { label: "活动平台创建", value: "1" },
      // { label: "初始化创建", value: "2" },
      // { label: "第三方同步", value: "3" },
      // { label: "社团同步", value: "8" },
      // { label: "导入", value: "9" },
    ],
    statusOpts: [
      { label: "正常", value: "1" },
      { label: "解散", value: "2" },
    ],
    ywlxOpts: [],
    stjbOpts: [
      { label: "校级", value: "1" },
      { label: "院级", value: "2" },
    ],
    assTypeOpts: [],
    assPostOpts: [],
    hdProjectTypeOpts: [],
    hdProjectScaleOpts: [],
    hdProjectReportDeptOpts: [],
    versionStateOpts: [
      { label: "未开始", value: "0" },
      { label: "已结束", value: "1" },
      { label: "进行中", value: "2" },
    ],
  },
  mutations: {
    SET_OPTS: (state, data) => {
      state[data.type] = data.data;
    },
  },
  getters: {
    xbOpts: (state) => {
      return state.xbOpts;
    },
    zzmmOpts: (state) => {
      return state.zzmmOpts;
    },
    pyccOpts: (state) => {
      return state.pyccOpts;
    },
    xjOpts: (state) => {
      return state.xjOpts;
    },
    mzOpts: (state) => {
      return state.mzOpts;
    },
    zjlxOpts: (state) => {
      return state.zjlxOpts;
    },
    hklxOpts: (state) => {
      return state.hklxOpts;
    },
    njOpts: (state) => {
      return state.njOpts;
    },
    kslbOpts: (state) => {
      return state.kslbOpts;
    },
    lqlxOpts: (state) => {
      return state.lqlxOpts;
    },
    xjztOpts: (state) => {
      return state.xjztOpts;
    },
    tsyyOpts: (state) => {
      return state.tsyyOpts;
    },
    ydxjztOpts: (state) => {
      return state.ydxjztOpts;
    },
    ydyyOpts: (state) => {
      return state.ydyyOpts;
    },
    sfOpts: (state) => {
      return state.sfOpts;
    },
    xzOpts: (state) => {
      return state.xzOpts;
    },
    xzOpts2: (state) => {
      return state.xzOpts2;
    },
    klOpts: (state) => {
      return state.klOpts;
    },
    kslbOpts: (state) => {
      return state.kslbOpts;
    },
    lqfsOpts: (state) => {
      return state.lqfsOpts;
    },
    lqfsOpts2: (state) => {
      return state.lqfsOpts2;
    },
    wyyzOpts: (state) => {
      return state.wyyzOpts;
    },
    ksztOpts: (state) => {
      return state.ksztOpts;
    },
    pcOpts: (state) => {
      return state.pcOpts;
    },
    pyfsOpts: (state) => {
      return state.pyfsOpts;
    },
    pylxOpts: (state) => {
      return state.pylxOpts;
    },
    xqOpts: (state) => {
      return state.xqOpts;
    },
    xjxqOpts: (state) => {
      return state.xjxqOpts;
    },
    tsrylbOpts: (state) => {
      return state.tsrylbOpts;
    },
    xxxsOpts: (state) => {
      return state.xxxsOpts;
    },
    xxfsOpts: (state) => {
      return state.xxfsOpts;
    },
    hyzkOpts: (state) => {
      return state.hyzkOpts;
    },
    gatqwOpts: (state) => {
      return state.gatqwOpts;
    },
    xxOpts: (state) => {
      return state.xxOpts;
    },
    rxfsOpts: (state) => {
      return state.rxfsOpts;
    },
    jkzkOpts: (state) => {
      return state.jkzkOpts;
    },
    xkOpts: (state) => {
      return state.xkOpts;
    },
    bdztOpts: (state) => {
      return state.bdztOpts;
    },
    nj5Opts() {
      const y = new Date().getFullYear();
      const opts = [];
      for (let i = 0; i < 5; i++) {
        opts.push({ label: y - i, value: y - i });
      }
      return opts;
    },
    gradeOpts: (state) => {
      return state.gradeOpts;
    },
    pcStatusOpts: (state) => {
      return state.pcStatusOpts;
    },
    bjStatusOpts: (state) => {
      return state.bjStatusOpts;
    },
    spjgOpts: (state) => {
      return state.spjgOpts;
    },
    scztOpts: (state) => {
      return state.scztOpts;
    },
    tbztOpts: (state) => {
      return state.tbztOpts;
    },
    cyztOpts: (state) => {
      return state.cyztOpts;
    },
    wyhdlxOpts: (state) => {
      return state.wyhdlxOpts;
    },
    hdjbOpts: (state) => {
      return state.hdjbOpts;
    },
    hjdjOpts: (state) => {
      return state.hjdjOpts;
    },
    hjjbOpts: (state) => {
      return state.hjjbOpts;
    },
    hdOpts: (state) => {
      return state.hdOpts;
    },
    validOpts: (state) => {
      return state.validOpts;
    },
    zyjszcOpts: (state) => {
      return state.zyjszcOpts;
    },
    jobsOpts: (state) => {
      return state.jobsOpts;
    },
    jszcOpts: (state) => {
      return state.jszcOpts;
    },
    bzOpts: (state) => {
      return state.bzOpts;
    },
    shztOpts: (state) => {
      return state.shztOpts;
    },
    gczqOpts: (state) => {
      return state.gczqOpts;
    },
    tasktypeOpts: (state) => {
      return state.tasktypeOpts;
    },
    orgLevelOpts: (state) => {
      return state.orgLevelOpts;
    },
    dataSourceOpts: (state) => {
      return state.dataSourceOpts;
    },
    statusOpts: (state) => {
      return state.statusOpts;
    },
    ywlxOpts: (state) => {
      return state.ywlxOpts;
    },
    stjbOpts: (state) => {
      return state.stjbOpts;
    },
    assTypeOpts: (state) => {
      return state.assTypeOpts;
    },
    assPostOpts: (state) => {
      return state.assPostOpts;
    },
    hdProjectTypeOpts: (state) => {
      return state.hdProjectTypeOpts;
    },
    hdProjectScaleOpts: (state) => {
      return state.hdProjectScaleOpts;
    },
    hdProjectReportDeptOpts: (state) => {
      return state.hdProjectReportDeptOpts;
    },
    versionStateOpts: (state) => {
      return state.versionStateOpts;
    },
  },
  actions: {
    getOpts({ commit, state }, opts) {
      return new Promise((resolve, reject) => {
        for (const key of opts) {
          // if (!state[key].length) {
          if (key == "xbOpts") {
            getOpts(commit, resolve, {
              key: key,
              value: "20001",
              opts: state[key],
            });
          } else if (key == "pyccOpts") {
            getOpts(commit, resolve, {
              key: key,
              value: "10013",
              opts: state[key],
            });
          } else if (key == "xjOpts") {
            getOpts(commit, resolve, {
              key: key,
              value: "90081",
              opts: state[key],
            });
          } else if (key == "zzmmOpts") {
            getOpts(commit, resolve, {
              key: key,
              value: "20011",
              opts: state[key],
            });
          } else if (key == "mzOpts") {
            getOpts(commit, resolve, {
              key: key,
              value: "20002",
              opts: state[key],
            });
          } else if (key == "zjlxOpts") {
            getOpts(commit, resolve, {
              key: key,
              value: "91117",
              opts: state[key],
            });
          } else if (key == "hklxOpts") {
            getOpts(commit, resolve, {
              key: key,
              value: "20005",
              opts: state[key],
            });
          } else if (key == "kslbOpts") {
            //学生类型
            getOpts(commit, resolve, {
              key: key,
              value: "10012",
              opts: state[key],
            });
          } else if (key == "lqlxOpts") {
            getOpts(commit, resolve, {
              key: key,
              value: "20006",
              opts: state[key],
            });
          } else if (key == "xjztOpts") {
            getOpts(commit, resolve, {
              key: key,
              value: "20007",
              opts: state[key],
            });
          } else if (key == "sfOpts") {
            getOpts(commit, resolve, {
              key: key,
              value: "20004",
              opts: state[key],
            });
          } else if (key == "tsyyOpts") {
            getOpts(commit, resolve, {
              key: key,
              value: "TSYY",
              opts: state[key],
            });
          } else if (key == "ydxjztOpts") {
            getOpts(commit, resolve, {
              key: key,
              value: "TOP_XJ_STATUS",
              opts: state[key],
            });
          } else if (key == "ydyyOpts") {
            getOpts(commit, resolve, {
              key: key,
              value: "TOP_XJ_YDYY",
              opts: state[key],
            });
          } else if (key == "klOpts") {
            getOpts(commit, resolve, {
              key: key,
              value: "kldm",
              opts: state[key],
            });
          } else if (key == "kslbOpts") {
            getOpts(commit, resolve, {
              key: key,
              value: "kslbdm",
              opts: state[key],
            });
          } else if (key == "lqfsOpts") {
            getOpts(commit, resolve, {
              key: key,
              value: "lqfsdm",
              opts: state[key],
            });
          } else if (key == "lqfsOpts2") {
            getOpts2(commit, resolve, {
              key: key,
              value: "lqfsdm",
              opts: state[key],
            });
          } else if (key == "wyyzOpts") {
            getOpts(commit, resolve, {
              key: key,
              value: "wyyzdm",
              opts: state[key],
            });
          } else if (key == "xzOpts") {
            getOpts(commit, resolve, {
              key: key,
              value: "xz",
              opts: state[key],
            });
          } else if (key == "xzOpts2") {
            getOpts2(commit, resolve, {
              key: key,
              value: "xz",
              opts: state[key],
            });
          } else if (key == "ksztOpts") {
            getOpts(commit, resolve, {
              key: key,
              value: "kszt",
              opts: state[key],
            });
          } else if (key == "pcOpts") {
            getOpts(commit, resolve, {
              key: key,
              value: "pcdm",
              opts: state[key],
            });
          } else if (key == "pyfsOpts") {
            getOpts(commit, resolve, {
              key: key,
              value: "10015",
              opts: state[key],
            });
          } else if (key == "pylxOpts") {
            //学位类型
            getOpts(commit, resolve, {
              key: key,
              value: "10075",
              opts: state[key],
            });
          } else if (key == "xqOpts") {
            getOpts(commit, resolve, {
              key: key,
              value: "30010",
              opts: state[key],
            });
          } else if (key == "xjxqOpts") {
            getOpts(commit, resolve, {
              key: key,
              value: "XJ_xq",
              opts: state[key],
            });
          } else if (key == "tsrylbOpts") {
            getOpts(commit, resolve, {
              key: key,
              value: "tsrylb",
              opts: state[key],
            });
          } else if (key == "xxxsOpts") {
            getOpts(commit, resolve, {
              key: key,
              value: "10017",
              opts: state[key],
            });
          } else if (key == "xxfsOpts") {
            getOpts(commit, resolve, {
              key: key,
              value: "10016",
              opts: state[key],
            });
          } else if (key == "hyzkOpts") {
            getOpts(commit, resolve, {
              key: key,
              value: "20003",
              opts: state[key],
            });
          } else if (key == "gatqwOpts") {
            getOpts(commit, resolve, {
              key: key,
              value: "20019",
              opts: state[key],
            });
          } else if (key == "xxOpts") {
            getOpts(commit, resolve, {
              key: key,
              value: "20017",
              opts: state[key],
            });
          } else if (key == "rxfsOpts") {
            getOpts(commit, resolve, {
              key: key,
              value: "10029",
              opts: state[key],
            });
          } else if (key == "jkzkOpts") {
            getOpts(commit, resolve, {
              key: key,
              value: "20016",
              opts: state[key],
            });
          } else if (key == "xkOpts") {
            getOpts(commit, resolve, {
              key: key,
              value: "10005",
              opts: state[key],
            });
          } else if (key == "bdztOpts") {
            getOpts(commit, resolve, {
              key: key,
              value: "XJ_bdzt",
              opts: state[key],
            });
          } else if (key == "gradeOpts") {
            getOpts2(commit, resolve, {
              key: key,
              value: "grade",
              opts: state[key],
            });
          } else if (key == "pcStatusOpts") {
            getOpts2(commit, resolve, {
              key: key,
              value: "GY_pc_status",
              opts: state[key],
            });
          } else if (key == "spjgOpts") {
            getOpts2(commit, resolve, {
              key: key,
              value: "GY_spjg",
              opts: state[key],
            });
          } else if (key == "wyhdlxOpts") {
            getOpts(commit, resolve, {
              key: key,
              value: "cz_wyhdlx",
              opts: state[key],
            });
          } else if (key == "hjjbOpts") {
            getOpts(commit, resolve, {
              key: key,
              value: "GY_hjjb",
              opts: state[key],
            });
          } else if (key == "hjdjOpts") {
            getOpts(commit, resolve, {
              key: key,
              value: "GY_hjdj",
              opts: state[key],
            });
          } else if (key == "zyjszcOpts") {
            getOpts(commit, resolve, {
              key: key,
              value: "GY_zyjszc",
              opts: state[key],
            });
          } else if (key == "jobsOpts") {
            getOpts(commit, resolve, {
              key: key,
              value: "GY_jobs",
              opts: state[key],
            });
          } else if (key == "jszcOpts") {
            getOpts(commit, resolve, {
              key: key,
              value: "GY_jszc",
              opts: state[key],
            });
          } else if (key == "bzOpts") {
            getOpts(commit, resolve, {
              key: key,
              value: "GY_bz",
              opts: state[key],
            });
          } else if (key == "dataSourceOpts") {
            getOpts2(commit, resolve, {
              key: key,
              value: "HD_DATA_SOURCE",
              opts: state[key],
            });
          } else if (key == "ywlxOpts") {
            getOpts2(commit, resolve, {
              key: key,
              value: "90001",
              opts: state[key],
            });
          } else if (key == "assTypeOpts") {
            getOpts2(commit, resolve, {
              key: key,
              value: "HD_ASS_TYPE",
              opts: state[key],
            });
          } else if (key == "assPostOpts") {
            getOpts2(commit, resolve, {
              key: key,
              value: "HD_ASS_POST",
              opts: state[key],
            });
          } else if (key == "hdProjectTypeOpts") {
            getOpts2(commit, resolve, {
              key: key,
              value: "HD_PROJECT_TYPE",
              opts: state[key],
            });
          } else if (key == "hdProjectScaleOpts") {
            getOpts2(commit, resolve, {
              key: key,
              value: "HD_PROJECT_SCALE",
              opts: state[key],
            });
          } else if (key == "hdProjectReportDeptOpts") {
            getOpts2(commit, resolve, {
              key: key,
              value: "HD_PROJECT_REPORT_DEPT",
              opts: state[key],
            });
          } else if (key == "versionStateOpts") {
            getOpts2(commit, resolve, {
              key: key,
              value: "VERSION_STATE",
              opts: state[key],
            });
          }

          // }
        }
      });
    },
  },
};

export default app;
