import ax from "@/utils/request";
import { uploadFiles, downloadExcelFile, downloadFile } from "@/api/file";
const baseUrl = "studentCard";
import qs from "qs";

export function admApproveList(query) {
  return ax.request({
    url: `${baseUrl}/admApproveList`,
    method: "post",
    data: query,
  });
}

export function admApproveListExport(params, name) {
  downloadExcelFile(`${baseUrl}/admApproveListExport`, "post", name, params);
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

export function stdApproveAddOrUpdate(query) {
  return ax.request({
    url: `${baseUrl}/stdApproveAddOrUpdate`,
    method: "post",
    data: query,
  });
}

export function stdApproveDelete(query) {
  return ax.request({
    url: `${baseUrl}/stdApproveDelete`,
    method: "post",
    data: query,
  });
}

export function stdApproveDetail(query) {
  return ax.request({
    url: `${baseUrl}/stdApproveDetail`,
    method: "post",
    data: query,
  });
}

export function stdApproveList(query) {
  return ax.request({
    url: `${baseUrl}/stdApproveList`,
    method: "post",
    data: query,
  });
}
