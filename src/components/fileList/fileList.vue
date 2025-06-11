<template>
  <div>
    <ul class="el-upload-list file-list" v-if="propsFiles.length">
      <li
        class="el-upload-list__item"
        v-for="(file, index) in propsFiles"
        :key="file.fileId"
      >
        <a
          class="el-upload-list__item-name cursorPoint"
          @click="download(file)"
        >
          <i class="el-icon-document"></i>
          {{ file.fileName }}
        </a>
        <div class="btn-wrap">
          <span
            class="el-delete"
            v-if="acceptDocs.indexOf(getFileType(file)) > -1"
          >
            <pdf-viewer :url="url" :query="getQuery(file)"></pdf-viewer>
          </span>
          <span
            class="el-delete"
            v-if="acceptImgs.indexOf(getFileType(file)) > -1"
            @click="showImg(file)"
          >
            预览
            <image-viewer
              :url="url"
              :query="getQuery(file)"
              :ref="file.fileId"
            ></image-viewer>
          </span>
          <span
            class="el-delete"
            v-if="acceptAudios.indexOf(getFileType(file)) > -1"
            @click="showAudio(file)"
            >预览</span
          >
          <span
            class="el-delete"
            v-if="acceptVideos.indexOf(getFileType(file)) > -1"
            @click="showVideo(file)"
            >预览</span
          >
          <span class="el-delete" @click="download(file)">下载</span>
          <span class="el-delete" v-if="operate" @click="del(file, index)"
            >删除</span
          >
        </div>
      </li>
    </ul>
    <v-dialog ref="previewDialog" :show-footer="false" title="预览">
      <div class="preview-wraper" v-loading="loadingFile">
        <audio
          style="width: 100%"
          autoplay
          controls="controls"
          v-if="type == 'audio' && !loadingFile"
          :src="audioSrc"
        >
          您的浏览器不支持auido预览。
        </audio>
        <video
          style="width: 100%; height: 300px"
          autoplay
          v-else
          controls="controls"
          :src="videoSrc"
        >
          您的浏览器不支持video预览。
        </video>
      </div>
    </v-dialog>
  </div>
</template>

<script>
import pdfViewer from "_c/pdfViewer";
import imageViewer from "_c/imageViewer";
import { downloadFile, getFile } from "@/api/file";
export default {
  props: {
    propsFiles: Array,
    url: { type: String, default: "/pFile/downFile" },
    downUrl: { type: String, default: "/pFile/downFile" },
    operate: Boolean,
  },
  data() {
    return {
      loading: true,
      fileList: [],
      audioSrc: "",
      videoSrc: "",
      type: "",
      loadingFile: true,
      acceptImgs: ["gif", "jpg", "jpeg", "png", "zip"],
      acceptAudios: ["wma", "mp3"],
      acceptVideos: ["avi", "mp4"],
      //acceptDocs: ["pdf", "doc", "docx"],
      acceptDocs: ["pdf"],
    };
  },
  components: {
    pdfViewer,
    imageViewer,
  },
  methods: {
    getQuery(file) {
      return {
        fileId: file.fileId ? file.fileId : file,
      };
    },
    getFileType(file) {
      return file.fileName.substring(file.fileName.lastIndexOf(".") + 1);
    },
    download(file) {
      downloadFile(
        this.downUrl,
        "post",
        file.fileName,
        "",
        this.getQuery(file),
        {},
        true
      );
    },
    showImg(file) {
      this.$refs[file.fileId][0].show();
    },
    showAudio(file) {
      const me = this;
      me.loadingFile = true;
      me.$refs.previewDialog.dialogVisible = true;
      getFile(this.url, "post", {}, this.getQuery(file), true).then((url) => {
        me.audioSrc = url;
        me.type = "audio";
        me.loadingFile = false;
      });
    },
    showVideo(file) {
      const me = this;
      me.$refs.previewDialog.dialogVisible = true;
      me.loadingFile = true;
      me.$refs.previewDialog.dialogVisible = true;

      getFile(this.url, "post", {}, this.getQuery(file), true).then((url) => {
        me.videoSrc = url;
        me.type = "video";
        me.loadingFile = false;
      });
    },
    del(file, index) {
      this.$emit("del", { file: file, index: index });
    },
  },
};
</script>
<style lang="less"></style>
