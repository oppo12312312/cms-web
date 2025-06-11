<template>
  <div>
    <el-upload
      action="#"
      :file-list="fileList"
      :auto-upload="false"
      :disabled="disabled"
      multiple
      accept="image/*"
      :limit="config.limit"
      :on-exceed="handleExceed"
      list-type="picture-card"
      :before-upload="beforeUpload"
      :on-change="handleChange"
    >
      <i class="el-icon-plus avatar-uploader-icon"></i>
      <template slot="file" slot-scope="{ file }">
        <ImgView
          class="el-upload-list__item-thumbnail"
          :fileId="file.fileId"
          v-if="file.fileId"
        />
        <img
          class="el-upload-list__item-thumbnail"
          :src="file.url"
          alt=""
          v-else
        />
        <span class="el-upload-list__item-actions">
          <span
            class="el-upload-list__item-delete"
            @click="handleDownload(file)"
          >
            <i class="el-icon-download"></i>
          </span>
          <span
            class="el-upload-list__item-delete"
            v-if="!disabled"
            @click="handleRemove(file)"
          >
            <i class="el-icon-delete"></i>
          </span>
        </span>
      </template>
    </el-upload>
    <div class="img-tip">{{ tip }}</div>
  </div>
</template>

<script>
import { getImg, downloadFile } from "@/api/file";
const ImgView = {
  props: ["fileId"],
  data() {
    return {
      url: "",
    };
  },
  async created() {
    this.url = await getImg(this.fileId);
  },
  render(h) {
    return <img src={this.url} />;
  },
};

import { list, delFile } from "@/api/pFile";
export default {
  components: {
    ImgView,
  },
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
    tip() {
      const arr = [];
      if (this.config.size) {
        arr.push(`不超过 ${this.config.size}MB`);
      }
      if (this.config.limit) {
        arr.push(`上传 ${this.config.limit}张图片`);
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
    handleRemove(file) {
      if (file.fileId) {
        delFile({ fileId: file.fileId }).then((res) => {
          if (res.code == 200) {
            this.$message.success("删除成功");
          } else {
            this.$message.warning(res.msg);
          }
        });
        this.fileList = this.fileList.filter((v) => v.fielId != file.fielId);
      } else {
        this.fileList = this.fileList.filter((v) => v.url != file.url);
      }
      this.value.files = this.fileList;
    },
    handleDownload(file) {
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

<style lang="scss" scoped>
/deep/ .el-upload-list {
  .el-upload-list__item {
    padding-right: 0;
  }
}

.img-tip {
  font-family: PingFangSC-Regular;
  font-weight: 400;
  font-size: 12px;
  color: #8c8c8c;
  letter-spacing: 0;
}
</style>
