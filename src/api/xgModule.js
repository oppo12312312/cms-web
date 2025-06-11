import ax from "@/utils/request";

import qs from "qs";
const baseUrl = "xgModule";

export function getModule(moduleId) {
  return ax.request({
    url: `${baseUrl}/getModule/${moduleId}`,
    method: "post",
  });
}

export function updateModule(query) {
  return ax.request({
    url: `${baseUrl}/updateModule`,
    method: "post",
    data: query,
  });
}
