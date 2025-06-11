import ax from "@/utils/request";
import { uploadFiles, downloadExcelFile } from "@/api/file";
const baseUrl = "leave";

export function exportsExecutes(params, name, data) {
  //
  downloadExcelFile(`${baseUrl}/exportsExecutes`, "post", name, params, data);
}

export function listLeaveApprove(query, params) {
  return ax.request({
    url: `${baseUrl}/listLeaveApprove`,
    method: "post",
    data: query,
    params: params,
  });
}

export function leaveList(query) {
  return ax.request({
    url: `${baseUrl}/list`,
    method: "post",
    data: query,
  });
}

export function doExecute(query) {
  return ax.request({
    url: `${baseUrl}/doExecute`,
    method: "post",
    data: query,
  });
}

export function doExecutes(query) {
  return ax.request({
    url: `${baseUrl}/doExecutes`,
    method: "post",
    params: query,
  });
}

export function leaveDetail(query) {
  return ax.request({
    url: `${baseUrl}/detail`,
    method: "post",
    params: query,
  });
}

export function deleteQJApply(query) {
  return ax.request({
    url: `${baseUrl}/deleteQJApply`,
    method: "post",
    params: query,
  });
}

export function saveOrUpdate(files, query) {
  return uploadFiles(`${baseUrl}/saveOrUpdate`, query, files);
}
