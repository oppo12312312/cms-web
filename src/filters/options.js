import {
  getMajors,
  getClasses,
  getDeptsList,
  getCommonOptions,
  getXnList,
  getXueyuan,
  queryXYlist,
} from "@/api/common";

export const fjflOptions = function () {
  return [];
};

export const getCodeOptions = function (type, isSelect, config) {
  return new Promise((resolve) => {
    getCommonOptions(type).then((data) => {
      const opts = [
        // {
        //   label: "全部",
        //   value: ""
        // },
      ];
      for (const d of data.data) {
        const opt = {
          label: config ? d[config.label] : d.dmname,
          value: config ? d[config.value] : d.dmname,
          code: d.dmcode,
          dmid: d.dmid,
        };
        opts.push(opt);
      }
      /* if(isSelect){
        opts.shift();
      } */
      resolve(opts);
    });
  });
};

export const getCodeOptions2 = function (type, isSelect) {
  return new Promise((resolve) => {
    getCommonOptions(type).then((data) => {
      const opts = [
        // {
        //   label: "全部",
        //   value: ""
        // },
      ];
      for (const d of data.data) {
        const opt = {
          label: d.dmname,
          value: d.dmcode,
        };
        opts.push(opt);
      }
      // if(isSelect){
      //   opts.shift();
      // }
      resolve(opts);
    });
  });
};

export const getRoleTypetOptions = function (isSelect) {
  const opts = [
    // {
    //   label: "全部",
    //   value: ""
    // },
    {
      label: "教职工",
      value: "1",
    },
    {
      label: "学生",
      value: "0",
    },
    {
      label: "其他",
      value: "9",
    },
  ];
  // if(isSelect){
  //   opts.shift();
  // }
  return opts;
};

export const getDeptsListOptions = function (isSelect) {
  return new Promise((resolve) => {
    getDeptsList({}).then((data) => {
      const opts = [
        // {
        //   label: "全部",
        //   value: ""
        // }
      ];
      for (const d of data.data) {
        const opt = {
          label: d.deptname,
          value: d.deptid,
        };
        opts.push(opt);
      }
      // if(isSelect){
      //   opts.shift();
      // }
      resolve(opts);
    });
  });
};

export const getXueyuanOptions = function (isSelect) {
  return new Promise((resolve) => {
    getXueyuan({}).then((data) => {
      const opts = [
        // {
        //   label: "全部",
        //   value: ""
        // }
      ];
      for (const d of data.data) {
        const opt = {
          label: d.deptname,
          value: d.deptid,
        };
        opts.push(opt);
      }
      resolve(opts);
    });
  });
};

export const getXueyuanOptions2 = function (isSelect) {
  return new Promise((resolve) => {
    getXueyuan({}).then((data) => {
      const opts = [
        // {
        //   label: "全部",
        //   value: ""
        // }
      ];
      for (const d of data.data) {
        const opt = {
          label: d.xy,
          value: d.xyId,
          code: d.xyh,
        };
        opts.push(opt);
      }
      resolve(opts);
    });
  });
};
export const getXueyuanOptions3 = function (isSelect) {
  return new Promise((resolve) => {
    queryXYlist({}).then((data) => {
      const opts = [
        // {
        //   label: "全部",
        //   value: ""
        // }
      ];
      for (const d of data.data) {
        const opt = {
          label: d.xy,
          value: d.xyId,
          code: d.xyh,
        };
        opts.push(opt);
      }
      resolve(opts);
    });
  });
};

export const getMajorsOptions = function (xyId) {
  return new Promise((resolve) => {
    getMajors(xyId || "").then((data) => {
      const opts = [
        // {
        //   label: "全部",
        //   value: ""
        // }
      ];
      for (const d of data.data) {
        const opt = {
          label: d.zy,
          value: d.zyId,
          xyId: d.xyId,
        };
        opts.push(opt);
      }
      resolve(opts);
    });
  });
};

export const getMajorsOptions2 = function (xyId) {
  return new Promise((resolve) => {
    getMajors(xyId || "").then((data) => {
      const opts = [
        // {
        //   label: "全部",
        //   value: ""
        // }
      ];
      for (const d of data.data) {
        const opt = {
          label: d.zy,
          value: d.zyId,
          xyId: d.xyId,
          code: d.zyh,
        };
        opts.push(opt);
      }
      resolve(opts);
    });
  });
};

