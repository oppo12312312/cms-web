import ax from "@/utils/request";
import qs from "qs";

export function downloadExcelFile(url, type, name, data, params) {
  if (data) {
    delete data.pageSize;
    delete data.pageIndex;
  }
  return ax
    .request({
      url: url,
      method: type,
      responseType: "blob",
      params: params,
      data: data,
      timeout: 5 * 60000,
    })
    .then((res) => {
      const fileName = res.headers.filename
        ? decodeURI(res.headers.filename)
        : (name || "excel") + ".xls";
      const href = window.URL.createObjectURL(new Blob([res.data]));
      if (window.navigator.msSaveBlob) {
        const blob = new Blob([res], {
          type: "application/json;charset=utf-8",
        });
        try {
          window.navigator.msSaveBlob(blob, fileName);
        } catch (e) {}
      } else {
        // 谷歌浏览器 创建a标签 添加download属性下载
        const downloadElement = document.createElement("a");
        downloadElement.href = href;
        // downloadElement.target = '_blank';
        downloadElement.download = fileName; // 下载后文件名
        document.body.appendChild(downloadElement);
        downloadElement.click(); // 点击下载
        document.body.removeChild(downloadElement); // 下载完成移除元素
        window.URL.revokeObjectURL(href); // 释放掉blob对象
      }
      return {};
    })
    .catch(() => {
      return {};
    });
}

export function delFile(moduleId, params) {
  return ax.request({
    url: `/pFile/delFile`,
    method: "post",
    params: params,
  });
}

export function uploadFiles(url, data, files, fName) {
  const formData = new FormData();
  for (const key in data) {
    if (data[key] && typeof data[key] == "object") {
      for (let i = 0; i < data[key].length; i++) {
        for (const k in data[key][i]) {
          if (data[key][i][k]) {
            formData.append(`${key}[${i}].${k}`, data[key][i][k]);
          }
        }
      }
    } else {
      formData.append(key, data[key]);
    }
  }
  if (files && files.length) {
    for (const file of files) {
      if (file.raw) {
        formData.append(fName ? fName : "files", file.raw);
      }
    }
  }
  return ax.request({
    headers: {
      "Content-Type": "multipart/form-data",
    },
    url: url,
    method: "post",
    data: formData,
    timeout: 600000,
  });
}

export function downloadFile(url, type, name, fileType, params, data) {
  return ax
    .request({
      url: url,
      method: type,
      responseType: "blob",
      params: params,
      data: data,
    })
    .then((res) => {
      // let fileName = decodeURI(res.headers["content-disposition"].split("filename=")[1]) || name;
      const fileName = name;
      const href = window.URL.createObjectURL(new Blob([res.data]));
      if (window.navigator.msSaveBlob) {
        const blob = new Blob([res], {
          type: "application/json;charset=utf-8",
        });
        try {
          window.navigator.msSaveBlob(blob, fileName);
        } catch (e) {}
      } else {
        // 谷歌浏览器 创建a标签 添加download属性下载
        const downloadElement = document.createElement("a");
        downloadElement.href = href;
        // downloadElement.target = '_blank';
        downloadElement.download = fileName; // 下载后文件名
        document.body.appendChild(downloadElement);
        downloadElement.click(); // 点击下载
        document.body.removeChild(downloadElement); // 下载完成移除元素
        window.URL.revokeObjectURL(href); // 释放掉blob对象
      }
    });
}

// export function downloadFile2(url, type, name, fileType, params, data) {
//   return new Promise((resolve, reject) =>
//     ax.request({
//       url: url,
//       method: type,
//       responseType: 'blob',
//       params: params,
//       data: data
//     }).then(res => {
//       //先判断类型,如果是json就直接输出后端的msg
//       if (res.type != "application/json") {
//         const fileName = name;
//         const name1 = fileName;
//         const href = window.URL.createObjectURL(new Blob([res]))
//         if (window.navigator.msSaveBlob) {
//           const blob = new Blob([res], {
//             type: 'application/json;charset=utf-8'
//           })
//           try {
//             window.navigator.msSaveBlob(blob, name1)
//           } catch (e) {

