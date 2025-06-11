import ax from "@/utils/request";
import { downloadExcelFile } from "@/api/file.js";

const baseUrl = "/zsStudent/";
const baseUrl1 = "/zsStudentBatch/";

//新生api
export function zsStudentDelete(ids) {
  //新生数据删除
  //ids = "1234,234324" // 新生数据
  return ax.request({
    url: `${baseUrl}delete`,
    method: "post",
    params: {
      ids: ids,
    },
  });
}

//新生api
export function detail(id) {
  //新生详细数据接口
  // ids = "234324" // 新生数据
  return ax.request({
    url: `${baseUrl}detail`,
    method: "post",
    params: {
      id: id,
    },
  });
}

export function zsStudentTemplate(params) {
  downloadExcelFile(`${baseUrl}downloadTemplate`, "post", "新生模板", params);
}

export function zsStudentExport(params) {
  //新生数据下载
  downloadExcelFile(`${baseUrl}downloadList`, "post", "新生数据下载", params);
}

export function getZsStudentList(params) {
  //新生数据列表
  // params = {
  //   zsnd: "", // 招生年度
  //   sfcode: "", // 省份
  //   xh: "", // 学号
  //   xm: "" // 姓名
  // }
  return ax.request({
    url: `${baseUrl}list`,
    method: "post",
    data: params,
  });
}

export function saveZsStudent(params) {
  //新生数据保存
  // params = {
  //   id: "", //
  //   zsnd: "", // 招生年度
  //   xh: "", // 学号
  //   xm: "", // 姓名
  //   xb: "", // 性别
  //   csrq: "", // 出生日期
  //   zjlx: "", // 证件类型
  //   zjh: "", // 证件号
  //   mz: "", // 民族
  //   zzmm: "", // 政治面貌
  //   xyId: "", // 学院id
  //   xy: "", // 学院名称
  //   jdZyId: "", // 就读专业id
  //   jdZy: "", // 就读专业名称
  //   bjh: "", // 班级号
  //   bjmc: "", // 班级名称
  //   pycc: "", // 层次
  //   xz: "", // 学制
  //   fxdm: "", // 方向代码
  //   fxmc: "", // 方向名称
  //   gddh: "", // 固定电话
  //   sjh: "", // 移动电话
  //   dhlxr: "", // 电话联系人
  //   yzbm: "", // 邮政编码
  //   sjr: "", // 收件人
  //   yjdz: "", //邮件地址
  //   lqbh: "", // 录取编号
  //   ksh: "", // 考生号
  //   jybKsh: "", // 教育部考生号
  //   sysfcode: "", // code
  //   sysf: "", // 生源身份
  //   lqZyId: "", // 录取专业id
  //   lqZy: "", // 录取专业名称
  //   lqqy: "", // 录取区域
  //   lqlx: "", // 录取方式
  //   zslb: "", // 招生类别
  //   yuwen: "", // 语文
  //   shuxue: "", //
  //   waiyu: "", // 外语
  //   jiafen: "", // 加分
  //   zongfen: "", // 文化总分
  //   skf: "", // 术科分
  //   lqzf: "", // 录取总分
  //   hkszd: "", // 户口所在地
  //   lqkl: "", // 招生科类
  //   kssx: "", // 考生类别
  //   bylbmc: "", // 毕业类别名称
  //   byzxmc: "" // 毕业中学名称
  // }
  return ax.request({
    url: `${baseUrl}save`,
    method: "post",
    data: params,
  });
}

export function importData(params) {
  //招生计划数据导入
  // 没写对
  return `${baseUrl}importData`;
}

export function updateStatus(params) {
  //修改报道状态
  // params = {
  //   id: "23432", // id
  //   arrivestatus: "1", // 报道状态   1 已报道 0 未报道
  //   arrivestatusname: "s" // 报道状态name
  // }
  return ax.request({
    url: `${baseUrl}updateStatus`,
    method: "post",
    data: params,
  });
}

export function getStudentBatchList(params) {
  //新生数据流转可视化列表
  // params = {
  //   begintime: "", // 开始时间
  //   endtime: "", // 结束时间
  //   opertype: "" // 操作方式
  // }
  return ax.request({
    url: `${baseUrl1}list`,
    method: "post",
    data: params,
  });
}

export function getStudentBatchStatis(params) {
  //新生数据流转可视化 图表
  // params = {
  //   begintime: "", // 开始时间
  //   endtime: "" // 结束时间
  // }
  return ax.request({
    url: `${baseUrl1}zsndStatics`,
    method: "post",
    data: params,
  });
}

export function getStudentBatchDetail(params) {
  //新生数据流转可视化 图表
  // params = {
  //   begintime: "", // 开始时间
  //   endtime: "" // 结束时间
  // }
  return ax.request({
    url: `zsStudentTemp/list`,
    method: "post",
    data: params,
  });
}
