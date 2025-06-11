<template>
  <viewer
    :options="options"
    :images="imgList"
    @inited="inited"
    class="viewer"
    ref="viewer"
  >
    <template slot-scope="scope">
      <img
        v-show="type == 'image'"
        v-for="src in scope.images"
        :src="src"
        :key="src"
      />
    </template>
  </viewer>
</template>

<script>
import "viewerjs/dist/viewer.css";
import Viewer from "v-viewer";
import Vue from "vue";
import { getImg } from "@/api/file";

Vue.use(Viewer);
export default {
  props: {
    options: Object,
    type: String,
    url: String,
    query: Object,
  },
  data() {
    return {
      imgList: [],
    };
  },
  methods: {
    getImg() {
      if (this.query.fileId) {
        getImg(this.query.fileId).then((data) => {
          this.$set(this, "imgList", [data]);
          this.$viewer.show();
        });
      }
    },
    inited(viewer) {
      this.$viewer = viewer;
    },
    show() {
      setTimeout(() => {
        this.getImg();
      });
    },
    preview(url) {
      this.imgList = [url];
      this.$viewer.show();
    },
  },
};
</script>
<style lang="scss">
.viewer-container {
  z-index: 2158 !important;
}
</style>
