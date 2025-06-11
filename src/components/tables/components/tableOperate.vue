<template>
  <div class="tableBtnWrap" :style="{ width: width }">
    <el-button
      v-if="btn.isShow"
      type="text"
      size="mini"
      v-for="(btn, index) in operateList"
      :key="index"
      @click="btn.method(rowData)"
    >
      <span :title="btn.title" class="iconBtn">
        <img :src="btn.url" />
      </span>
    </el-button>
  </div>
</template>
<script>
export default {
  props: {
    operateList: Array,
    rowData: Object,
    width: String,
  },
  data() {
    return {};
  },
  methods: {},
};
</script>
<style lang="scss">
.tableBtnWrap {
  margin-left: -7px;
  .el-button + .el-button {
    margin-left: 0;
  }
}
</style>
