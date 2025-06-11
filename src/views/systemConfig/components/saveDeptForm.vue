<template>
  <v-form ref="ruleForm" :fields="fields" :fieldsData="ruleForm"></v-form>
</template>
<script>
import formMinxin from "_c/forms/minxins/formMinxin.js";
//import { getCodeOptions } from "@/filters/options";

export default {
  mixins: [formMinxin],
  props: {
    patchData: Object,
  },
  data() {
    return {
      ruleForm: {
        deptid: "",
        deptcode: "",
        deptname: "",
        depttype: "",
        isvalid: "1",
        isjxdw: "1",
        orderno: "",
        lxr: "",
        email: "",
        remark: "",
      },
      fields: [
        {
          label: "单位代码：",
          placeholder: "请输入单位代码",
          span: 12,
          prop: "deptcode",
          type: "text",
          rule: [
            {
              required: true,
              message: "请输入单位代码",
              trigger: "blur",
            },
          ],
        },
        {
          label: "单位名称：",
          placeholder: "请输入单位名称",
          span: 12,
          prop: "deptname",
          type: "text",
          rule: [
            {
              required: true,
              message: "请输入单位名称",
              trigger: "blur",
            },
          ],
        },
        {
          label: "单位类型：",
          placeholder: "请输入单位类型",
          span: 12,
          prop: "depttype",
          type: "text",
        },
        {
          label: "是否使用：",
          placeholder: "是否使用",
          span: 12,
          prop: "isvalid",
          type: "select",
          options: [
            { label: "是", value: "1" },
            { label: "否", value: "0" },
          ],
        },
        {
          label: "是否教学单位：",
          placeholder: "是否教学单位",
          span: 12,
          prop: "isjxdw",
          type: "select",
          options: [
            { label: "是", value: "1" },
            { label: "否", value: "0" },
          ],
        },
        {
          label: "排序号：",
          placeholder: "请输入排序号",
          span: 12,
          prop: "orderno",
          type: "text",
          rule: [
            {
              validator: this.validatorZzs,
              trigger: "blur",
            },
          ],
        },
        {
          label: "联系人：",
          placeholder: "请输入联系人",
          span: 12,
          prop: "lxr",
          type: "text",
        },
        {
          label: "邮箱：",
          placeholder: "请输入邮箱",
          span: 12,
          prop: "email",
          type: "text",
          rule: [
            {
              validator: this.validatorEmail,
              trigger: "blur",
            },
          ],
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
