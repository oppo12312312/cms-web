<template>
  <div class="tinymce-editor">
    <editor
      v-model="myValue"
      :init="init"
      :disabled="disabled"
      @onClick="onClick"
    >
    </editor>
  </div>
</template>
<script>
import tinymce from "tinymce/tinymce";
import Editor from "@tinymce/tinymce-vue";
import "tinymce/themes/silver";
import "tinymce/icons/default/icons";
// 编辑器插件plugins
// 更多插件参考：https://www.tiny.cloud/docs/plugins/
import "tinymce/plugins/image"; // 插入上传图片插件
import "tinymce/plugins/link";
import "tinymce/plugins/code";
import "tinymce/plugins/table"; // 插入表格插件
import "tinymce/plugins/lists"; // 列表插件
import "tinymce/plugins/wordcount"; // 字数统计插件
// import 'tinymce/plugins/colorpicker';
// import 'tinymce/plugins/textcolor';
import "tinymce/plugins/media"; // 插入视频插件
import "tinymce/plugins/fullscreen";
import "tinymce/plugins/preview";
import "tinymce/plugins/pagebreak";
import "tinymce/plugins/insertdatetime";
import "tinymce/plugins/hr";
import "tinymce/plugins/paste";
import "tinymce/plugins/codesample";
const toolbar = [
  "bold italic underline strikethrough fontselect fontsizeselect formatselect forecolor backcolor alignleft aligncenter alignright alignjustify bullist numlist outdent indent blockquote removeformat undo redo link unlink image insertdatetime table  hr pagebreak codesample code fullscreen preview",
];

export default {
  components: {
    Editor,
  },
  props: {
    value: {
      type: String,
      default: "",
    },
    // 基本路径，默认为空根目录，如果你的项目发布后的地址为目录形式，
    // 即abc.com/tinymce，baseUrl需要配置成tinymce，不然发布后资源会找不到
    disabled: {
      type: Boolean,
      default: false,
    },
    plugins: {
      type: [String, Array],
      default:
        "image link code table lists wordcount media fullscreen preview pagebreak insertdatetime hr paste codesample",
    },
    toolbar: {
      type: [String, Array],
      default: () => toolbar,
    },
    height: String,
  },
  data() {
    return {
      init: {
        language_url: `static/tinymce/langs/zh_CN.js`,
        language: "zh_CN",
        skin_url: `static/tinymce/skins/ui/oxide`,
        content_css: `static/tinymce/skins/content/default/content.css`,
        // skin_url: `/static/tinymce/skins/ui/oxide-dark`, // 暗色系
        // content_css: `/static/tinymce/skins/content/dark/content.css`, // 暗色系
        height: this.height || 300,
        plugins: this.plugins,
        toolbar: this.toolbar,
        branding: false,
        menubar: false,
        // 此处为图片上传处理函数，这个直接用了base64的图片形式上传图片，
        // 如需ajax上传可参考https://www.tiny.cloud/docs/configure/file-image-upload/#images_upload_handler
        images_upload_handler: (blobInfo, success, failure) => {
          const img = "data:image/jpeg;base64," + blobInfo.base64();
          success(img);
        },
      },
      myValue: this.value,
    };
  },
  mounted() {
    tinymce.init({});
  },
  methods: {
    // 添加相关的事件，可用的事件参照文档=> https://github.com/tinymce/tinymce-vue => All available events
    // 需要什么事件可以自己增加
    onClick(e) {
      this.$emit("onClick", e, tinymce);
    },
    // 可以添加一些自己的自定义事件，如清空内容
    clear() {
      this.myValue = "";
    },
  },
  watch: {
    value(newValue) {
      if (!newValue) {
        this.clear();
        return;
      }
      this.myValue = newValue;
    },
    myValue(newValue) {
      this.$emit("input", newValue);
    },
  },
};
</script>

<style lang="scss">
.tox-silver-sink {
  z-index: 3000 !important;
}
</style>
