<template>
  <div class="q-chart-container">
    <el-card :body-style="{ padding: '5px' }" shadow="never">
      <div :id="qchartId" ref="qart"></div>
      <div class="bottom clearfix txt-center">
        <slot></slot>
        <el-tag v-if="downloadCode">
          <a @click="downloadQchart">
            <i class="el-icon-upload"></i>下载二维码
          </a>
        </el-tag>
      </div>
    </el-card>
  </div>
</template>

<script>
import QRCode from "qrcodejs2";
import qrImg from "@p/static/imgs/stu_bg.png";

export default {
  name: "qrCode",
  props: {
    imagePath: {
      type: String,
      default: qrImg,
    },
    size: {
      type: Number,
      default: 140,
    },
    url: {
      type: String,
      default: "",
    },
    downloadCode: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      config: {
        text: this.url,
        width: this.size,
        height: this.size,
        // render: 'canvas' // 设置渲染方式（有两种方式 table和canvas，默认是canvas）
        // background: '#f0f'
        // foreground: '#ff0'
      },
      download: {
        type: Object,
        default: function () {
          return {
            visible: false,
          };
        },
      },
      qr: {},
    };
  },
  created() {
    this.qchartId =
      Number(Math.random().toString().substr(3, length) + Date.now()).toString(
        36
      ) + this.url;
  },
  watch: {
    "config.text": function (val, oldVal) {
      this.config.text = val;
      this.qr.makeCode(val);
    },
    url: function (val, oldVal) {
      this.config.text = val;
    },
  },
  mounted() {
    this.renderQrcode(this.config);
  },
  methods: {
    base64ToBlob(code) {
      var parts = code.split(";base64,");
      var contentType = parts[0].split(":")[1];
      var raw = window.atob(parts[1]);
      var rawLength = raw.length;

      var uInt8Array = new Uint8Array(rawLength);

      for (var i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
      }
      return new Blob([uInt8Array], { type: contentType });
    },
    renderQrcode(config) {
      this.qr = new QRCode(this.qchartId, this.config);
    },
    downloadQchart(e) {
      const { type = "image/png", filename = "download.png" } = this.download;
      const myCanvas = this.$refs.qart.children[0];

      if (window.navigator.msSaveBlob) {
        const blob = this.base64ToBlob(myCanvas.toDataURL(type));
        try {
          window.navigator.msSaveBlob(blob, "download.png");
        } catch (e) {}
      } else {
        e.target.href = myCanvas.toDataURL(type);
        e.target.download = "download.png";
      }
    },
  },
};
</script>

<style lang="scss">
.q-chart-container {
  .el-card {
    border: 0;
    img {
      margin: 0 auto;
    }
  }
  .el-tag {
    a {
      cursor: pointer;
      color: #409eff;
    }
  }
}
</style>
