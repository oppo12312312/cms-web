export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null;
  }
  const format = cFormat || "{y}-{m}-{d} {h}:{i}:{s}";
  let date;
  if (typeof time === "object") {
    date = time;
  } else {
    if (typeof time === "string" && /^[0-9]+$/.test(time)) {
      time = parseInt(time);
    }
    if (typeof time === "number" && time.toString().length === 10) {
      time = time * 1000;
    }
    date = new Date(time);
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay(),
  };
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key];
    // Note: getDay() returns 0 on Sunday
    if (key === "a") {
      return ["日", "一", "二", "三", "四", "五", "六"][value];
    }
    if (result.length > 0 && value < 10) {
      value = "0" + value;
    }
    return value || 0;
  });
  return time_str;
}

export function secToTime(s) {
  var t;
  if (s > -1) {
    var hour = Math.floor(s / 3600);
    var min = Math.floor(s / 60) % 60;
    var sec = s % 60;
    if (hour < 10) {
      t = "0" + hour + ":";
    } else {
      t = hour + ":";
    }

    if (min < 10) {
      t += "0";
    }
    t += min + ":";
    if (sec < 10) {
      t += "0";
    }
    t += sec.toFixed(0);
  }
  return t;
}

export function secToDay(s) {
  var t;
  if (s > -1) {
    var hour = Math.floor(s / 3600 / 1000);
    t = (hour / 24).toFixed(1);
  }
  return t;
}

export function getUrlFormate(path) {
  const formateTxt = path ? path.substr(path.lastIndexOf(".")) : "未知";

  return formateTxt;
}

export function formateNum(time) {
  if (time < 10) {
    return "0" + time;
  } else {
    return time;
  }
}

export function workTime(workCron) {
  if (workCron) {
    const st = workCron.split("/")[0];
    const et = workCron.split("/")[1];
    const start_h = formateNum(parseInt(st.split(" ")[2]));
    const start_m = formateNum(parseInt(st.split(" ")[1]));
    const end_h = formateNum(parseInt(et.split(" ")[2]));
    const end_m = formateNum(parseInt(et.split(" ")[1]));
    const workTime = start_h + ":" + start_m + "-" + end_h + ":" + end_m;
    return workTime;
  } else {
    return "全天";
  }
}

//尺寸过滤器(文件体积，显示GB、MB、KB等)
export function resourceSizeFilter(fileSize) {
  const size = parseFloat(fileSize);
  if (size) {
    if (size < 1024) {
      return size + " B";
    } else if (size < 1024 * 1024) {
      return (size / 1024).toFixed(2) + " KB";
    } else if (size < 1024 * 1024 * 1024) {
      return (size / 1024 / 1024).toFixed(2) + " MB";
    } else if (size < 1024 * 1024 * 1024 * 1024) {
      return (size / 1024 / 1024 / 1024).toFixed(2) + " GB";
    } else {
      return (size / 1024 / 1024 / 1024 / 1024).toFixed(2) + " TB";
    }
  } else {
    return "0kb";
  }
}

//数字超过三位加逗号
export function toThousands(num) {
  var num = (num || 0).toString(),
    result = "";
  while (num.length > 3) {
    result = "," + num.slice(-3) + result;
    num = num.slice(0, num.length - 3);
  }
  if (num) {
    result = num + result;
  }
  return result;
}
