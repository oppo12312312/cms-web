import ax from "@/utils/request";
import { uploadFiles, downloadExcelFile, downloadFile } from "@/api/file";
const baseUrl = "stdInfo";
import qs from "qs";

export function stuList(query) {
  return ax.request({
    url: `${baseUrl}/list`,
    method: "post",
    data: query,
  });
}

export function saveStdInfo(files, query) {
  return uploadFiles(`${baseUrl}/add`, query, files, "file");
}

export function editStdInfo(files, query) {
  return uploadFiles(`${baseUrl}/edit`, query, files, "file");
}

export function detail(studentId) {
  return ax.request({
    url: `${baseUrl}/detail`,
    method: "post",
    params: {
      studentId: studentId,
    },
  });
}

export function initPass(query) {
  return ax.request({
    url: `${baseUrl}/initPass`,
    method: "post",
    data: query,
  });
}

export function exportsExcel(params, name) {
  downloadExcelFile(`${baseUrl}/exportsExcel`, "post", name, params);
}

export function exportsForm(params, name) {
  downloadFile(`${baseUrl}/exportsForm`, "post", name, "doc", params);
}

export function exportsPhoto(params, name) {
  downloadFile(`${baseUrl}/exportsPhoto`, "post", name, "zip", {}, params);
}
