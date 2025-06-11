<template>
  <div class="w1h1">
    <keep-alive :include="['czTargetList', 'classManage']">
      <router-view></router-view>
    </keep-alive>
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
    .el-form-item {
      margin-bottom: 10px;
    }
  }
}
</style>
