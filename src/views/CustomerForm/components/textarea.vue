<template>
  <el-input
    type="textarea"
    :rows="3"
    v-model="value.config.value"
    :readonly="disabled"
  />
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
};
</script>
