<template>
  <v-form ref="ruleForm" :fields="fields" :fieldsData="ruleForm"></v-form>
</template>
<script>
import formMinxin from "_c/forms/minxins/formMinxin.js";
import { getXueyuanOptions } from "@/filters/options";

export default {
  mixins: [formMinxin],
  props: {
    patchData: Object,
  },
  data() {
    return {
      ruleForm: {
        zyId: "",
        zyh: "",
        zy: "",
        xyId: "",
        xkml: "",
      },
      xyOpts: [],
    };
  },
  computed: {
    fields() {
      return [
        {
          label: "专业号：",
          placeholder: "请输入专业号",
          span: 12,
          prop: "zyh",
          type: "text",
          rule: [
            {
              required: true,
              message: "请输入专业号",
              trigger: "blur",
            },
          ],
        },
        {
          label: "专业名称：",
          placeholder: "请输入专业名称",
          span: 12,
          prop: "zy",
          type: "text",
          rule: [
            {
              required: true,
              message: "请输入专业名称",
              trigger: "blur",
            },
          ],
        },
        {
          label: this.lang_college + "：",
          placeholder: `请选择${this.lang_college}`,
          span: 12,
          prop: "xyId",
          type: "select",
          options: this.xyOpts,
          rule: [
            {
              required: true,
              message: `请选择${this.lang_college}名称`,
              trigger: "change",
            },
          ],
        },
        {
          label: "学科门类：",
          placeholder: "请输入学科门类",
          span: 12,
          prop: "xkml",
          type: "text",
        },
      ];
    },
  },
  created() {
    getXueyuanOptions().then((data) => {
      this.xyOpts = data;
    });
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
};
</script>
<style lang="scss"></style>
