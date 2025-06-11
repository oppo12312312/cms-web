export default {
  bind: function (el, binding, vnode) {},
  inserted(el) {
    const height = window.getComputedStyle(el).height;
    if (el.innerHTML.length > 40) {
      const txt = txt.substr(0, 40) + "...";
      el.innerHTML = txt;
    }
  },
};
