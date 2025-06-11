import ax from "@/utils/request";
import qs from "qs";
const baseUrl = "processBase/";

export function getFlow(moduleId) {
  return ax.request({
    url: `${baseUrl}getFlow/${moduleId}`,
    method: "post",
  });
}

export function selectApprovalTrack(params) {
  return ax.request({
    url: `${baseUrl}selectApprovalTrack`,
    method: "post",
    params: params,
  });
}

export function updateFlow(query) {
  return ax.request({
    url: `${baseUrl}updateFlow`,
    method: "post",
    data: query,
  });
}

export function getStatus(type, query) {
  return ax.request({
    url: `${baseUrl}getStatus/${type}`,
    method: "post",
    data: query,
  });
}
