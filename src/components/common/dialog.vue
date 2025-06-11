<template>
  <el-dialog
    :modal-append-to-body="true"
    :destroy-on-close="true"
    :append-to-body="true"
    :close-on-click-modal="closeOnClick"
    :custom-class="dialogClass"
    :width="width"
    :title="title"
    :fullscreen="fullscreen"
    :visible.sync="dialogVisible"
    :posting="posting"
    :top="top"
    v-if="dialogVisible"
  >
    <div v-if="myHead" slot="title">
      <slot name="head"></slot>
    </div>
    <slot></slot>
    <div v-if="showFooter" slot="footer" class="dialog-footer">
      <el-button v-if="showCancel" class="btn-custom-cancel" @click="close">{{
        cancelBtnTxt
      }}</el-button>
      <!-- 暂存按钮 -->
      <el-button
        v-if="showConfirm"
        @click="handleClose"
        type="primary"
        :loading="posting"
        >{{ posting ? confirmPostingTxt : confirmBtnTxt }}</el-button
      >
      <slot name="footer" :scope="{ posting }"></slot>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    closeOnClick: {
      type: Boolean,
      default: false,
    },
    showFooter: {
      type: Boolean,
      default: true,
    },
    showConfirm: {
      type: Boolean,
      default: true,
    },
    showCancel: {
      type: Boolean,
      default: true,
    },
    showTemp: {
      type: Boolean,
      default: false,
    },
    fullscreen: {
      type: Boolean,
      default: false,
    },
    dialogClass: {
      type: String,
      default: "xrsz-dialog",
    },
    tempType: {
      type: String,
    },
    isPlain: {
      type: String,
      default: "true",
    },
    confirmBtnTxt: {
      type: String,
      default: "提交",
    },
    cancelBtnTxt: {
      type: String,
      default: "取消",
    },
    tempBtnTxt: {
      type: String,
      default: "暂存",
    },
    confirmPostingTxt: {
      type: String,
      default: "执行中...",
    },
    title: {
      type: String,
      default: "标题",
    },
    width: {
      type: String,
      default: "540px",
    },
    myHead: {
      type: Boolean,
      default: false,
    },
    closedEvent: {
      type: Function,
    },
    top: {
      type: String,
      default: "15vh",
    },
  },
  data() {
    return {
      dialogVisible: false,
      posting: false,
      posting2: false,
    };
  },
  methods: {
    handleClose() {
      this.$emit("handleClose");
    },
    handleTemp() {
      this.$emit("handleTemp");
    },
    open() {
      this.dialogVisible = true;
    },
    close() {
      this.posting = false;
      this.posting2 = false;
      this.dialogVisible = false;
    },
  },
};
</script>
<style lang="scss"></style>
