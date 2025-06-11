import ax from "@/utils/request";

const baseUrl = "sysResource";

export function listIcon(query) {
  return ax.request({
    url: `sysIcon/listIcon`,
    method: "post",
    data: query,
  });
}

export function listResource(query) {
  return ax.request({
    url: `${baseUrl}/listResource`,
    method: "post",
    data: query,
  });
}

export function addSysResource(query) {
  return ax.request({
    url: `${baseUrl}/addSysResource`,
    method: "post",
    data: query,
  });
}

export function updateSysResource(query) {
  return ax.request({
    url: `${baseUrl}/updateSysResource`,
    method: "post",
    data: query,
  });
}
