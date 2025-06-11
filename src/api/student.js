import ax from "@/utils/request";
import { uploadFiles, downloadExcelFile, downloadFile } from "@/api/file";
const baseUrl = "student";
import qs from "qs";

export function editStu(files, query) {
  return uploadFiles(`${baseUrl}/edit`, query, files);
}

export function stuDetail() {
  return ax.request({
    url: `${baseUrl}/detail`,
    method: "post",
  });
}

export function initPass(query) {
  return ax.request({
    url: `${baseUrl}/initPass`,
    method: "post",
    data: query,
  });
}

export function exportsStuForm(params, name) {
  downloadFile(`${baseUrl}/exportsStuForm`, "post", name, "zip", {}, params);
}
