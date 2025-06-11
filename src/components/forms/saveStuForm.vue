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
import { campusOptions } from "@/projects/hbmu-suguan/filters/options";

const optsArr = [
  "xbOpts",
  "pyccOpts",
  "xjOpts",
  "zzmmOpts",
  "mzOpts",
  "zjlxOpts",
  "hklxOpts",
  "kslbOpts",
  "lqlxOpts",
  "xjztOpts",
];
import { mapGetters, mapActions } from "vuex";

export default {
  mixins: [formMinxin],
  props: {
    patchData: Object,
    type: String,
  },
  data() {
    return {
      loading: false,
      ruleForm: {
        infoId: "",
        infoType: this.type,
        xh: "",
        xm: "",
        xb: "",
        csrq: "",
        sfzh: "",
        pycc: "",
        mz: "",
        kslb: "",
        xq: "",
        zzmm: "",
        nj: "",
        jg: "",
        hkd: "",
        jtzzyb: "",
        jtzz: "",
        lxdh: "",
        email: "",
        xy: "",
        xyId: "",
        zyId: "",
        zy: "",
        bjid: "",
        bjmc: "",
      },
      campusOpts: [],
    };
  },
  created() {
    this.initForm(this.patchData);
    this.getOpts(optsArr);
    campusOptions().then((data) => {
      this.campusOpts = data;
    });
  },
  watch: {
    patchData: function () {
      this.initForm(this.patchData);
    },
  },
  computed: {
    ...mapGetters(optsArr),
    fields: function () {
      return [
        {
          label: "学号：",
          placeholder: "请输入学号",
          prop: "xh",
          type: "text",
          span: 12,
          rule: [
            {
              required: true,
              message: "请输入学号",
              trigger: "blur",
            },
          ],
        },
        {
          label: "姓名：",
          placeholder: "请输入姓名",
          prop: "xm",
          span: 12,
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
          label: "性别：",
          placeholder: "请输入性别",
          prop: "xb",
          span: 12,
          type: "select",
          options: this.xbOpts,
          rule: [
            {
              required: false,
              message: "请选择性别",
              trigger: "blur",
            },
          ],
        },
        {
          label: "出生日期：",
          placeholder: "请输入出生日期",
          prop: "csrq",
          span: 12,
          type: "date",
          rule: [
            {
              required: false,
              message: "请选择出生日期",
              trigger: "blur",
            },
          ],
        },
        {
          label: "民族：",
          placeholder: "请选择民族",
          prop: "mz",
          span: 12,
          type: "select",
          options: this.mzOpts,
          rule: [
            {
              required: false,
              message: "请选择民族",
              trigger: "blur",
            },
          ],
        },
        {
          label: "身份证号：",
          placeholder: "请输入身份证号",
          prop: "sfzh",
          span: 12,
          type: "text",
          rule: [
            {
              required: false,
              message: "请输入身份证号",
              trigger: "blur",
            },
          ],
        },
        {
          label: "培养层次：",
          placeholder: "请选择培养层次",
          prop: "pycc",
          span: 12,
          type: "select",
          options: this.pyccOpts,
          rule: [
            {
              required: false,
              message: "请选择培养层次",
              trigger: "blur",
            },
          ],
        },
        {
          label: "学生类别：",
          placeholder: "请选择学生类别",
          prop: "kslb",
          span: 12,
          type: "select",
          options: this.kslbOpts,
          rule: [
            {
              required: false,
              message: "请选择学生类别",
              trigger: "blur",
            },
          ],
        },
        {
          label: "校区：",
          placeholder: "请选择校区",
          prop: "xq",
          span: 12,
          type: "select",
          options: this.campusOpts,
          rule: [
            {
              required: false,
              message: "请选择校区",
              trigger: "blur",
            },
          ],
        },
        {
          label: "政治面貌：",
          placeholder: "请选择政治面貌",
          prop: "zzmm",
          span: 12,
          type: "select",
          options: this.zzmmOpts,
          rule: [
            {
              required: false,
              message: "请选择政治面貌",
              trigger: "blur",
            },
          ],
        },
        {
          label: "年级：",
          placeholder: "请选择年级",
          prop: "nj",
          span: 12,
          type: "date",
          dType: "year",
          format: "yyyy",
          formate: "yyyy",
        },
        {
          label: this.lang_college + "：",
          layout: ["xy"],
          span: 12,
          type: "xyzybj",
          gutter: 0,
          xyId: this.ruleForm.xyId,
        },
        {
          label: "专业：",
          layout: ["zy"],
          span: 12,
          type: "xyzybj",
          gutter: 0,
          xyId: this.ruleForm.xyId,
          zyId: this.ruleForm.zyId,
        },
        {
          label: "班级：",
          layout: ["bj"],
          span: 12,
          type: "xyzybj",
          gutter: 0,
          xyId: this.ruleForm.xyId,
          zyId: this.ruleForm.zyId,
          bjid: this.ruleForm.bjid,
          njs: this.ruleForm.nj,
        },
        {
          label: "籍贯：",
          placeholder: "请输入籍贯",
          prop: "jg",
          span: 12,
          type: "text",
          rule: [
            {
              required: false,
              message: "请输入籍贯",
              trigger: "blur",
            },
          ],
        },
        {
          label: "户口所在地：",
          placeholder: "请输入户口所在地",
          prop: "hkd",
          span: 12,
          type: "text",
          rule: [
            {
              required: false,
              message: "请输入户口所在地",
              trigger: "blur",
            },
          ],
        },
        {
          label: "家庭住址：",
          placeholder: "请输入家庭住址",
          prop: "jtzz",
          span: 12,
          type: "text",
          rule: [
            {
              required: false,
              message: "请输入家庭住址",
              trigger: "blur",
            },
          ],
        },
        {
          label: "邮政编码：",
          placeholder: "请输入邮政编码",
          prop: "jtzzyb",
          span: 12,
          type: "text",
          rule: [
            {
              required: false,
              message: "请输入邮政编码",
              trigger: "blur",
            },
          ],
        },
        {
          label: "电话：",
          placeholder: "请输入电话",
          prop: "lxdh",
          span: 12,
          type: "text",
          rule: [
            {
              required: false,
              message: "请输入电话",
              trigger: "blur",
            },
          ],
        },
        {
          label: "email：",
          placeholder: "请输入email",
          prop: "email",
          span: 12,
          type: "text",
          rule: [
            {
              required: false,
              message: "请输入email",
              trigger: "blur",
            },
          ],
        },
      ];
    },
  },
  methods: {
    ...mapActions(["getOpts"]),
  },
};
</script>
<style lang="scss"></style>
