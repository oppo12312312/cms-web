<template>
  <v-form
    label-width="120"
    ref="ruleForm"
    :fields="fields"
    :fieldsData="ruleForm"
  ></v-form>
</template>
<script>
import formMinxin from "_c/forms/minxins/formMinxin.js";
import { getCodeOptions } from "@/filters/options";

export default {
  mixins: [formMinxin],
  props: {
    patchData: Object,
    deptData: Array,
  },
  data() {
    return {
      notEdit: false,
      ruleForm: {
        bgdd: "",
        bgsdh: "",
        bkxx: "",
        bkzy: "",
        bsxx: "",
        bszy: "",
        csfdygzsj: "",
        csny: "",
        cym: "",
        departId: "",
        dsjl: "",
        email: "",
        fdygz: "",
        gatqw: "",
        ghkh: "",
        gwlx: "",
        gzdd: "",
        gzkh: "",
        gzry: "",
        gzzh: "",
        hyzk: "",
        infoid: "",
        isvalid: "",
        jg: "",
        jgArr: [],
        jszw: "",
        kt: "",
        lw: "",
        mz: "",
        rdny: "",
        sfzhm: "",
        sj: "",
        sjly: "",
        ssfh: "",
        ssxx: "",
        sszy: "",
        studentId: "",
        sznj: "",
        tposition: "",
        wxh: "",
        xb: "",
        xipx: "",
        xm: "",
        xq: "",
        xzz: "",
        zgh: "",
        zgxl: "",
        zgxw: "",
        zhkh: "",
        zjxy: "",
        zp: "",
        zsdh: "",
        zwjb: "",
        zwmc: "",
        zzmm: "",
      },
      xbOpts: [],
      mzOpts: [],
      zgxlOpts: [],
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
          label: "姓名：",
          placeholder: "请输入姓名",
          prop: "xm",
          type: "text",
          span: 8,
          disabled: this.notEdit,
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
          placeholder: "请选择性别",
          prop: "xb",
          options: this.xbOpts,
          span: 8,
          type: "select",
          disabled: this.notEdit,
          rule: [
            {
              required: true,
              message: "请输入性别",
              trigger: "blur",
            },
          ],
        },
        {
          label: "民族：",
          placeholder: "请选择民族",
          prop: "mz",
          span: 8,
          type: "select",
          options: this.mzOpts,
          rule: [
            {
              required: true,
              message: "请输入民族",
              trigger: "blur",
            },
          ],
        },
        {
          label: "出生日期：",
          placeholder: "请选择出生日期",
          prop: "csny",
          type: "date",
          dType: "date",
          format: "yyyy-MM-dd",
          formate: "yyyy-MM-dd",
          span: 8,
          rule: [
            {
              required: true,
              message: "请选择出生日期",
              trigger: "blur",
            },
          ],
        },
        {
          label: "入党日期：",
          placeholder: "请选择入党日期",
          prop: "rdny",
          type: "date",
          dType: "date",
          format: "yyyy-MM-dd",
          formate: "yyyy-MM-dd",
          span: 8,
          rule: [
            {
              required: false,
              message: "请选择入党日期",
              trigger: "blur",
            },
          ],
        },
        {
          label: "籍贯：",
          placeholder: "请选择籍贯",
          prop: "jgArr",
          span: 8,
          type: "cascader",
          optProps: {
            lazy: true,
            lazyLoad(node, resolve) {
              const { level } = node;
              if (level == 0) {
                getCodeOptions("20004").then((data) => {
                  const nodes = [];
                  for (let i = 0; i < data.length; i++) {
                    nodes.push({
                      label: data[i].label,
                      value: data[i].label,
                      did: data[i].value,
                    });
                  }
                  resolve(nodes);
                });
              } else {
                getCodeOptions(node.data.did).then((data) => {
                  const nodes = [];
                  for (let i = 0; i < data.length; i++) {
                    nodes.push({
                      label: data[i].label,
                      value: data[i].label,
                      did: data[i].value,
                      leaf: true,
                    });
                  }
                  resolve(nodes);
                });
              }
            },
          },
          rule: [
            {
              required: false,
              message: "请选择籍贯",
              trigger: "blur",
            },
          ],
        },
        {
          label: "报到日期：",
          placeholder: "请选择报到日期",
          prop: "csfdygzsj",
          type: "date",
          dtype: "date",
          format: "yyyy-MM-dd",
          formate: "yyyy-MM-dd",
          span: 8,
          rule: [
            {
              required: false,
              message: "请选择报到日期",
              trigger: "blur",
            },
          ],
        },
        {
          label: "工号/学号：",
          placeholder: "请输入工号/学号",
          prop: "zgh",
          type: "text",
          span: 8,
          disabled: this.notEdit,
          rule: [
            {
              required: true,
              message: "请输入工号/学号",
              trigger: "blur",
            },
          ],
        },
        {
          label: "所属单位：",
          prop: "departId",
          span: 8,
          type: "selectDialog",
          disabled: this.notEdit,
          placeholder: "请选择所属单位",
          empty: "暂时没有部门",
          selectData: this.deptData,
        },
        {
          label: "电话号码：",
          placeholder: "请输入电话号码",
          prop: "sj",
          type: "text",
          span: 8,
          rule: [
            {
              required: true,
              message: "请输入电话号码",
              trigger: "blur",
            },
          ],
        },
        /*  {
          label: "微信：",
          placeholder: "请输入微信",
          prop: "wxh",
          type: "text",
          span: 8,
          rule: [
            {
              required: false,
              message: "请输入微信",
              trigger: "blur",
            },
          ],
        },
        {
          label: "宿舍房号：",
          placeholder: "请输入宿舍房号",
          prop: "ssfh",
          type: "text",
          span: 8,
          rule: [
            {
              required: false,
              message: "请输入宿舍房号",
              trigger: "blur",
            },
          ],
        }, */
        {
          label: "辅导员类型：",
          placeholder: "请选择辅导员类型",
          prop: "gwlx",
          type: "select",
          span: 8,
          options: this.fdyOpts,
          rule: [
            {
              required: false,
              message: "请输入辅导员类型",
              trigger: "blur",
            },
          ],
        },
        {
          label: "教育背景",
          type: "title",
        },
        {
          label: "最高学历：",
          placeholder: "请选择最高学历",
          prop: "zgxl",
          type: "select",
          span: 8,
          options: this.zgxlOpts,
          rule: [
            {
              required: false,
              message: "请选择最高学历",
              trigger: "blur",
            },
          ],
        },
        {
          label: "最高学位：",
          placeholder: "请输入最高学位",
          prop: "zgxw",
          type: "text",
          span: 8,
          rule: [
            {
              required: false,
              message: "请输入最高学位",
              trigger: "blur",
            },
          ],
        },
        {
          label: "本科毕业学校：",
          placeholder: "请输入本科毕业学校",
          prop: "bkxx",
          type: "text",
          span: 8,
          rule: [
            {
              required: false,
              message: "请输入本科毕业学校",
              trigger: "blur",
            },
          ],
        },
        {
          label: "本科专业：",
          placeholder: "请输入本科专业",
          prop: "bkzy",
          type: "text",
          span: 8,
          rule: [
            {
              required: false,
              message: "请输入本科专业",
              trigger: "blur",
            },
          ],
        },
        {
          label: "硕士毕业学校：",
          placeholder: "请输入硕士毕业学校",
          prop: "ssxx",
          type: "text",
          span: 8,
          rule: [
            {
              required: false,
              message: "请输入硕士毕业学校",
              trigger: "blur",
            },
          ],
        },
        {
          label: "硕士专业：",
          placeholder: "请输入硕士专业",
          prop: "sszy",
          type: "text",
          span: 8,
          rule: [
            {
              required: false,
              message: "请输入硕士专业",
              trigger: "blur",
            },
          ],
        },
        {
          label: "博士毕业学校：",
          placeholder: "请输入博士毕业学校",
          prop: "bsxx",
          type: "text",
          span: 8,
          rule: [
            {
              required: false,
              message: "请输入博士毕业学校",
              trigger: "blur",
            },
          ],
        },
        {
          label: "博士专业：",
          placeholder: "请输入博士专业",
          prop: "bszy",
          type: "text",
          span: 8,
          rule: [
            {
              required: false,
              message: "请输入博士专业",
              trigger: "blur",
            },
          ],
        },
      ];
    },
  },
  watch: {
    patchData: function () {
      this.initForm(this.patchData);
      if (this.patchData.jg) {
        this.ruleForm.jgArr = this.patchData.jg.split("/");
      }
    },
    "ruleForm.jgArr": function () {
      this.ruleForm.jg = this.copy(this.ruleForm.jgArr).join("/");
    },
  },
  created() {
    if (this.userInfo.activeRole == "fdy") {
      this.notEdit = true;
    } else {
      this.notEdit = false;
    }
    this.getOptions("xb", "20001");
    this.getOptions("mz", "20002");
    this.getOptions("fdy", "90090");
    this.getOptions("zgxl", "50074");
    this.initForm(this.patchData);
    if (this.patchData.jg) {
      this.ruleForm.jgArr = this.patchData.jg.split("/");
    }
  },
  methods: {
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
