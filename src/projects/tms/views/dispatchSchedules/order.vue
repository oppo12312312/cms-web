<template>
  <div v-if="data" class="delivery-order-c">
    <div v-for="d in data.slice(0, 2)" :key="d.deliveryOrderNo" class="delivery-order">
      {{ d.deliveryOrderNo }} &nbsp;
      <el-tag v-if="d.status == 7" size="mini" type="warning">待配送</el-tag>
      <el-tag v-if="d.status == 4" size="mini">待收货</el-tag>
      <el-tag v-if="d.status == 5" size="mini" type="success">已收货</el-tag>
    </div>
    <el-tooltip v-if="data && data.length > 2" placement="top" effect="light">
      <div class="delivery-order more-orders">...</div>
      <div slot="content">
        <div class="tooltip-content">
          <div v-for="d in data.slice(2)" :key="d.deliveryOrderNo" class="tooltip-order">
            {{ d.deliveryOrderNo }} &nbsp;
            <el-tag v-if="d.status == 7" size="mini" type="warning">待配送</el-tag>
            <el-tag v-if="d.status == 4" size="mini">待收货</el-tag>
            <el-tag v-if="d.status == 5" size="mini" type="success">已收货</el-tag>
          </div>
        </div>
      </div>
    </el-tooltip>
  </div>
</template>
<script>
export default {
  props: {
    data: Array,
  },
  data() {
    return {};
  },
  created() {},
  watch: {},
};
</script>
<style lang="scss" scoped>
.delivery-order-c {
  .delivery-order {
    margin-top: 4px;
    display: flex;
    align-items: center;
  }
  .delivery-order:first-child {
    margin-top: 0;
  }
  .more-orders {
    color: #409eff;
    cursor: pointer;
    font-weight: bold;
  }
}
.tooltip-content {
  max-height: 500px;
  overflow-y: auto;
  padding-right: 5px;
}
.tooltip-order {
  padding: 4px 0;
  white-space: nowrap;
  display: flex;
  align-items: center;
}
</style>
