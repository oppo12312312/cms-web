import ax from "@/utils/request";
import { uploadFiles, downloadExcelFile } from "@/api/file";
const baseUrl = "stdInfoSetting";
import qs from "qs";

export function list(query) {
  return ax.request({
    url: `${baseUrl}/list`,
    method: "post",
    data: query,
  });
}

export function update(query) {
  return ax.request({
    url: `${baseUrl}/update`,
    method: "post",
    data: query,
  });
}
