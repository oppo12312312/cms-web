<template>
  <el-checkbox-group
    v-model="value.config.value"
    :class="{ readonly: disabled }"
  >
    <el-checkbox :label="opt.value" v-for="opt in options" :key="opt.value">{{
      opt.label
    }}</el-checkbox>
  </el-checkbox-group>
</template>
<script>
export default {
  props: {
    value: {
      type: Object,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    options() {
      return this.value?.config?.options || [];
    },
  },
};
</script>
<style lang="scss" scoped>
.readonly {
  position: relative;
  z-index: 1;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    opacity: 0;
    z-index: 2;
  }
}
</style>