//           }
//         } else {
//           // 谷歌浏览器 创建a标签 添加download属性下载
//           const downloadElement = document.createElement('a')
//           downloadElement.href = href
//           // downloadElement.target = '_blank';
//           downloadElement.download = name1 // 下载后文件名
//           document.body.appendChild(downloadElement)
//           downloadElement.click() // 点击下载
//           document.body.removeChild(downloadElement) // 下载完成移除元素
//           window.URL.revokeObjectURL(href) // 释放掉blob对象
//         }
//       }
//       resolve(res);
//     })
//   )
// }

export function downloadFile3(fileId, name) {
  return new Promise((resolve, reject) => {
    ax.request({
      url: "/pFile/downFile",
      method: "post",
      params: {
        fileId: fileId,
      },
      responseType: "blob",
      timeout: 30 * 60000,
    })
      .then((res) => {
        const fileName = res.headers.filename
          ? decodeURI(res.headers.filename)
          : name || "excel";
        const href = window.URL.createObjectURL(new Blob([res.data]));
        if (window.navigator.msSaveBlob) {
          const blob = new Blob([res], {
            type: "application/json;charset=utf-8",
          });
          try {
            window.navigator.msSaveBlob(blob, fileName);
          } catch (e) {}
        } else {
          // 谷歌浏览器 创建a标签 添加download属性下载
          const downloadElement = document.createElement("a");
          downloadElement.href = href;
          // downloadElement.target = '_blank';
          downloadElement.download = fileName; // 下载后文件名
          document.body.appendChild(downloadElement);
          downloadElement.click(); // 点击下载
          document.body.removeChild(downloadElement); // 下载完成移除元素
          window.URL.revokeObjectURL(href); // 释放掉blob对象
        }
        resolve({ code: 200 });
      })
      .catch(() => {
        reject({ code: 500 });
      });
  });
}

export function getFile(url, type, params, data, isFormate) {
  return new Promise((resolve, reject) => {
    ax.request({
      url: url,
      method: type,
      responseType: "blob",
      params: params,
      data: isFormate ? qs.stringify(data) : data,
    }).then((res) => {
      const href = window.URL.createObjectURL(new Blob([res.data]));
      resolve(href);
    });
  });
}

export function getImg(fileId) {
  /*  query = {
    zpPath : ""//必要参数，图片路径
  } */
  return new Promise((resolve, reject) => {
    ax.request({
      url: "/pFile/downFile",
      method: "post",
      params: {
        fileId: fileId,
      },
      responseType: "blob",
    }).then((res) => {
      const url = window.URL.createObjectURL(new Blob([res.data]));
      resolve(url);
    });
  });
}

export function getImg2(params) {
  /*  query = {
    zpPath : ""//必要参数，图片路径
  } */
  return new Promise((resolve, reject) => {
    ax.request({
      url: "/file/getZp",
      method: "post",
      params,
      responseType: "blob",
    }).then((res) => {
      const url = window.URL.createObjectURL(new Blob([res.data]));
      resolve(url);
    });
  });
}
export function getPdf(fileId, url, type) {
  /*  query = {
    zpPath : ""//必要参数，图片路径
  } */
  return new Promise((resolve, reject) => {
    ax.request({
      url: "/pFile/downFile",
      method: "post",
      params: {
        fileId: fileId,
      },
      responseType: "blob",
    }).then((res) => {
      const url = window.URL.createObjectURL(new Blob([res.data]));
      if (type == "down") {
        // 谷歌浏览器 创建a标签 添加download属性下载
        const downloadElement = document.createElement("a");
        downloadElement.href = href;
        // downloadElement.target = '_blank';
        downloadElement.download = name1 + ".pdf"; // 下载后文件名
        document.body.appendChild(downloadElement);
        downloadElement.click(); // 点击下载
        document.body.removeChild(downloadElement); // 下载完成移除元素
        window.URL.revokeObjectURL(href); // 释放掉blob对象
      } else {
        resolve(url);
      }
    });
  });
}
