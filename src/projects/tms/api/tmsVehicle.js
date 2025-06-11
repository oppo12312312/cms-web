import ax from "@/utils/request";

export function add(data) {
  return ax.request({
    url: "/tmsVehicle/add",
    method: "post",
    data,
  });
}

export function edit(data) {
  return ax.request({
    url: "/tmsVehicle/edit",
    method: "post",
    data,
  });
}

export function pageList(data) {
  return ax.request({
    url: "/tmsVehicle/pageList",
    method: "post",
    data,
  });
}

export function remove(params) {
  return ax.request({
    url: "/tmsVehicle/remove",
    method: "post",
    params,
  });
}

export function saveFee(data) {
  return ax.request({
    url: "/tmsVehicle/saveFee",
    method: "post",
    data,
  });
}

export function selectCp() {
  return ax.request({
    url: "/tmsVehicle/selectCp",
    method: "post",
  });
}

export function view(params) {
  return ax.request({
    url: "/tmsVehicle/view",
    method: "post",
    params,
  });
}

export function viewFee(params) {
  return ax.request({
    url: "/tmsVehicle/viewFee",
    method: "post",
    params,
  });
}
