<template>
  <el-form
    size="medium"
    :model="ruleForm"
    status-icon
    ref="ruleForm"
    label-width="auto"
  >
    <el-form-item
      label="请假类型："
      prop="codekindname"
      :rules="rules.itemName"
    >
      <el-input
        type="text"
        @keyup.enter.native="keyUpSubmit"
        v-model="ruleForm.codekindname"
        autocomplete="off"
        placeholder="请输入字段名称"
      ></el-input>
    </el-form-item>
  </el-form>
</template>
<script>
import formMinxin from "./minxins/formMinxin";

export default {
  props: {
    patchData: Object,
  },
  mixins: [formMinxin],
  data() {
    return {
      id: "",
      ruleForm: {},
      rules: {
        itemName: [
          { required: true, message: `请输入选项名称`, trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.initForm(this.patchData);
  },
  watch: {
    patchData: function () {
      this.initForm(this.patchData);
    },
  },
  methods: {
    init() {},
  },
};
</script>
<style lang="scss"></style>