export const getClassesOptions = function (xyId, zyId, nj) {
  return new Promise((resolve) => {
    getClasses(xyId || "", zyId || "", nj || "").then((data) => {
      const opts = [
        // {
        //   label: "全部",
        //   value: ""
        // }
      ];
      for (const d of data.data) {
        const opt = {
          label: d.bjmc,
          value: d.bjid,
          xyId: d.xyId,
          zyId: d.zyId,
        };
        opts.push(opt);
      }
      resolve(opts);
    });
  });
};

export const getClassesOptions2 = function (xyId, zyId, nj) {
  return new Promise((resolve) => {
    getClasses(xyId || "", zyId || "", nj || "").then((data) => {
      const opts = [
        // {
        //   label: "全部",
        //   value: ""
        // }
      ];
      for (const d of data.data) {
        const opt = {
          label: d.bjmc,
          value: d.bjid,
          xyId: d.xyId,
          zyId: d.zyId,
          code: d.bh,
        };
        opts.push(opt);
      }
      resolve(opts);
    });
  });
};

export const getXnOpts = function (options, value) {
  return new Promise((resolve) => {
    getXnList().then((data) => {
      const opts = [];
      for (const d of data.data) {
        const opt = {
          label: d.VALUE,
          value: d.VALUE,
        };
        opts.push(opt);
      }
      resolve(opts);
    });
  });
};

export const getXnOpts2 = function (options, value) {
  return new Promise((resolve) => {
    getXnList().then((data) => {
      const opts = [];
      for (const d of data.data) {
        const opt = {
          label: d.VALUE,
          value: d.ID,
        };
        opts.push(opt);
      }
      resolve(opts);
    });
  });
};

export const getOptTxt = function (options, value) {
  let label = "暂无";
  if (options) {
    for (let i = 0; i < options.length; i++) {
      if (value == options[i].value) {
        label = options[i].label;
      }
    }
    return value && label == "暂无" ? value : label;
  }
};

export const getmanyOptTxt = function (options, value) {
  let label = "暂无";
  const vals = value.split(",");
  if (options) {
    for (let i = 0; i < options.length; i++) {
      if (vals.indexOf(options[i].value) > -1) {
        if ((label = "暂无")) {
          label = options[i].label;
        } else {
          label += options[i].label;
        }
      }
    }
    return label;
  }
};

export const getOptCode = function (options, value) {
  let code = "";
  if (options) {
    for (let i = 0; i < options.length; i++) {
      if (value == options[i].value) {
        code = options[i].code;
      }
    }
    return value && code == "" ? value : code;
  }
};

export const getOptNj = function (options, value) {
  let nj = "";
  if (options) {
    for (let i = 0; i < options.length; i++) {
      if (value == options[i].value) {
        nj = options[i].nj;
      }
    }
    return value && nj == "" ? value : nj;
  }
};

export const getOptDmid = function (options, value) {
  let did = "";
  if (options) {
    for (let i = 0; i < options.length; i++) {
      if (value == options[i].value) {
        did = options[i].did;
      }
    }
    return value && did == "" ? value : did;
  }
};

export const getAreaName = function (code) {
  const codeP = code.split("/")[0],
    codeC = code.split("/")[1];
  return new Promise((resolve) => {
    getCodeOptions("20004").then((data) => {
      let nodesP = [],
        areaP = "",
        areaC = "",
        areaArr = [];
      for (let i = 0; i < data.length; i++) {
        nodesP.push({
          label: data[i].label,
          value: data[i].code,
          did: data[i].dmid,
          code: data[i].code,
        });
      }
      areaP = getOptTxt(nodesP, codeP);
      areaArr.push(areaP);
      const dmidP = getOptDmid(nodesP, codeP);
      getCodeOptions(dmidP).then((data) => {
        const nodesC = [];
        for (let i = 0; i < data.length; i++) {
          nodesC.push({
            label: data[i].label,
            value: data[i].code,
            did: data[i].dmid,
            code: data[i].code,
          });
        }
        areaC = getOptTxt(nodesC, codeC);
        areaArr.push(areaC);
        resolve(areaArr);
      });
    });
  });
};
