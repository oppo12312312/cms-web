import ax from "@/utils/request";
import qs from "qs";
const baseUrl = "pFile";
// 文件上传下载接口 P File Controller

// /pFile/businessId 生成业务ID
export function businessId() {
  return ax.request({
    url: `${baseUrl}/businessId`,
    method: "post",
  });
}
// /pFile/{moduleId}/list 列表
export function list(moduleId, businessId) {
  return ax.request({
    url: `${baseUrl}/list`,
    method: "post",
    params: {
      businessId,
      moduleId,
    },
  });
}

// /pFile/list 列表
export function list2(moduleId, businessId) {
  return ax.request({
    url: `${baseUrl}/list`,
    method: "post",
    params: {
      moduleId,
      businessId,
    },
  });
}
// /pFile/pageList 列表 带分页
export function list3(params) {
  return ax.request({
    url: `${baseUrl}/list`,
    method: "post",
    params,
  });
}
// /pFile/pageList 列表 带分页
export function pageList(data) {
  return ax.request({
    url: `${baseUrl}/pageList`,
    method: "post",
    data,
  });
}

export function delFile(params) {
  return ax.request({
    url: `${baseUrl}/delFile`,
    method: "post",
    params,
  });
}
