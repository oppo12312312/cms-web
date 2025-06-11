import ax from "@/utils/request";

export function add(data) {
  return ax.request({
    url: "/tmsStore/add",
    method: "post",
    data,
  });
}

export function edit(data) {
  return ax.request({
    url: "/tmsStore/edit",
    method: "post",
    data,
  });
}

export function pageList(data) {
  return ax.request({
    url: "/tmsStore/pageList",
    method: "post",
    data,
  });
}

export function remove(params) {
  return ax.request({
    url: "/tmsStore/remove",
    method: "post",
    params,
  });
}

export function saveVehicle(data) {
  return ax.request({
    url: "/tmsStore/saveVehicle",
    method: "post",
    data,
  });
}

export function selectCk() {
  return ax.request({
    url: "/tmsStore/selectCk",
    method: "post",
  });
}

export function view(params) {
  return ax.request({
    url: "/tmsStore/view",
    method: "post",
    params,
  });
}

export function viewVehicle(params) {
  return ax.request({
    url: "/tmsStore/viewVehicle",
    method: "post",
    params,
  });
}
