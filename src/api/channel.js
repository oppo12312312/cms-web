import ax from "@/utils/request";
import qs from "qs";
const baseUrl = "cmsChannel";

export function channelAdd(query) {
  return ax.request({
    url: `${baseUrl}/channelAdd`,
    method: "post",
    data: query,
  });
}

export function channelDelete(channelIds) {
  return ax.request({
    url: `${baseUrl}/channelDelete`,
    method: "post",
    params: {
      channelIds: channelIds,
    },
  });
}

export function channelEdit(query) {
  return ax.request({
    url: `${baseUrl}/channelEdit`,
    method: "post",
    data: query,
  });
}

export function channelTreeList(query) {
  return ax.request({
    url: `${baseUrl}/channelTreeList`,
    method: "post",
    data: query,
  });
}
