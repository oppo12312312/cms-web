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
        xb: "",
        nj: "",
        bjmc: "",
        zy: "",
        sfzhm: "",
        csrq: "",
        gj: "",
        rxnf: "",
        xz: "",
        byny: "",
        sqbh: "",
        nd: "",
        khxm: "",
        jycd: "",
        hyzk: "",
        ywzn: "",
        bdjznx: "",
        szxy: "",
        dyxnje: "",
        dexnje: "",
        dsxnje: "",
        jzdz: "",
        zzdhqh: "",
        zzdh: "",
        sjh: "",
        grshysr: "",
        dwdhqh: "",
        dwdh: "",
        sxje: "",
        dkqx: "",
        fkje: "",
        kkzh: "",
        gzdwkhbm: "",
        sszy: "",
        xxmc: "",
        xxszdbm: "",
        xxdz: "",
        fdyxm: "",
        jzrxm: "",
        sfzyxq: "",
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
          label: "身份证号码：",
          prop: "sfzhm",
          span: 12,
          type: "text",
          disabled: true,
        },
        {
          label: "出生日期：",
          prop: "csrq",
          type: "text",
          span: 12,
          disabled: true,
        },
        {
          label: "国籍：",
          prop: "gj",
          span: 12,
          type: "text",
          rule: [
            {
              required: true,
              message: "输入国籍",
              trigger: "blur",
            },
          ],
        },
        {
          label: "入学年份：",
          prop: "rxnf",
          type: "text",
          span: 12,
          disabled: true,
        },
        {
          label: "学制：",
          prop: "xz",
          span: 12,
          type: "text",
          disabled: true,
        },
        {
          label: "毕业年月：",
          prop: "byny",
          type: "date",
          dType: "month",
          format: "yyyy-MM",
          formate: "yyyyMM",
          span: 12,
          rule: [
            {
              required: true,
              message: "选择毕业年月",
              trigger: "blur",
            },
          ],
        },
        {
          label: "贷款信息",
          type: "title",
        },
        {
          label: "申请编号：",
          placeholder: "输入申请编号",
          prop: "sqbh",
          type: "text",
          span: 12,
          rule: [
            {
              required: true,
              message: "输入申请编号",
              trigger: "blur",
            },
          ],
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
          label: "客户姓名：",
          placeholder: "输入客户姓名",
          prop: "khxm",
          type: "text",
          span: 12,
          rule: [
            {
              required: true,
              message: "输入客户姓名",
              trigger: "blur",
            },
          ],
        },
        {
          label: "教育程度：",
          placeholder: "输入教育程度",
          prop: "jycd",
          type: "text",
          span: 12,
          rule: [
            {
              required: true,
              message: "输入教育程度",
              trigger: "blur",
            },
          ],
        },
        {
          label: "婚姻状况：",
          placeholder: "输入婚姻状况",
          prop: "hyzk",
          type: "text",
          span: 12,
          rule: [
            {
              required: true,
              message: "输入婚姻状况",
              trigger: "blur",
            },
          ],
        },
        {
          label: "有无子女：",
          placeholder: "输入有无子女",
          prop: "ywzn",
          type: "text",
          span: 12,
          rule: [
            {
              required: true,
              message: "输入有无子女",
              trigger: "blur",
            },
          ],
        },
        {
          label: "本地居住年限：",
          placeholder: "输入本地居住年限",
          prop: "bdjznx",
          type: "text",
          span: 12,
          rule: [
            {
              required: true,
              message: "输入本地居住年限",
              trigger: "blur",
            },
          ],
        },
        {
          label: `所在${this.lang_college}：`,
          placeholder: `输入所在${this.lang_college}`,
          prop: "szxy",
          type: "text",
          span: 12,
          rule: [
            {
              required: true,
              message: `输入所在${this.lang_college}`,
              trigger: "blur",
            },
          ],
        },
        {
          label: "第一学年发放金额：",
          placeholder: "输入第一学年发放金额",
          prop: "dyxnje",
          type: "text",
          span: 12,
          rule: [
            {
              required: true,
              message: "输入第一学年发放金额",
              trigger: "blur",
            },
          ],
        },
        {
          label: "第二学年发放金额：",
          placeholder: "输入第二学年发放金额",
          prop: "dexnje",
          type: "text",
          span: 12,
          rule: [
            {
              required: true,
              message: "输入第二学年发放金额",
              trigger: "blur",
            },
          ],
        },
        {
          label: "第三学年发放金额：",
          placeholder: "输入第三学年发放金额",
          prop: "dsxnje",
          type: "text",
          span: 12,
          rule: [
            {
              required: true,
              message: "输入第三学年发放金额",
              trigger: "blur",
            },
          ],
        },
        {
          label: "居住地址：",
          placeholder: "输入居住地址",
          prop: "jzdz",
          type: "text",
          span: 12,
          rule: [
            {
              required: true,
              message: "输入居住地址",
              trigger: "blur",
            },
          ],
        },
        {
          label: "住宅电话区号：",
          placeholder: "输入住宅电话区号",
          prop: "zzdhqh",
          type: "text",
          span: 12,
          rule: [
            {
              required: true,
              message: "输入住宅电话区号",
              trigger: "blur",
            },
          ],
        },
        {
          label: "住宅电话：",
          placeholder: "输入住宅电话",
          prop: "zzdh",
          type: "text",
          span: 12,
          rule: [
            {
              required: true,
              validator: this.validatorLxdh,
              message: "输入住宅电话",
              trigger: "blur",
            },
          ],
        },
        {
          label: "手机号码：",
          placeholder: "输入手机号码",
          prop: "sjh",
          type: "text",
          span: 12,
          rule: [
            {
              required: true,
              validator: this.validatorSjh,
              message: "输入手机号码",
              trigger: "blur",
            },
          ],
        },
        {
          label: "个人税后月收入：",
          placeholder: "输入个人税后月收入",
          prop: "grshysr",
          type: "text",
          span: 12,
        },
        {
          label: "单位电话区号：",
          placeholder: "输入单位电话区号",
          prop: "dwdhqh",
          type: "text",
          span: 12,
        },
        {
          label: "单位电话：",
          placeholder: "输入单位电话",
          prop: "dwdh",
          type: "text",
          span: 12,
          rule: [
            {
              required: false,
              validator: this.validatorLxdh,
              message: "输入单位电话",
              trigger: "blur",
            },
          ],
        },
        {
          label: "授信金额：",
          placeholder: "输入授信金额",
          prop: "sxje",
          type: "number",
          span: 12,
          rule: [
            {
              required: true,
              message: "输入授信金额",
              trigger: "blur",
            },
          ],
        },
        {
          label: "贷款期限：",
          placeholder: "输入贷款期限",
          prop: "dkqx",
          type: "text",
          span: 12,
        },
        {
          label: "放款金额：",
          placeholder: "输入放款金额",
          prop: "fkje",
          type: "number",
          span: 12,
          rule: [
            {
              required: true,
              message: "输入放款金额",
              trigger: "blur",
            },
          ],
        },
        {
          label: "转账账号：",
          placeholder: "输入转账账号",
          prop: "zzzh",
          type: "text",
          span: 12,
        },
        {
          label: "扣款账号：",
          placeholder: "输入扣款账号",
          prop: "kkzh",
          type: "text",
          span: 12,
          rule: [
            {
              required: true,
              message: "输入扣款账号",
              trigger: "blur",
            },
          ],
        },
        {
          label: "工作单位客户编码：",
          placeholder: "输入工作单位客户编码",
          prop: "gzdwkhbm",
          type: "text",
          span: 12,
        },
        {
          label: "学校名称：",
          placeholder: "输入学校名称",
          prop: "xxmc",
          type: "text",
          span: 12,
        },
        {
          label: "学校所在地行政区划编码：",
          placeholder: "输入学校所在地行政区划编码",
          prop: "bkzy",
          type: "text",
          span: 12,
        },
        {
          label: "学校地址：",
          placeholder: "输入学校地址",
          prop: "xxszdbm",
          type: "text",
          span: 12,
        },
        {
          label: "辅导员姓名：",
          placeholder: "输入辅导员姓名",
          prop: "fdyxm",
          type: "text",
          span: 12,
          rule: [
            {
              required: true,
              message: "输入辅导员姓名",
              trigger: "blur",
            },
          ],
        },
        {
          label: "见证人姓名：",
          placeholder: "输入见证人姓名",
          prop: "jzrxm",
          type: "text",
          span: 12,
          rule: [
            {
              required: true,
              message: "输入见证人姓名",
              trigger: "blur",
            },
          ],
        },
        {
          label: "身份证有效期：",
          placeholder: "输入身份证有效期",
          prop: "sfzyxq",
          type: "text",
          span: 12,
          rule: [
            {
              required: true,
              message: "输入身份证有效期",
              trigger: "blur",
            },
          ],
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
            this.ruleForm.szxy = this.ruleForm.xy;
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
