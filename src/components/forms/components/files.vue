<template>
  <div style="display: flex; flex-wrap: wrap">
    <template v-if="fileType == 'image'">
      <ul
        v-for="(f, i) in fileList"
        :key="f.fileId"
        class="el-upload-list el-upload-list--picture-card"
        style="background: #fff"
      >
        <li
          tabindex="0"
          class="el-upload-list__item is-ready"
          :style="`width: 120px;height: 60px;`"
        >
          <div :style="`width: 120px;height: 60px;`">
            <img
              :src="f.url"
              alt=""
              class="el-upload-list__item-thumbnail"
              style="object-fit: cover"
            />
            <span
              class="el-upload-list__item-actions"
              style="
                display: flex;
                justify-content: space-around;
                align-items: center;
              "
            >
              <el-image
                style="width: 32px; height: 32px"
                src="./static/imgs/fdj.png"
                :initial-index="i"
                :preview-src-list="fileList.map((file) => file.url)"
                class="el-upload-list__item-preview"
              ></el-image>
              <div style="width: 32px; height: 32px">
                <span
                  @click="downloadFile(f)"
                  class="el-upload-list__item-delete"
                  ><i class="el-icon-download" style="font-size: 32px"></i
                ></span>
              </div>
              <div v-if="!disabled" style="width: 32px; height: 32px">
                <span @click="del(f)" class="el-upload-list__item-delete"
                  ><i class="el-icon-delete" style="font-size: 32px"></i
                ></span>
              </div>
            </span>
          </div>
        </li>
      </ul>
    </template>
    <template v-if="!disabled">
      <template v-if="!loading">
        <el-upload
          v-if="limit == 0 || fileList.length < limit"
          action=""
          :on-change="(file, fileList) => onChange(file, fileList)"
          :auto-upload="false"
          :show-file-list="false"
        >
          <div
            v-if="fileType == 'image'"
            class="el-upload el-upload--picture-card"
            style="width: 60px; height: 60px; line-height: 70px"
          >
            <i class="el-icon-plus"></i
            ><input type="file" name="file" class="el-upload__input" />
          </div>
          <el-button v-else slot="default" type="primary" :loading="loading"
            >选择文件</el-button
          >
        </el-upload>
        <template v-else>
          <div
            @click="overflow"
            v-if="fileType == 'image'"
            class="el-upload el-upload--picture-card"
            style="width: 60px; height: 60px; line-height: 70px"
          >
            <i class="el-icon-plus"></i
            ><input type="file" name="file" class="el-upload__input" />
          </div>
          <el-button @click="overflow" v-else type="primary" :loading="loading"
            >选择文件</el-button
          >
        </template>
      </template>
      <el-button v-else type="primary" :loading="loading"
        >文件上传中...</el-button
      >
    </template>

    <div
      v-if="placeholder && !disabled"
      style="
        width: 100%;
        font-size: 12px;
        color: #6f727a;
        line-height: 20px;
        padding-bottom: 8px;
        padding-top: 4px;
      "
    >
      {{ placeholder }}
    </div>
    <template v-if="fileType == 'file'">
      <div :style="{ 'padding-top': disabled ? '4px' : '0' }">
        <div v-for="f in fileList" :key="f.fileId" class="file-item">
          <div><i class="el-icon-document"></i> {{ f.fileName }}</div>
          <div style="font-size: 20px; cursor: pointer">
            <i class="el-icon-download" @click="downloadFile(f)"></i>&nbsp;
            <i v-if="!disabled" class="el-icon-delete" @click="del(f)"></i>
          </div>
        </div>
      </div>
    </template>
    <div
      v-if="disabled && fileList && fileList.length == 0"
      style="color: #999"
    ></div>
  </div>
</template>
<script>
import { businessId, delFile, list } from "@/api/pFile";
import { uploadFiles, getImg, downloadFile3 } from "@/api/file";

