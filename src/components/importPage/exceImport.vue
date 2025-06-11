<template>
  <div class="exceImportWrap">
    <div class="title">
      <i class="el-icon-upload"></i>
      <span class="txt">【{{ $route.meta.title }}】导入</span>
    </div>
    <div class="content fn-mb15">
      <p style="line-height: 32px; font-szie: 24px">导入说明</p>
      <p style="font-size: 12px" v-if="type == 'excel'">
        本系统支持xls，xlsx格式，请确保表格中的数据不含有空格等特殊符号
        <span v-if="templateDownload">
          ，标准格式请参考
          <a class="txt-highlight cursorPoint" @click="templateDownload"
            >【导入模板】</a
          >
        </span>
      </p>
      <p style="font-size: 12px" v-if="type == 'image'">
        本系统支持gif，jpg，jpeg，png等，支持zip压缩包格式
        <span v-if="templateDownload">
          ，标准格式请参考
          <a class="txt-highlight cursorPoint" @click="templateDownload"
            >【导入摸板】</a
          >
        </span>
      </p>
      <p style="font-size: 12px" v-if="type == 'zip'">
        本系统支持zip压缩包格式
        <span v-if="templateDownload">
          ，标准格式请参考
          <a class="txt-highlight cursorPoint" @click="templateDownload"
            >【导入摸板】</a
          >
        </span>
      </p>
    </div>
    <div class="content fn-mb15" v-if="tip">
      <p style="line-height: 32px; font-szie: 24px">注意事项</p>
      <p style="font-size: 12px">{{ tip }}</p>
    </div>
    <slot></slot>
    <div>
      <el-upload
        ref="upload"
        class="upload-demo"
        :on-change="onChange"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :file-list="fileList"
        :before-upload="handleBefore"
        :auto-upload="autoUpload"
        :action="nAction"
        :headers="headers"
        :on-error="onErr"
        :on-success="onSuccess"
        :data="data"
        v-if="!showResult"
        v-loading="loading"
      >
        <el-button slot="trigger" size="small" type="primary"
          >选择文件</el-button
        >
        <el-button
          class="fn-ml15"
          size="small"
          type="primary"
          @click="submitUpload"
          >上传</el-button
        >
        <!-- <el-button
          v-if="hasHis"
          class="fn-ml15"
          size="small"
          type="primary"
          @click="checkHis"
          >查看导入历史</el-button
        > -->
      </el-upload>
      <slot name="result" v-else></slot>
    </div>
  </div>
</template>

<script>
import { getToken, removeToken } from "@/utils/auth";
import config from "@/config";
import { mapActions } from "vuex";
import tableMinxin from "_c/tables/minxins/tableMinxin.js";
import basicTable from "_c/tables/";
import { getSessionStorage } from "@/utils/sessionStorage";
export default {
  props: {
    action: String,
    autoUpload: Boolean,
    templateDownload: Function,
    beforeUpload: Function,
    detail: Function,
    tip: String,
    data: { type: Object, default: () => {} },
    type: {
      type: String,
      default: "excel",
    },
    detailType: {
      type: String,
      default: "",
    },
    result: {
      type: Boolean,
      default: true,
    },
    hasHis: {
      type: Boolean,
      default: true,
    },
  },
  mixins: [tableMinxin],
  components: {
    basicTable,
  },
  created() {
    this.show = true;
  },
  computed: {
    nAction: function () {
      const sUrl = getSessionStorage("baseUrl");
      return sUrl
        ? sUrl + this.action
        : process.env.NODE_ENV === "production"
        ? document.location.protocol +
          "//" +
          location.host +
          "/" +
          config.baseUrl.pro +
          "/" +
          this.action
        : config.baseUrl.dev + this.action;
    },
  },
  data() {
    return {
      fileList: [],
      headers: {
        authorization: getToken(),
      },
      count: 0,
      showResult: false,
      loading: false,
      resultCount: {
        successcount: 0,
        failcount: 0,
      },
    };
  },
  methods: {
    ...mapActions(["getColumns"]),

    check() {},
    checkHis() {
      this.$emit("checkHis");
    },
    submitUpload() {
      if (this.fileList.length) {
        if (this.beforeUpload) {
          this.beforeUpload(() => {
            this.$refs.upload.submit();
          });
        } else {
          this.$refs.upload.submit();
        }
      } else {
        this.toast("至少需要上传一个文件", "warning");
      }
    },
    handleRemove(file, fileList) {},
    handlePreview(file) {},
    handleBefore() {
      this.loading = true;
    },
    onErr(err) {},
    onSuccess(res, file, fileList) {
      const successcount = 0;
      const failcount = 0;
      if (res.code == 200) {
        this.count++;
      } else {
        this.toast(res.msg, "error");
        this.$nextTick(() => {
          this.fileList = fileList = fileList.filter((item) => {
            return item.uid != file.uid;
          });
        });
        this.loading = false;
      }
      if (this.count == fileList.length) {
        if (this.result && res.data) {
          this.resultCount = {
            successcount: successcount,
            failcount: failcount,
            batchid: res.data.batchid,
          };
          this.showResult = true;
        }
        this.loading = false;

        this.$emit("uploaded", res);
      }
    },
    onChange(file, fileList) {
      const nFile = fileList.pop();
      const fileType = file.name.substring(file.name.lastIndexOf(".") + 1);
      switch (this.type) {
        case "excel":
          if (["xls", "xlsx"].indexOf(fileType) > -1) {
            fileList.push(nFile);
            this.fileList = fileList;
          } else {
            this.toast("只能上传xls、xlsx格式的文件", "warning");
          }
          break;
        case "image":
          if (["gif", "jpg", "jpeg", "png", "zip"].indexOf(fileType) > -1) {
            fileList.push(nFile);
            this.fileList = fileList;
          } else {
            this.toast("只能上传gif、jpg、jpeg、png、zip格式的文件", "warning");
          }
          break;
        case "zip":
          if (["zip"].indexOf(fileType) > -1) {
            fileList.push(nFile);
            this.fileList = fileList;
          } else {
            this.toast("只能上传zip格式的文件", "warning");
          }
          break;
        case "all":
          fileList.push(nFile);
          this.fileList = fileList;
          break;
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
  .importTypeWrap {
    .el-form-item {
      margin-bottom: 0;
    }
  }
}
</style>
