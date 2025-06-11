<template>
  <v-form
    label-width="150"
    ref="ruleForm"
    :fields="fields"
    :fieldsData="ruleForm"
  ></v-form>
</template>
<script>
import formMinxin from "_c/forms/minxins/formMinxin.js";
import { queryStudentInfoByXh } from "@/api/common";
import { getCodeOptions } from "@/filters/options";

export default {
  mixins: [formMinxin],
  props: {
    patchData: Object,
    deptData: Array,
  },
  data() {
    return {
      ruleForm: {
        applyid: "",
        xh: "",
        xm: "",
        xy: "",
        zy: "",
        xb: "",
        nj: "",
        bjmc: "",
        dkyh: "",
        nd: "",
        hth: "",
        hzjym: "",
        jhdkje: "",
        dkje: "",
        dkyt: "",
        yhlxr: "",
        yhlxdh: "",
        ddjyjlxr: "",
        ddjyjlxdh: "",
        blzmsj: "",
        bz: "",
        files: [],
      },
      xbOpts: [],
      mzOpts: [],
      jgOpts: [],
      fdyOpts: [],
    };
  },
  computed: {
    fields: function () {
      return [
        {
          label: "基本信息",
          type: "title",
        },
        {
          label: "学号：",
          placeholder: "输入学号",
          prop: "xh",
          type: "text",
          span: 12,
          blur: (val) => {
            this.getBaseinfo(val);
          },
          rule: [
            {
              required: true,
              message: "输入学号",
              trigger: "blur",
            },
          ],
        },
        {
          label: "姓名：",
          prop: "xm",
          type: "text",
          span: 12,
          disabled: true,
        },
        {
          label: this.lang_college + "：",
          prop: "xy",
          type: "text",
          span: 12,
          disabled: true,
        },
        {
          label: "性别：",
          prop: "xb",
          span: 12,
          type: "text",
          disabled: true,
        },
        {
          label: "专业：",
          prop: "zy",
          type: "text",
          span: 12,
          disabled: true,
        },
        {
          label: "年级：",
          prop: "nj",
          type: "text",
          span: 12,
          disabled: true,
        },
        {
          label: "班级：",
          prop: "bjmc",
          span: 12,
          type: "text",
          disabled: true,
        },
        {
          label: "贷款信息",
          type: "title",
        },
        {
          label: "贷款银行：",
          placeholder: "输入贷款银行",
          prop: "dkyh",
          type: "text",
          span: 12,
        },
        {
          label: "贷款年度：",
          placeholder: "选择贷款年度",
          prop: "nd",
          type: "date",
          dType: "year",
          format: "yyyy",
          formate: "yyyy",
          span: 12,
          rule: [
            {
              required: true,
              message: "选择贷款年度",
              trigger: "blur",
            },
          ],
        },
        {
          label: "合同号：",
          placeholder: "输入合同号",
          prop: "hth",
          type: "text",
          span: 12,
          rule: [
            {
              required: false,
              message: "输入合同号",
              trigger: "blur",
            },
          ],
        },
        {
          label: "回执校验码：",
          placeholder: "输入回执校验码",
          prop: "hzjym",
          type: "text",
          span: 12,
          rule: [
            {
              required: false,
              message: "输入回执校验码",
              trigger: "blur",
            },
          ],
        },
        /* {
          label: "图片：",
          prop: "files",
          type: "image",
          //url: "/xgFile/previewFile",
          //oFid: this.files.fileId,
          fileList: [],
          files: [],
          limit: {
            type: "img",
            size: 2 * 1024 * 1024,
            accept: ["gif", "jpg", "jpeg", "png"],
          },
          tip: "图片大小不能超过2MB",
        }, */
        {
          label: "计划贷款金额：",
          placeholder: "输入计划贷款金额",
          prop: "jhdkje",
          type: "number",
          span: 12,
          rule: [
            {
              required: false,
              message: "输入计划贷款金额",
              trigger: "blur",
            },
          ],
        },
        {
          label: "贷款金额：",
          placeholder: "输入贷款金额",
          prop: "dkje",
          type: "number",
          span: 12,
          rule: [
            {
              required: false,
              message: "输入贷款金额",
              trigger: "blur",
            },
          ],
        },
        {
          label: "贷款用途：",
          placeholder: "输入贷款用途",
          prop: "dkyt",
          type: "text",
          span: 12,
        },
        {
          label: "银行联系人：",
          placeholder: "输入银行联系人",
          prop: "yhlxr",
          type: "text",
          span: 12,
        },
        {
          label: "银行联系电话：",
          placeholder: "输入银行联系电话",
          prop: "yhlxdh",
          type: "text",
          span: 12,
          rule: [
            {
              required: false,
              validator: this.validatorLxdh,
              message: "输入正确的电话",
              trigger: "blur",
            },
          ],
        },
        {
          label: "当地教育局联系人：",
          placeholder: "输入当地教育局联系人",
          prop: "ddjyjlxr",
          type: "text",
          span: 12,
        },
        {
          label: "当地教育局联系电话：",
          placeholder: "输入当地教育局联系电话",
          prop: "ddjyjlxdh",
          type: "text",
          span: 12,
          rule: [
            {
              required: false,
              validator: this.validatorLxdh,
              message: "输入正确的电话",
              trigger: "blur",
            },
          ],
        },
        {
          label: "办理证明时间：",
          placeholder: "选择办理证明时间",
          prop: "blzmsj",
          type: "date",
          dType: "date",
          format: "yyyy-MM-dd",
          formate: "yyyy-MM-dd",
          span: 12,
        },
        {
          label: "备注：",
          placeholder: "输入备注",
          prop: "bz",
          type: "textarea",
          span: 24,
        },
      ];
    },
  },
  watch: {
    patchData: function () {
      this.initForm(this.patchData);
    },
  },
  created() {
    this.getOptions("xb", "20001");
    this.initForm(this.patchData);
  },
  methods: {
    getBaseinfo(val) {
      if (val && val != "") {
        queryStudentInfoByXh(val).then((data) => {
          if (data.data.xh) {
            this.ruleForm = this.copy(data.data);
          } else {
            this.toast("无该学生信息", "warning");
            this.ruleForm.xh = "";
            return;
          }
        });
      }
    },
    getOptions(type, code) {
      if (!this[type + "Opts"].length) {
        getCodeOptions(code, {
          label: "dmname",
          value: "dmname",
        }).then((data) => {
          this[type + "Opts"] = data;
        });
      }
    },
  },
};
</script>
<style lang="scss"></style>
