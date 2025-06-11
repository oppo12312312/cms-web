<template>
  <div>
    <!-- <el-card shadow="never" v-for="(pf, index) in propsFiles" :key="index">
      <div slot="header" class="clearfix">
        {{ pf.label }}
      </div>
      <file-list
        :props-files="pf.files"
        url="/xfFile/previewFile"
        down-url="/xfFile/download"
      ></file-list>
    </el-card> -->
    <file-list
      v-for="(pf, index) in propsFiles"
      :key="index"
      :props-files="pf.files"
      url="/pFile/downFile"
      down-url="/pFile/downFile"
    ></file-list>
    <el-card shadow="never" v-if="isEmptyObject(propsFiles)">
      <!-- <div slot="header" class="clearfix">附件</div> -->
      <div>暂无附件</div>
    </el-card>
  </div>
</template>
<script>
import fileList from "_c/fileList";
import { fjflOptions, getOptTxt } from "@/filters/options";

export default {
  props: {
    files: Array,
  },
  components: {
    fileList,
  },
  data() {
    return {
      propsFiles: {},
    };
  },
  created() {
    this.init(this.files);
  },
  watch: {
    patchData: function () {
      this.init(this.files);
    },
  },
  methods: {
    init(files) {
      const me = this;
      this.fjflOptions = fjflOptions();
      if (files.length) {
        for (const f of files) {
          if (this.propsFiles.hasOwnProperty(f.status)) {
            this.propsFiles[f.status].files.unshift(f);
          } else {
            this.propsFiles[f.status] = {
              label: getOptTxt(me.fjflOptions, f.status),
              status: f.status,
              files: [f],
            };
          }
        }
      }
    },
  },
};
</script>
<style lang="scss"></style>
