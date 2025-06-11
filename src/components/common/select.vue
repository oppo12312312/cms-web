<template>
  <div class="select-wraper">
    <el-select
      :class="{ holerTxt: value == '' }"
      v-model="value"
      :placeholder="placeholder"
      @change="optionChange"
    >
      <el-option
        v-for="item in options"
        :key="item.val"
        :label="item.name"
        :value="item.val"
      ></el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  props: {
    options: {
      type: Array,
    },
    placeholder: {
      type: String,
      default: "请选择",
    },
  },
  data() {
    return {
      value: "",
    };
  },
  methods: {
    optionChange(val) {
      this.$emit("optionChange", val);
    },
  },
};
</script>
<style lang="scss">
.select-wraper {
  display: inline-block;
  width: 100%;
  .el-select {
    width: 100%;
  }
  .holerTxt {
    .el-input__inner {
      color: #c0c4cc;
    }
  }
}
</style>
