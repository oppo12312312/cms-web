<template>
  <v-form
    label-width="140"
    ref="ruleForm"
    :fields="fields"
    :fieldsData="ruleForm"
    v-loading="loading"
  >
  </v-form>
</template>
<script>
import formMinxin from "./minxins/formMinxin.js";
import {
  getRoleTypetOptions,
  getDeptsListOptions,
  getOptTxt,
} from "@/filters/options";

export default {
  mixins: [formMinxin],
  props: {
    patchData: Object,
  },
  data() {
    return {
      loading: true,
      ruleForm: {
        userid: "",
        username: "",
        truename: "",
        deptid: "",
        deptname: "",
        usertype: "",
      },
      deptOpts: [],
    };
  },
  created() {
    this.initForm(this.patchData);
    this.loading = true;
    getDeptsListOptions(true).then((data) => {
      this.deptOpts = data;
      this.loading = false;
    });
  },
  watch: {
    patchData: function () {
      this.initForm(this.patchData);
    },
  },
  computed: {
    fields: function () {
      return [
        {
          label: "用户名：",
          placeholder: "请输入用户名",
          prop: "username",
          type: "text",
          rule: [
            {
              required: true,
              message: "请输入用户名",
              trigger: "blur",
            },
          ],
        },
        {
          label: "姓名：",
          placeholder: "请输入姓名",
          prop: "truename",
          type: "text",
          rule: [
            {
              required: true,
              message: "请输入姓名",
              trigger: "blur",
            },
          ],
        },
        {
          label: "用户类型：",
          placeholder: "请选择用户类型",
          prop: "usertype",
          type: "select",
          options: getRoleTypetOptions(true),
          rule: [
            {
              required: true,
              message: "请选择用户类型",
              trigger: "blur",
            },
          ],
        },
        {
          label: "所在部门：",
          placeholder: "请选择所在部门",
          prop: "deptid",
          type: "select",
          rule: [
            {
              required: true,
              message: "请选择所在部门",
              trigger: "blur",
            },
          ],
          options: this.deptOpts,
          change: (item) => {
            this.ruleForm.deptname = getOptTxt(
              this.deptOpts,
              this.ruleForm.deptid
            );
          },
        },
      ];
    },
  },
};
</script>
<style lang="scss"></style>
