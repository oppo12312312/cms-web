import ax from "@/utils/request";
import { downloadExcelFile } from "@/api/file.js";

const baseUrl = "/zsPlan/";
const baseUrl1 = "/zsConfig/";

export function zsPlanList(params) {
  //招生计划数据列表
  // params = {
  //   zsnd: "", // 招生年度
  //   sfcode: "", // 省份
  //   xyId: "", // 学院
  //   zyId: "" // 专业
  // }
  return ax.request({
    url: `${baseUrl}list`,
    method: "post",
    data: params,
  });
}

export function zsPlanTemplate(params) {
  downloadExcelFile(
    `${baseUrl}downloadTemplate`,
    "post",
    "招生计划导入Excel模板",
    params
  );
}

export function zsPlanExport(params) {
  //导出招生计划列表数据
  downloadExcelFile(`${baseUrl}export`, "post", "招生计划列表", params);
}

export function getQueryListCloumn(roleid) {
  const params = {
    bizId: "VW_ZS_STUDENT",
    roleid: roleid,
  };
  return ax.request({
    url: `${baseUrl1}queryListCloumn`,
    method: "post",
    params: params,
  });
}

export function save(params) {
  //招生数据 修改
  // params = {
  //   id: "23423", // 主键id
  //   kl: "", // 科类
  //   xz: "", // 学制
  //   xf: "", // 学费
  //   lqrs: "" // 计划人数
  // }
  return ax.request({
    url: `${baseUrl}save`,
    method: "post",
    data: params,
  });
}
export function getById(params) {
  //招生计划详细数据接口
  // params = {
  //   id: "32232423" // id 必填
  // }
  return ax.request({
    url: `${baseUrl}getById`,
    method: "post",
    params: params,
  });
}

export function deleteZsplan(params) {
  //招生计划详细数据接口
  return ax.request({
    url: `${baseUrl}delete`,
    method: "post",
    params: params,
  });
}

export function listStatastic(params) {
  //招生计划查询统计
  // params = {
  //   zsnd: "2020", // 招生年度 必填
  //   sfcode: "", // 省份
  //   zyId: "" // 专业
  // }
  return ax.request({
    url: `${baseUrl}listStatastic`,
    method: "post",
    data: params,
  });
}

export function zsPlandelete(params) {
  //招生计划数据删除
  // params = {
  //   ids: "23423,24234,234324" // 招生数据 ids ps  23423,24234,234324
  // }
  return ax.request({
    url: `${baseUrl}delete`,
    method: "post",
    params: params,
  });
}

export function importData(params) {
  //招生计划数据导入
  // 没写对
  return `${baseUrl}importData`;
}

export function getStudentBatchList(params) {
  //新生数据流转可视化列表
  // params = {
  //   begintime: "", // 开始时间
  //   endtime: "", // 结束时间
  //   opertype: "" // 操作方式
  // }
  return ax.request({
    url: `zsPlanBatch/list`,
    method: "post",
    data: params,
  });
}

export function getStudentBatchDetail(params) {
  //新生数据流转可视化 图表
  // params = {
  //   begintime: "", // 开始时间
  //   endtime: "" // 结束时间
  // }
  return ax.request({
    url: `zsPlanTemp/list`,
    method: "post",
    data: params,
  });
}

export function getStudentBatchStatis(params) {
  //新生数据流转可视化 图表
  // params = {
  //   begintime: "", // 开始时间
  //   endtime: "" // 结束时间
  // }
  return ax.request({
    url: `zsPlanTemp/list`,
    method: "post",
    data: params,
  });
}
