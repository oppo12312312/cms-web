<template>
  <v-form ref="ruleForm" :fields="fields" :fieldsData="ruleForm"></v-form>
</template>
<script>
import { queryStudentInfoByXh } from "@/api/common";
import { getCodeOptions } from "@/filters/options";
import formMinxin from "_c/forms/minxins/formMinxin.js";
export default {
  mixins: [formMinxin],
  props: {
    patchData: Object,
  },
  data() {
    const me = this;
    return {
      student: {},
      ruleForm: {
        id: "",
        xh: "",
        xm: "",
        xy: "",
        bjmc: "",
        zxf: "",
        kscj: "",
        xn: "",
        pjjd: "",
        xq: "",
        pm: "",
        bjrs: "",
        zypm: "",
        zyrs: "",
      },
      fields: [
        {
          label: "学号：",
          placeholder: "请输入学号",
          span: 12,
          prop: "xh",
          type: "text",
          rule: [
            {
              required: true,
              message: "请输入学号",
              trigger: "blur",
            },
          ],
          change() {
            me.xhChange(me.ruleForm.xh);
          },
        },
        {
          label: this.lang_college + "：",
          placeholder: `请输入${this.lang_college}`,
          span: 12,
          prop: "xy",
          type: "text",
          disabled: true,
        },
        {
          label: "年级：",
          placeholder: "请输入年级",
          span: 12,
          prop: "nj",
          type: "text",
          disabled: true,
        },
        {
          label: "姓名：",
          placeholder: "请输入姓名",
          span: 12,
          prop: "xm",
          type: "text",
          disabled: true,
        },
        {
          label: "班级：",
          placeholder: "请输入班级",
          span: 12,
          prop: "bjmc",
          type: "text",
          disabled: true,
        },
        {
          label: "学期：",
          placeholder: "请输入学期",
          span: 12,
          prop: "xq",
          type: "select",
          rule: [
            {
              required: true,
              message: "请输入学期",
              trigger: "blur",
            },
          ],
          options: [
            {
              label: "第一学期",
              value: "第一学期",
            },
            {
              label: "第二学期",
              value: "第二学期",
            },
          ],
        },

        {
          label: "总学分：",
          placeholder: "请输入总学分",
          span: 12,
          prop: "zxf",
          type: "text",
          rule: [
            {
              required: true,
              message: "请输入总学分",
              trigger: "blur",
            },
          ],
        },
        {
          label: "学年：",
          placeholder: "请输入学年",
          span: 12,
          prop: "xn",
          type: "date",
          dType: "year",
          format: "yyyy",
          formate: "yyyy",
          rule: [
            {
              required: true,
              message: "请输入学年",
              trigger: "blur",
            },
          ],
        },
        {
          label: "平均绩点：",
          placeholder: "请输入平均绩点",
          span: 12,
          prop: "pjjd",
          type: "text",
          rule: [
            {
              required: true,
              message: "请输入平均绩点",
              trigger: "blur",
            },
          ],
        },
        {
          label: "班级排名：",
          placeholder: "请输入班级排名",
          span: 12,
          prop: "pm",
          type: "text",
          rule: [
            {
              required: true,
              message: "请输入班级排名",
              trigger: "blur",
            },
          ],
        },
        {
          label: "班级人数：",
          placeholder: "请输入班级人数",
          span: 12,
          prop: "bjrs",
          type: "text",
          rule: [
            {
              required: true,
              message: "请输入班级人数",
              trigger: "blur",
            },
          ],
        },
        {
          label: "专业排名：",
          placeholder: "请输入专业排名",
          span: 12,
          prop: "zypm",
          type: "text",
          rule: [
            {
              required: true,
              message: "请输入专业排名",
              trigger: "blur",
            },
          ],
        },
        {
          label: "专业人数：",
          placeholder: "请输入专业人数",
          span: 12,
          prop: "zyrs",
          type: "text",
          rule: [
            {
              required: true,
              message: "请输入专业人数",
              trigger: "blur",
            },
          ],
        },
      ],
      lxOpts: [],
      rules: {
        qjlx: [{ required: true, message: `请选择请假类型`, trigger: "blur" }],
      },
      steps: [],
    };
  },
  computed: {
    isPatch() {
      return this.patchData.xh;
    },
  },
  created() {
    if (this.isPatch) {
      queryStudentInfoByXh(this.patchData.xh).then((data) => {
        this.init(data.data);
      });
    }
  },
  watch: {
    patchData: function () {
      this.init();
    },
  },
  methods: {
    xhChange(val) {
      queryStudentInfoByXh(val).then((data) => {
        this.init(data.data);
      });
    },
    init(stu) {
      this.initForm(this.patchData);
      if (stu) {
        this.ruleForm.xm = stu.xm;
        this.ruleForm.xy = stu.xy;
        this.ruleForm.nj = stu.nj;
        this.ruleForm.bjmc = stu.bjmc;
      }
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
