<template>
  <div class="tableFiltersWrap">
    <slot></slot>
  </div>
</template>
<script>
export default {};
</script>
<style lang="scss">
.tableFiltersWrap {
  background: #fff;
  margin-bottom: 8px;
  padding: 12px 16px 4px 16px;
  .el-col {
    margin-bottom: 15px;
    .el-date-editor.el-input {
      width: 100%;
    }
  }
}
</style>
