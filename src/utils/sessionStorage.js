export function setSessionStorage(key, obj) {
  var str = JSON.stringify(obj);
  return sessionStorage.setItem(key, str);
}

export function getSessionStorage(key, obj) {
  return JSON.parse(sessionStorage.getItem(key));
}

export function removeSessionStorage(key, obj) {
  return sessionStorage.removeItem(key);
}
