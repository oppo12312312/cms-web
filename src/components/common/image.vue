<template>
  <el-image
    :fit="fit"
    v-loading="loading"
    class="img-wrap"
    :src="imgSrc ? imgSrc : placeholder"
  >
    <div slot="error" style="width: 100%; height: 100%" class="image-slot">
      <img style="width: 100%; height: 100%" :src="placeholder" alt />
    </div>
  </el-image>
</template>

<script>
import { getImg } from "@/api/file";

export default {
  props: {
    placeholder: String,
    fileid: String,
    url: String,
    fit: String,
  },
  data() {
    return {
      imgSrc: "",
      loading: false,
    };
  },
  created() {
    this.init();
  },
  watch: {
    fileid: function (oVal, nVal) {
      if (oVal != nVal) this.init();
    },
    url: function (oVal, nVal) {
      if (oVal != nVal) this.init();
    },
  },
  methods: {
    init() {
      if (this.url) {
        this.loading = true;
        this.imgSrc = this.url;
        this.loading = false;
      } else {
        if (this.fileid) this.loading = true;

        getImg(this.fileid).then((data) => {
          this.imgSrc = data;
          this.loading = false;
        });
      }
    },
  },
};
</script>

<style lang="scss">
.img-wrap {
  height: 100%;
  width: 100%;
  .el-image__inner {
  }
}
</style>
