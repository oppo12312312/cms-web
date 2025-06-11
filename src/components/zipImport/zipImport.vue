<template>
  <div class="exceImportWrap">
    <div class="title">
      <i class="el-icon-upload"></i>
      <span class="txt">【基本信息】</span>
    </div>
    <div class="content">
      <p style="line-height: 32px; font-szie: 24px">导入说明</p>
      <p style="font-size: 12px">
        本系统支持xls，xlsx格式，请确保表格中的数据不含有空格等特殊符号，标准格式请参考
        <a class="txt-highlight cursorPoint" @click="zsPlanTemplate"
          >【导入摸板】</a
        >
      </p>
    </div>
    <div class="content">
      <p style="line-height: 32px; font-szie: 24px">注意事项</p>
      <p style="font-size: 12px">
        导入的专业对应的省份招生计划信息已存在，则更新对应的招生计划信息
      </p>
    </div>
    <div style="padding-top: 15px">
      <el-upload
        ref="upload"
        class="upload-demo"
        :on-change="onChange"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :file-list="fileList"
        :auto-upload="autoUpload"
        :action="action"
        :headers="headers"
        :on-error="onErr"
        :on-success="onSuccess"
      >
        <el-button size="small" type="primary">选择文件</el-button>
        <el-button size="small" type="primary" @click="submitUpload"
          >上传</el-button
        >
        <span slot="tip" class="el-upload__tip txt-red"
          >（只能上传xls和xlsx文件）</span
        >
      </el-upload>
    </div>
  </div>
</template>

<script>
import { getToken, removeToken } from "@/utils/auth";
import { zsPlanTemplate } from "@/api/enrollment";

export default {
  props: {
    action: String,
    autoUpload: Boolean,
  },
  data() {
    return {
      fileList: [],
      headers: {
        authorization: getToken(),
      },
    };
  },
  methods: {
    zsPlanTemplate() {
      zsPlanTemplate();
    },
    submitUpload(cb) {
      if (this.fileList.length) {
        this.$refs.upload.submit();
      } else {
        this.toast("至少需要上传一个文件", "warning");
      }
    },
    handleRemove(file, fileList) {},
    handlePreview(file) {},
    onErr(err) {},
    onSuccess(res) {
      if (res.code == 200) {
      } else {
        this.toast(res.msg, "warning");
      }
    },
    onChange(file, fileList) {
      const nFile = fileList.pop();
      const fileType = file.name.substring(file.name.lastIndexOf(".") + 1);
      if (["xls", "xlsx"].indexOf(fileType) > -1) {
        fileList.push(nFile);
        this.fileList = fileList;
      } else {
        this.toast("只能上传xls、xlsx格式的文件", "warning");
      }
    },
  },
};
</script>
<style lang="scss">
.exceImportWrap {
  text-align: left;
  .title {
    font-size: 18px;
    border-bottom: 1px solid #ccc;
    padding-bottom: 15px;
    .txt {
      text-indent: -10px;
    }
  }
  .content {
    padding-bottom: 15px;
    font-size: 14px;
    border-bottom: 1px solid #ccc;
  }
  .el-upload-list {
    height: 150px;
    border: 1px solid #ccc;
    border-radius: 4px;
    overflow-y: auto;
    margin-top: 15px;
  }
}
</style>
