<template>
  <v-form ref="ruleForm" :fields="fields" :fieldsData="ruleForm"></v-form>
</template>
<script>
import formMinxin from "./minxins/formMinxin";

export default {
  mixins: [formMinxin],
  props: {
    patchData: Object,
  },
  data() {
    return {
      ruleForm: {
        dmid: "",
        dmcode: "",
        dmname: "",
        orderno: "",
        fullname: "",
        remark: "",
        parentid: this.patchData.dmid || this.$route.meta.submodel,
        trancode: "",
        isvalid: "1",
      },
      fields: [
        {
          label: "字典代码：",
          placeholder: "请输入字典代码",
          span: 12,
          prop: "dmcode",
          type: "text",
          rule: [
            {
              required: true,
              message: "请输入字典代码",
              trigger: "blur",
            },
          ],
        },
        {
          label: "排序：",
          placeholder: "请输入排序",
          span: 12,
          prop: "orderno",
          type: "text",
          rule: [
            {
              required: true,
              message: "请输入排序",
              trigger: "blur",
            },
            {
              validator: this.validatorZzs,
              message: "请输入正确排序",
              trigger: "blur",
            },
          ],
        },
        {
          label: "代码名称：",
          placeholder: "请输入代码名称",
          span: 12,
          prop: "dmname",
          type: "text",
          rule: [
            {
              required: true,
              message: "请输入代码名称",
              trigger: "blur",
            },
          ],
        },
        {
          label: "全名：",
          placeholder: "请输入代码全名",
          span: 12,
          prop: "fullname",
          type: "text",
        },
        {
          label: "是否有效：",
          placeholder: "是否有效",
          span: 12,
          prop: "isvalid",
          type: "select",
          options: [
            { label: "有效", value: "1" },
            { label: "无效", value: "0" },
          ],
        },
        {
          label: "转码：",
          placeholder: "请输入转码",
          span: 12,
          prop: "trancode",
          type: "text",
        },
        {
          label: "备注：",
          placeholder: "请输入备注",
          prop: "remark",
          type: "textarea",
        },
      ],
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
};
</script>
<style lang="scss"></style>
