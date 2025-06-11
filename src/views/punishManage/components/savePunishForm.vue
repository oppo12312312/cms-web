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
import { getOptTxt, getCodeOptions } from "@/filters/options";

export default {
  mixins: [formMinxin],
  props: {
    patchData: Object,
    punishData: Array,
    removeData: String,
    activeData: String,
  },
  data() {
    return {
      disabled: this.removeData == "false" ? false : true,
      xhDisabled: this.patchData.id && this.patchData.id != "" ? true : false,
      ruleForm: {
        id: "",
        studentId: "",
        cfzt: "1",
        xh: "",
        xm: "",
        xb: "",
        xy: "",
        zy: "",
        bjmc: "",
        nj: "",
        cfwh: "",
        cfyj: "",
        cfjb: "",
        cfjbdm: "",
        cfkssj: "",
        cfjssj: "",
        cfsx: "",
        cfyy: "",
        bz: "",
        sqjcsj: "",
        sqjcyy: "",
      },
      xbOpts: [],
      mzOpts: [],
      jgOpts: [],
      fdyOpts: [],
    };
  },
  computed: {
    fields: function () {
      const fields = [
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
          disabled: this.xhDisabled,
        },
        {
          label: "姓名：",
          prop: "xm",
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
          label: this.lang_college + "：",
          prop: "xy",
          type: "text",
          span: 12,
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
          label: "班级：",
          prop: "bjmc",
          span: 12,
          type: "text",
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
          label: "违纪处分情况",
          type: "title",
        },
        {
          label: "处分文号：",
          placeholder: "输入处分文号",
          prop: "cfwh",
          type: "text",
          span: 12,
          rule: [
            {
              required: true,
              message: "输入处分文号",
              trigger: "blur",
            },
          ],
          disabled: this.disabled,
        },
        {
          label: "违纪原因：",
          placeholder: "选择违纪原因",
          prop: "cfyj",
          type: "select",
          span: 12,
          options: [
            { label: "违纪", value: "违纪" },
            { label: "考试舞弊", value: "考试舞弊" },
          ],
          disabled: this.disabled,
        },
        {
          label: "处分类型：",
          placeholder: "选择处分类型",
          prop: "cfjbdm",
          type: "select",
          span: 12,
          options: this.punishData,
          rule: [
            {
              required: true,
              message: "选择处分类型",
              trigger: "blur",
            },
          ],
          disabled: this.disabled,
        },
        {
          label: "处分开始时间：",
          placeholder: "选择处分开始时间",
          prop: "cfkssj",
          type: "date",
          dType: "date",
          format: "yyyy-MM-dd",
          formate: "yyyy-MM-dd",
          span: 12,
          disabled: this.disabled,
        },
        {
          label: "处分结束时间：",
          placeholder: "选择处分结束时间",
          prop: "cfjssj",
          type: "date",
          dType: "date",
          format: "yyyy-MM-dd",
          formate: "yyyy-MM-dd",
          span: 12,
          disabled: this.disabled,
        },
        {
          label: "处分期限：",
          placeholder: "输入处分期限",
          prop: "cfsx",
          type: "text",
          span: 12,
          disabled: this.disabled,
        },
        {
          label: "处分原因：",
          placeholder: "输入处分原因",
          prop: "cfyy",
          type: "textarea",
          span: 24,
          rule: [
            {
              required: true,
              message: "输入处分原因",
              trigger: "blur",
            },
          ],
          disabled: this.disabled,
        },
        {
          label: "备注：",
          placeholder: "输入备注",
          prop: "bz",
          type: "textarea",
          span: 24,
          disabled: this.disabled,
        },
        {
          label: "处分解除",
          type: "title",
          show: (this.activeData == "2").toString(),
        },
      ];
      if (this.activeData == "2") {
        fields.push(
          {
            label: "解除时间：",
            placeholder: "选择解除时间",
            prop: "sqjcsj",
            type: "date",
            dType: "date",
            format: "yyyy-MM-dd",
            formate: "yyyy-MM-dd",
            span: 12,
            rule: [
              {
                required: true,
                message: "选择解除时间",
                trigger: "blur",
              },
            ],
          },
          {
            label: "解除原因：",
            placeholder: "输入解除原因",
            prop: "sqjcyy",
            type: "textarea",
            span: 24,
            rule: [
              {
                required: true,
                message: "输入解除原因",
                trigger: "blur",
              },
            ],
          }
        );
      }
      return fields;
    },
  },
  watch: {
    patchData: function () {
      this.initForm(this.patchData);
    },
    "ruleForm.cfjbdm": function () {
      this.ruleForm.cfjb = getOptTxt(this.punishData, this.ruleForm.cfjbdm);
    },
  },
  created() {
    //this.getOptions("wjyy", "60002");
    this.initForm(this.patchData);
  },
  methods: {
    getBaseinfo(val) {
      if (val && val != "") {
        queryStudentInfoByXh(val).then((data) => {
          if (data.data.xh) {
            this.ruleForm.xm = data.data.xm;
            this.ruleForm.studentId = data.data.studentId;
            this.ruleForm.xb = data.data.xb;
            this.ruleForm.xy = data.data.xy;
            this.ruleForm.zy = data.data.zy;
            this.ruleForm.bjmc = data.data.bjmc;
            this.ruleForm.nj = data.data.nj;
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
