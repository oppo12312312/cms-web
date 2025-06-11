<template>
  <el-button type="text" @click="toggle" class="full-btn">
    <i class="el-icon-full-screen"></i>
  </el-button>
</template>

<script>
import screenfull from "screenfull";

export default {
  props: {
    eid: String,
  },
  data() {
    return {
      isFullscreen: false,
    };
  },
  methods: {
    toggle() {
      if (this.isFullscreen) {
        this.isFullscreen = false;
        screenfull.exit();
      } else {
        if (!this.checkFull()) {
          // 如果不允许进入全屏，发出不允许提示
          this.toast("您的浏览器版本过低不支持该功能", "warning");
        } else {
          if (this.eid) {
            screenfull.request(document.getElementById(this.eid));
          } else {
            screenfull.toggle();
          }
          this.isFullscreen = true;
        }
      }
    },
    checkFull() {
      var isFull =
        document.fullscreenEnabled ||
        window.fullScreen ||
        document.webkitIsFullScreen ||
        document.msFullscreenEnabled;
      //to fix : false || undefined == undefined
      if (isFull === undefined) isFull = false;
      return isFull;
    },
  },
};
</script>

<style lang="scss">
.full-btn {
  font-size: 32px;
}
</style>
