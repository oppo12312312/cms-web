export default {
  bind: function (el, binding, vnode) {},
  inserted(el) {
    const body = document.getElementsByTagName("body")[0];
    if (body.append) {
      body.append(el);
    } else {
      body.appendChild(el);
    }
  },
  unbind(el) {
    const body = document.getElementsByTagName("body")[0];
    body.removeChild(el);
  },
};
