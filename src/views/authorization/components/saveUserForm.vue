<template>
  <v-form label-width="140" ref="ruleForm" :fields="fields" :fieldsData="ruleForm">
  </v-form>
</template>
<script>
import formMinxin from "_c/forms/minxins/formMinxin.js";
// import { queryDeptlist } from "#/api/public";
import { listRole } from "@/api/sysRole";

export default {
  mixins: [formMinxin],
  props: {
    patchData: Object,
  },
  data() {
    return {
      ruleForm: {
        userid: "",
        username: "",
        truename: "",
        gx: "",
        qywx: "",
        deptid: "",
        deptname: "",
        xb: "",
        zw: "",
        officeTel: "",
        tel: "",
        qq: "",
        roleId: "",
        roleList: [],
        tag: "",
      },
      deptOpts: [],
      roleOpts: [],
    };
  },
  created() {
    this.initForm(this.patchData);
    // queryDeptlist({ pageSize: 1000 }).then((res)=>{
    //   this.deptOpts = res.data.map(d => ({ label: d.deptName, value: d.deptId }));
    // });
    listRole({ pageSize: 1000 }).then((res) => {
      this.roleOpts = res.data.map((d) => ({ label: d.name, value: d.roleid }));
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
          label: "账号名：",
          placeholder: "请输入账号名",
          prop: "username",
          type: "text",
          maxlength: "32",
          rule: [
            {
              required: true,
              message: "请输入账号名",
              trigger: "blur",
            },
          ],
        },
        {
          label: "真实姓名：",
          placeholder: "请输入真实姓名",
          prop: "truename",
          type: "text",
          maxlength: "32",
          rule: [
            {
              required: true,
              message: "请输入真实姓名",
              trigger: "blur",
            },
          ],
        },
        // {
        //   label: "工号：",
        //   placeholder: "请输入工号",
        //   prop: "gx",
        //   type: "text",
        //   maxlength: '32',
        //   rule: [
        //     {
        //       required: true,
        //       message: "请输入工号",
        //       trigger: "blur",
        //     },
        //   ],
        // },
        // {
        //   label: "企业微信号：",
        //   placeholder: "请输入企业微信号",
        //   prop: "qywx",
        //   type: "text",
        //   maxlength: '32',
        // },
        {
          label: "性别：",
          placeholder: "请选择性别",
          prop: "xb",
          type: "select",
          rule: [
            {
              required: true,
              message: "请选择性别",
              trigger: "blur",
            },
          ],
          options: [
            { label: "男", value: "男" },
            { label: "女", value: "女" },
          ],
        },
        // {
        //   label: "所属单位：",
        //   placeholder: "请选择所属单位",
        //   prop: "deptid",
        //   type: "select",
        //   rule: [
        //     {
        //       required: true,
        //       message: "请选择所属单位",
        //       trigger: "blur",
        //     },
        //   ],
        //   options: this.deptOpts,
        //   change: () => {
        //     this.ruleForm.deptname = this.deptOpts.find(d => d.value == this.ruleForm.deptid)?.label;
        //   }
        // },
        // {
        //   label: "职称/职务：",
        //   placeholder: "请输入职称/职务",
        //   prop: "zw",
        //   type: "text",
        //   maxlength: '32',
        // },
        // {
        //   label: "办公电话：",
        //   placeholder: "请输入办公电话",
        //   prop: "officeTel",
        //   type: "text",
        //   maxlength: '20',
        // },
        {
          label: "手机号码：",
          placeholder: "请输入手机号码",
          prop: "tel",
          type: "text",
          maxlength: "11",
        },
        // {
        //   label: "QQ号：",
        //   placeholder: "请输入QQ号",
        //   prop: "qq",
        //   type: "text",
        //   maxlength: '11',
        // },
        {
          label: "角色：",
          placeholder: "请选择角色",
          prop: "roleId",
          type: "select",
          rule: [
            {
              required: true,
              message: "请选择角色",
              trigger: "blur",
            },
          ],
          options: this.roleOpts,
          multiple: true,
          change: () => {},
        },
        // {
        //   label: "标签：",
        //   placeholder: "请输入标签",
        //   prop: "tag",
        //   type: "text",
        //   maxlength: '32',
        // }
      ];
    },
  },
};
</script>
<style lang="scss"></style>
