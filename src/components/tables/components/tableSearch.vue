<template>
  <div class="input-with-search-wrap">
    <el-input
      :placeholder="holderTxt"
      v-model="search"
      @keyup.enter.native="handleChange"
      class="input-with-search"
    >
      <el-button
        :class="searchBtnClass"
        slot="append"
        icon="el-icon-search"
        @click="handleChange"
        >{{ searchTxt }}</el-button
      >
    </el-input>
  </div>
</template>
<script>
export default {
  props: {
    holderTxt: {
      type: String,
      default: "请输入内容",
    },
    searchTxt: {
      type: String,
      default: "搜索",
    },
    searchBtnClass: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      search: "",
    };
  },
  methods: {
    handleChange() {
      this.$emit("inputChange", this.search);
    },
  },
};
</script>
<style lang="scss">
.input-with-search-wrap {
  max-width: 460px;
  display: inline-block;
}
</style>
