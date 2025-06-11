<template>
  <el-button type="text" size="middle" @click="prview">预览</el-button>
</template>

<script>
import { getPdf } from "@/api/file";

export default {
  props: {
    url: {
      type: String,
      default: "http://image.cache.timepack.cn/nodejs.pdf",
    },
    query: {
      type: Object,
    },
  },
  data() {
    return {
      loading: false,
    };
  },
  methods: {
    prview() {
      console.log(this.query);
      getPdf(this.query.fileId).then((url) => {
        const path =
          process.env.NODE_ENV === "production"
            ? "/xinfang/static/pdfh5/pdf.html"
            : "/static/pdfh5/pdf.html";
        window.open(path + "?file=" + encodeURIComponent(url));
      });
    },
  },
};
</script>
<style lang="less"></style>
