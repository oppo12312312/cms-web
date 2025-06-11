import ax from "@/utils/request";
import { uploadFiles, downloadExcelFile } from "@/api/file";
const baseUrl = "stdSumscore";
import qs from "qs";

export function list(query) {
  return ax.request({
    url: `${baseUrl}/list`,
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

export function detail(id) {
  return ax.request({
    url: `${baseUrl}/detail`,
    method: "post",
    params: {
      id: id,
    },
  });
}

export function exportsExcel(params, name) {
  downloadExcelFile(
    `${baseUrl}/exportStdCourseScoreList`,
    "post",
    name,
    params
  );
}
