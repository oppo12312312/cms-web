import ax from "@/utils/request";
import qs from "qs";
const baseUrl = "cmsContent";

export function contentListMng(query) {
  return ax.request({
    url: `${baseUrl}/contentListMng`,
    method: "post",
    data: query,
  });
}

export function contentAdd(query) {
  return ax.request({
    url: `${baseUrl}/contentAdd`,
    method: "post",
    data: query,
  });
}

export function contentDelete(contentIds) {
  return ax.request({
    url: `${baseUrl}/contentDelete`,
    method: "post",
    params: {
      contentIds: contentIds,
    },
  });
}

export function contentEdit(query) {
  return ax.request({
    url: `${baseUrl}/contentEdit`,
    method: "post",
    data: query,
  });
}

export function contentDetail(contentId) {
  return ax.request({
    url: `${baseUrl}/contentDetail`,
    method: "post",
    params: { contentId: contentId },
  });
}
