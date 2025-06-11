<template>
  <div class="app-page" :class="{ 'with-left': hasLeft }">
    <div class="page-left">
      <slot name="left" />
    </div>

    <div class="page-main">
      <slot name="top" />
      <div class="page-container">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    hasLeft: Boolean,
  },
};
</script>

<style lang="scss" scoped>
.app-page {
  display: flex;
  min-height: calc(100vh - 115px);

  &.with-left {
    .page-left {
      width: 280px;
      padding-right: 15px;
      .el-card {
        height: 100%;
      }
    }
  }

  .page-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    .page-container {
      flex: 1;

      display: flex;
      flex-direction: column;
    }
  }
}
</style>
