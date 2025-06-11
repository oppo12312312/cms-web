import ax from "@/utils/request";
import { downloadExcelFile } from "@/api/file";
import qs from "qs";
const baseUrl = "xgPunishment";

export function punishList(query) {
  //处分列表
  return ax.request({
    url: `${baseUrl}/list`,
    method: "post",
    data: query,
  });
}

export function add(query) {
  //处分新增
  return ax.request({
    url: `${baseUrl}/add`,
    method: "post",
    data: query,
  });
}

export function detail(data) {
  //处分详情
  return ax.request({
    url: `${baseUrl}/detail`,
    method: "post",
    params: { id: data },
  });
}

export function edit(query) {
  //处分修改
  return ax.request({
    url: `${baseUrl}/edit`,
    method: "post",
    data: query,
  });
}

export function delPunish(query) {
  //处分删除
  return ax.request({
    url: `${baseUrl}/delete`,
    method: "post",
    params: {
      ids: query,
    },
  });
}

export function removePunish(query) {
  //处分解除
  return ax.request({
    url: `${baseUrl}/remove`,
    method: "post",
    data: query,
  });
}

export function statistics(query) {
  //处分统计
  return ax.request({
    url: `${baseUrl}/statistics`,
    method: "post",
    data: query,
  });
}

export function exportPunish(params, name) {
  //处分列表导出
  downloadExcelFile(`${baseUrl}/exportPunish`, "post", name, params);
}

export function exportStatistics(params, name) {
  //统计结果导出
  downloadExcelFile(`${baseUrl}/exportStatistics`, "post", name, params);
}
