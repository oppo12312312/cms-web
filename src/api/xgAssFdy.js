import ax from "@/utils/request";
import { downloadExcelFile } from "@/api/file";
import qs from "qs";
const baseUrl = "xgAssFdy";

export function fdyInfoList(query) {
  return ax.request({
    url: `${baseUrl}/fdyInfoList`,
    method: "post",
    data: query,
  });
}

export function detail(query) {
  return ax.request({
    url: `${baseUrl}/detail`,
    method: "post",
    data: query,
  });
}

export function add(query) {
  return ax.request({
    url: `${baseUrl}/add`,
    method: "post",
    data: query,
  });
}

export function edit(query) {
  return ax.request({
    url: `${baseUrl}/edit`,
    method: "post",
    data: query,
  });
}

export function deleteFdy(data) {
  return ax.request({
    url: `${baseUrl}/delete`,
    method: "post",
    params: { infoid: data },
  });
}

export function exportFdyList(params, name) {
  downloadExcelFile(`${baseUrl}/exportFdyList`, "post", name, params);
}

export function fdyInfo(query) {
  // 辅导员个人信息详情
  return ax.request({
    url: `${baseUrl}/myInfo`,
    method: "post",
    data: query,
  });
}

export function fdyUpdateInfo(query) {
  // 辅导员个人信息修改
  return ax.request({
    url: `${baseUrl}/updateMyInfo`,
    method: "post",
    data: query,
  });
}
