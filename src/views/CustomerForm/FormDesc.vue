<template>
  <v-form
    label-width="100"
    ref="ruleForm"
    label-position="top"
    :fields="fields"
    :fieldsData="ruleForm"
    :options="options"
  ></v-form>
</template>
<script>
import formMinxin from "_c/forms/minxins/formMinxin.js";

export default {
  mixins: [formMinxin],
  props: {
    patchData: Object,
  },
  data() {
    return {
      ruleForm: {
        title: "",
        remark: "",
      },
      options: {
        size: "small",
      },
    };
  },
  computed: {
    fields() {
      return [
        {
          label: "标题：",
          placeholder: "请输入标题",
          prop: "title",
          type: "text",
          rule: [
            {
              required: true,
              message: "请输入标题",
              trigger: "blur",
            },
          ],
          blur: () => this.change(),
        },
        {
          label: "描述：",
          placeholder: "请输入描述",
          prop: "remark",
          type: "textarea",
          rows: 3,
          blur: () => this.change(),
        },
      ];
    },
  },
  watch: {
    patchData: {
      handler() {
        this.initForm(this.patchData);
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    change() {
      this.$emit("change", this.ruleForm);
    },
  },
};
</script>
<style lang="scss"></style>
