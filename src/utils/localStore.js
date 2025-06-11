// 存储数据localStorage（数组对象格式）
export function setStorageObj(key, obj) {
  var str = JSON.stringify(obj);
  return localStorage.setItem(key, str);
}

// 获取数据（数组对象格式）
export function getLocalStore(key) {
  return JSON.parse(localStorage.getItem(key));
}

// 存储数据（字符串）
export function setLocalStore(key, data) {
  return localStorage.setItem(key, data);
}

// 获取数据（字符串）
export function getStorage(key) {
  return localStorage.getItem(key);
}

// 清除数据（所有格式）
export function removeStorage(key) {
  return localStorage.removeItem(key);
}
