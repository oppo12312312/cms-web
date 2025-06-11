import ax from "@/utils/request";

export function depart(data) {
  return ax.request({
    url: "/dispatchSchedules/depart",
    method: "post",
    data,
  });
}

export function shipment(data) {
  return ax.request({
    url: "/dispatchSchedules/shipment",
    method: "post",
    data,
  });
}

export function autoSort(data) {
  return ax.request({
    url: "/dispatchSchedules/autoSort",
    method: "post",
    data,
  });
}

export function delOrder(params) {
  return ax.request({
    url: "/dispatchSchedules/delOrder",
    method: "post",
    params,
  });
}

export function remOrder(params) {
  return ax.request({
    url: "/dispatchSchedules/remOrder",
    method: "post",
    params,
  });
}

// 获取待排序w列表
export function dpxList(data) {
  return ax.request({
    url: "/dispatchSchedules/dpxList",
    method: "post",
    data,
  });
}

//待排线订单路线根据车辆位置排序
export function generate(data) {
  return ax.request({
    url: "/dispatchSchedules/generate",
    method: "post",
    data,
  });
}

// 选择订单变成待排线
//{
//   "orderList": [
//     {
//       "createTime": "2025-05-29T13:41:17.406Z",
//       "id": "string",
//       "latitude": 0,
//       "longitude": 0,
//       "merName": "string",
//       "orderNo": "string",
//       "payPrice": 0,
//       "realName": "string",
//       "totalNum": 0,
//       "totalPrice": 0,
//       "userAddress": "string",
//       "userPhone": "string"
//     }
//   ],
//   "plateNo": "string",
//   "scheduleId": "string"
// }
export function generateDpxList(data) {
  return ax.request({
    url: "/dispatchSchedules/orderPending",
    method: "post",
    data,
  });
}
// 获取车牌号列表
export function pageList(data) {
  return ax.request({
    url: "/dispatchSchedules/pageList",
    method: "post",
    data,
  });
}

export function save(data) {
  return ax.request({
    url: "/dispatchSchedules/save",
    method: "post",
    data,
  });
}

// 废弃
export function ebOrderList(data) {
  return ax.request({
    url: "/ebOrder/choose",
    method: "post",
    data,
  });
}

// orderInfo/searchDfhOrders 查询待发货订单
export function searchDfhOrders(data) {
  return ax.request({
    url: "/orderInfo/searchDfhOrders",
    method: "post",
    data,
  });
}

export function view(params) {
  return ax.request({
    url: "/dispatchSchedules/view",
    method: "post",
    params,
  });
}

export function cancelDispatch(params) {
  return ax.request({
    url: "/dispatchSchedules/cancelDispatch",
    method: "post",
    params,
  });
}

// 撤销待排线订单
export function cancelDpxOrder(data) {
  return ax.request({
    url: "/dispatchSchedules/cancelOrderPending",
    method: "post",
    data,
  });
}
// 查看车子的位置
export function viewVehicleLocation(vehicleId) {
  const params = { vehicleId };
  return ax.request({
    url: "/tmsVehicle/viewPosition",
    method: "post",
    params,
  });
}

// Excel文件导入接口
export function importExcel(file) {
  const formData = new FormData();
  formData.append("file", file);

  return ax.request({
    url: "/orderInfo/importExcel",
    method: "post",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

// /dispatchSchedules/updateLatLon

export function updateLatLon(orderId, lat, lon) {
  return ax.request({
    url: "/dispatchSchedules/updateLatLon",
    method: "post",
    params: { orderId, lat, lon },
  });
}

// 删除已排线订单
export function cancelOrderPendingDPXStatus(data) {
  return ax.request({
    url: "/dispatchSchedules/cancelOrderPendingDPXStatus",
    method: "post",
    data,
  });
}
