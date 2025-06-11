import ax from "@/utils/request";
import qs from "qs";

const baseUrl = "/public/";

export function getXnList() {
  //
  return ax.request({
    url: `/xn/getXnList`,
    method: "post",
  });
}

export function getProjectPath() {
  //
  return ax.request({
    url: `/session/weixin/getProjectPath`,
    method: "post",
  });
}

export function queryStudentlist(query) {
  // 获取部门列表
  return ax.request({
    url: `${baseUrl}queryStudentlist`,
    method: "post",
    data: query,
  });
}

export function queryStudentInfoByXh(xh) {
  // 获取部门列表
  return ax.request({
    url: `${baseUrl}queryStudentInfoByXh`,
    method: "post",
    params: {
      xh: xh,
    },
  });
}

export function queryStudentInfo(query) {
  // 获取学生基本信息
  return ax.request({
    url: `${baseUrl}queryStudentInfo`,
    method: "post",
    data: query,
  });
}

export function getDeptsList(query) {
  // 获取部门列表
  return ax.request({
    url: `${baseUrl}queryDeptlist`,
    method: "post",
    data: query,
  });
}

/* 获取学院下拉框数据 *
 */
export function getXueyuan(query) {
  return ax.request({
    url: `${baseUrl}getXueyuan`,
    method: "post",
    data: query,
  });
}
export function queryXYlist(query) {
  return ax.request({
    url: `${baseUrl}queryXYlist`,
    method: "post",
    data: query,
  });
}

export function getMajors(xyId) {
  return ax.request({
    url: `${baseUrl}queryMajorlist`,
    method: "post",
    data: {
      xyId: xyId,
    },
  });
}

export function getClasses(xyId, zyId, nj) {
  return ax.request({
    url: `${baseUrl}queryClasslist`,
    method: "post",
    data: {
      zyId: zyId,
      xyId: xyId,
      nj: nj,
    },
  });
}

export function getCommonOptions(codekindid) {
  // 获取系统定制下拉框
  return ax.request({
    url: `${baseUrl}queryCodelist`,
    method: "post",
    params: { dmid: codekindid },
  });
}

export function getArea(parentId) {
  return ax.request({
    url: `${baseUrl}getArea`,
    method: "post",
    params: { parentId },
  });
}

// POST /session/deleteActInfoCache 删除活动缓存
export function deleteActInfoCache(params) {
  return ax.request({
    url: `/session/deleteActInfoCache`,
    method: "post",
    params,
  });
}
// POST /session/deleteStdRecordCache 删除活动缓存
export function deleteStdRecordCache(data) {
  return ax.request({
    url: `/session/deleteStdRecordCache`,
    method: "post",
    data,
  });
}
// POST /session/delRedisCache 删除redis缓存
export function delRedisCache(params) {
  return ax.request({
    url: `/session/delRedisCache`,
    method: "post",
    params,
  });
}

export function queryClasslist(data) {
  return ax.request({
    url: `${baseUrl}queryClasslist`,
    method: "post",
    data,
  });
}
