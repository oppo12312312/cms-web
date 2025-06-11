<template>
  <div>
    <v-form ref="ruleForm" :fields="fields" :fieldsData="ruleForm"> </v-form>
    <approve-track
      v-if="!isPatch"
      defid="xszbbdef"
      :businessid="patchData.applyid"
      ref="approveTrack"
    ></approve-track>
  </div>
</template>
<script>
import formMinxin from "_c/forms/minxins/formMinxin.js";
import { queryStudentInfoByXh } from "@/api/common";
import { getCodeOptions } from "@/filters/options";
import approveTrack from "_c/approveTrack";

export default {
  mixins: [formMinxin],
  components: {
    approveTrack,
  },
  props: {
    patchData: Object,
    userid: String,
    isDetail: Boolean,
  },
  data() {
    return {
      student: {},
      ruleForm: {
        applyid: "",
        xh: "",
        xyId: "",
        bjid: "",
        jtzz: "",
        bbje: "0",
        blyy: "信息更改不换证",
        ccqsz: "",
        cczdz: "",
        sfxyyhk: "否",
      },
      xszbbOpts: [
        {
          label: "信息更改不换证",
          value: "信息更改不换证",
        },
      ],
    };
  },
  computed: {
    isPatch: function () {
      return !this.patchData.applyid || this.patchData.isPatch;
    },
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
          type: this.isDetail ? "desc" : "text",
          span: 8,
          disabled: true,
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
          type: this.isDetail ? "desc" : "text",
          span: 8,
          disabled: true,
        },
        {
          label: "性别：",
          prop: "xb",
          span: 8,
          type: this.isDetail ? "desc" : "text",
          disabled: true,
        },
        {
          label: this.lang_college + "：",
          prop: "xy",
          type: this.isDetail ? "desc" : "text",
          span: 8,
          disabled: true,
        },
        {
          label: "专业：",
          prop: "zy",
          type: this.isDetail ? "desc" : "text",
          span: 8,
          disabled: true,
        },
        {
          label: "班级：",
          prop: "bjmc",
          type: this.isDetail ? "desc" : "text",
          span: 8,
          disabled: true,
        },
        {
          label: "身份证号：",
          prop: "sfzh",
          type: this.isDetail ? "desc" : "text",
          span: 8,
          disabled: true,
        },
        {
          label: "出生日期：",
          prop: "csrq",
          type: this.isDetail ? "desc" : "text",
          span: 8,
          disabled: true,
        },
        {
          label: "联系电话：",
          prop: "lxdh",
          type: this.isDetail ? "desc" : "text",
          span: 8,
          disabled: true,
        },
        {
          label: "补办信息",
          type: "title",
        },
        {
          label: "现家庭住址：",
          prop: "jtzz",
          labelWidth: "180px",
          type: this.isDetail ? "desc" : "text",
          span: 12,
          disabled: this.isPatch ? false : true,
        },
        {
          label: "补办金额：",
          prop: "bbje",
          type: this.isDetail ? "desc" : "text",
          labelWidth: "180px",
          span: 12,
          disabled: this.isPatch ? false : true,
          rule: [
            { required: true, message: `请输入补办金额`, trigger: "blur" },
            {
              validator: this.validatorCount,
              message: `请输入1-99数字`,
              trigger: "blur",
            },
          ],
        },
        {
          label: "办理原因：",
          labelWidth: "180px",
          prop: "blyy",
          type: this.isDetail ? "desc" : "select",
          span: 12,
          options: this.xszbbOpts,
          disabled: this.isPatch ? false : true,
          rule: [
            { required: true, message: `请选择办理原因`, trigger: "change" },
          ],
        },
        {
          label: "是否需要火车优惠卡：",
          labelWidth: "180px",
          prop: "sfxyyhk",
          type: this.isDetail ? "desc" : "select",
          span: 12,
          disabled: this.isPatch ? false : true,
          options: [
            {
              label: "是",
              value: "是",
            },
            {
              label: "否",
              value: "否",
            },
          ],
        },
        {
          label: "现起点站：",
          prop: "ccqsz",
          type: this.isDetail ? "desc" : "text",
          labelWidth: "180px",
          span: 12,
          disabled: true,
          show: this.ruleForm.sfxyyhk == "是" ? "true" : "false",
        },
        {
          label: "现终点站：",
          labelWidth: "180px",
          prop: "cczdz",
          type: this.isDetail ? "desc" : "text",
          span: 12,
          disabled: this.isPatch ? false : true,
          show: this.ruleForm.sfxyyhk == "是" ? "true" : "false",
        },
      ];
    },
  },
  created() {
    this.init();
    getCodeOptions("XG_xszbb", true).then((data) => {
      this.xszbbOpts = this.xszbbOpts.concat(data);
    });
  },
  watch: {
    patchData: function () {
      this.init();
    },
    "ruleForm.blyy": function (val) {
      if (val == "破损换证" || val == "信息更改不换证") {
        this.ruleForm.bbje = 0;
      } else {
        this.ruleForm.bbje = 10;
      }
    },
  },
  methods: {
    init() {
      queryStudentInfoByXh(this.userid).then((data) => {
        if (data.data.xh) {
          this.ruleForm.xh = data.data.xh;
          this.ruleForm.xm = data.data.xm;
          this.ruleForm.xyId = data.data.xyId;
          this.ruleForm.bjid = data.data.bjid;
          this.ruleForm.xy = data.data.xy;
          this.ruleForm.zy = data.data.zy;
          this.ruleForm.xb = data.data.xb;
          this.ruleForm.jg = data.data.jg;
          this.ruleForm.bjmc = data.data.bjmc;
          this.ruleForm.sfzh = data.data.sfzh;
          this.ruleForm.csrq = data.data.csrq;
          this.ruleForm.lxdh = data.data.lxdh;
          this.ruleForm.jtzz = data.data.jtzz;
          this.ruleForm.ccqsz = data.data.ccqsz;
          this.ruleForm.cczdz = data.data.cczdz;
          this.initForm(this.patchData);
        } else {
          this.toast("无该学生信息", "warning");
          this.ruleForm.xh = "";
          return;
        }
      });
    },
    validatorCount(rule, value, callback) {
      const reg = /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/;
      if (value) {
        if (reg.test(value) == false) {
          callback(new Error("请填写大于0的数字"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    },
    getBaseinfo(val) {
      queryStudentInfoByXh(this.userid).then((data) => {
        if (data.data.xh) {
          this.ruleForm.xh = data.data.xh;
          this.ruleForm.xm = data.data.xm;
          this.ruleForm.xy = data.data.xy;
          this.ruleForm.zy = data.data.zy;
          this.ruleForm.xb = data.data.xb;
          this.ruleForm.jg = data.data.jg;
          this.ruleForm.bjmc = data.data.bjmc;
          this.ruleForm.sfzh = data.data.sfzh;
          this.ruleForm.csrq = data.data.csrq;
          this.ruleForm.lxdh = data.data.lxdh;
          this.ruleForm.jtzz = data.data.jtzz;
          this.ruleForm.ccqsz = data.data.ccqsz;
          this.ruleForm.cczdz = data.data.cczdz;
        } else {
          this.toast("无该学生信息", "warning");
          this.ruleForm.xh = "";
          return;
        }
      });
    },
    getSteps() {
      return this.$refs.approveTrack.getSteps();
    },
  },
};
</script>
<style lang="scss">
.set-form {
  .el-checkbox {
    margin-right: 5px;
  }
}
</style>
