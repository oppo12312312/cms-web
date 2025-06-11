<template>
  <el-upload
    action="#"
    :auto-upload="false"
    :disabled="disabled"
    :file-list="fileList"
    multiple
    :accept="accept"
    :limit="config.limit"
    :on-exceed="handleExceed"
    :before-upload="beforeUpload"
    :on-change="handleChange"
    :on-remove="handleRemove"
    :on-preview="handlePreview"
  >
    <el-button size="small" icon="el-icon-upload">选择附件</el-button>
    <div slot="tip" class="el-upload__tip">{{ tip }}</div>
  </el-upload>
</template>

<script>
import { downloadFile } from "@/api/file";
import { list, delFile } from "@/api/pFile";
export default {
  props: {
    value: {
      type: Object,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      fileList: [],
    };
  },
  computed: {
    config() {
      return this.value.config || {};
    },
    accept() {
      return this.config.accept.join(",");
    },
    tip() {
      const arr = [];
      if (this.config.size) {
        arr.push(`不超过 ${this.config.size}MB`);
      }
      if (this.config.limit) {
        arr.push(`上传 ${this.config.limit}个附件`);
      }
      if (this.config.accept.length) {
        arr.push(`格式为：${this.config.accept.join("/")}`);
      }
      return arr.join("，");
    },
  },
  watch: {
    config: {
      handler() {
        if (this.config.value) {
          this.loadData();
        }
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    loadData() {
      this.fileList = [];
      list(this.value.biztype, this.config.value).then((res) => {
        this.fileList = (res.data || []).map((v) => ({
          ...v,
          name: v.fileName,
        }));
        this.value.files = this.fileList;
      });
    },
    handleRemove(file, fileList) {
      if (file.fileId) {
        delFile({ fileId: file.fileId }).then((res) => {
          if (res.code == 200) {
            this.$message.success("删除成功");
          } else {
            this.$message.warning(res.msg);
          }
        });
      }
      this.value.files = this.fileList;
    },
    handlePreview(file) {
      if (file.fileId) {
        downloadFile(
          "/pFile/downFile",
          "post",
          file.fileName,
          "",
          { fileId: file.fileId },
          {}
        );
      }
    },
    beforeUpload(file) {
      const fileSize = file.size / 1024 / 1024;
      if (this.config.size && fileSize > this.config.size) {
        this.$message.error(`上传文件大小不能超过 ${this.config.size}MB!`);
        return false;
      }
      return true;
    },
    handleChange(files, fileList) {
      this.value.files = fileList;
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 ${this.config.limit} 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
  },
};
</script>

<style>
.preview-item {
  display: inline-block;
  margin-right: 5px;
  width: 80px;
  height: 80px;
}
</style>