export default {
  model: {
    prop: "value",
    event: "change",
  },
  props: {
    value: String,
    disabled: Boolean,
    fileType: String,
    fileTypes: {
      type: Array,
      default: () => [],
    },
    businessId: String,
    // limit为1时并且fileType为image时，value为fileId
    limit: {
      default: 0,
    },
    size: {
      type: Number,
      default: 2,
    },
    moduleId: {
      type: String,
      default: "taskManager",
    },
    placeholder: String,
    imageSize: {
      type: String,
      default: "148",
    },
  },
  data() {
    return {
      bid: "",
      fileList: [],
      mode: "",
      loading: false,
      isDownload: false,
    };
  },
  watch: {
    value: {
      handler() {
        if (this.businessId && this.fileType == "image" && this.disabled) {
          getImg(this.value).then((url) => {
            this.fileList = [{ fileId: this.value, url, fileName: "" }];
          });
        }
      },
      immediate: false,
    },
  },
  computed: {},
  created() {
    if (this.businessId && this.limit == 1) {
      this.bid = this.businessId;
      this.mode = "fileId";
      if (this.value) {
        getImg(this.value).then((url) => {
          this.fileList.push({ fileId: this.value, url, fileName: "" });
        });
      }
      // 传businessId和limit=1时，value为fileId
    } else {
      if (!this.value) {
        businessId().then((res) => {
          this.bid = res.data;
          this.$emit("change", res.data);
          this.getList();
        });
      } else {
        this.bid = this.value;
        this.getList();
      }
    }
  },
  methods: {
    async getList() {
      const flist = await list(this.moduleId, this.bid);
      const fileList = [];
      if (this.fileType != "image") {
        this.getImg();
      }
      for (const i in flist.data) {
        if (this.fileType == "image") {
          const url = await getImg(flist.data[i].fileId);
          flist.data[i].url = url;
        }
        fileList.push(flist.data[i]);
      }
      this.fileList = fileList;
    },
    async getImg() {
      for (const i in this.fileList) {
        const url = await getImg(this.fileList[i].fileId);
        this.fileList[i].url = url;
      }
    },
    onChange(file) {
      const fileType = file.name
        .substring(file.name.lastIndexOf(".") + 1)
        .toLowerCase();
      const size = file.raw.size / 1024 / 1024;
      if (this.fileTypes.length && this.fileTypes.indexOf(fileType) == -1) {
        return this.toast(
          "文件格式只支持" + this.fileTypes.toString(),
          "warning"
        );
      }
      if (size > this.size) {
        return this.toast(
          `${this.fileType == "image" ? "图片" : "文件"}大小不能超过${
            this.size
          }M`,
          "warning"
        );
      }
      this.loading = true;
      uploadFiles(
        `/pFile/uploadFile`,
        { bussinessId: this.bid, moduleId: this.moduleId },
        [file]
      )
        .then((res) => {
          if (res.data && res.data[0]) {
            this.toast("上传文件成功", "success");
            if (this.fileType != "image") {
              this.fileList.push({
                fileId: res.data[0],
                url: "",
                fileName: file.name,
              });
            } else {
              getImg(res.data[0]).then((url) => {
                this.fileList.push({
                  fileId: res.data[0],
                  url,
                  fileName: file.name,
                });
              });
            }
            if (this.mode == "fileId") {
              this.$emit("change", res.data[0]);
            }
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    del(file) {
      delFile({ fileId: file.fileId }).then((res) => {
        this.toast("删除成功", "success");
        this.fileList = this.fileList.filter((f) => f.fileId != file.fileId);
        if (this.mode == "fileId") {
          this.$emit("change", "");
        }
      });
    },
    downloadFile(file) {
      if (this.isDownload) return;
      this.isDownload = true;
      downloadFile3(file.fileId, file.fileName)
        .then((res) => {
          this.isDownload = false;
        })
        .catch(() => {
          this.isDownload = false;
        });
    },
    overflow() {
      this.toast(`最大文件数为${this.limit}，请删除后再上传`, "warning");
    },
  },
};
</script>
<style lang="scss" scoped>
.file-item {
  line-height: 32px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding-left: 2px;
  padding-right: 8px;
  border-radius: 4px;
}
.file-item:hover {
  background: #eeeeee;
}
</style>
