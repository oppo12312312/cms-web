import ax from "@/utils/request";
import { downloadExcelFile, uploadFiles } from "@/api/file";
import qs from "qs";
const baseUrl = "xgLoanSyd";

export function sydLoanList(query) {
  return ax.request({
    url: `${baseUrl}/xgLoanSydList`,
    method: "post",
    data: query,
  });
}

export function detail(data) {
  return ax.request({
    url: `${baseUrl}/detail`,
    method: "post",
    params: { applyid: data },
  });
}

export function add(query, files) {
  return uploadFiles(`${baseUrl}/add`, query, files);
}

export function edit(query, files) {
  return uploadFiles(`${baseUrl}/edit`, query, files);
}

export function deleteSyd(query) {
  return ax.request({
    url: `${baseUrl}/delete`,
    method: "post",
    data: query,
    //params: {applyid: data}
  });
}

export function exportSydList(params, name) {
  downloadExcelFile(`${baseUrl}/exportXgLoanSydList`, "post", name, params);
}
