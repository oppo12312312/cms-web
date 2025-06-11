<template>
  <v-form ref="ruleForm" :fields="fields" :fieldsData="ruleForm"></v-form>
  <!-- <el-form
    size="medium"
    :model="ruleForm"
    status-icon
    ref="ruleForm"
    :rules="rules"
    label-width="auto"
  >
    <el-row :gutter="15" class="set-form">
      <el-col :span="12">
        <el-form-item label="学号：">
          <el-input
            type="text"
            @keyup.enter.native="keyUpSubmit"
            v-model="ruleForm.xh"
            autocomplete="off"
            placeholder="请输入"
            @change="xhChange"
          ></el-input>
        </el-form-item>
        <el-form-item label="姓名：">{{ student.xm || "暂无" }}</el-form-item>
        <el-form-item label="性别：">
          el
        </el-form-item>
        <el-form-item label="年级：">
          <el-date-picker
            v-model="ruleForm.nj"
            format="yyyy"
            type="year"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="学年：">
          <el-date-picker
            v-model="ruleForm.xn"
            format="yyyy"
            type="year"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="学期：" prop="xq">
          <el-input
            type="text"
            @keyup.enter.native="keyUpSubmit"
            v-model="ruleForm.xq"
            autocomplete="off"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="lang_college + '：'">
          {{ student.xy || "暂无" }}
        </el-form-item>
        <el-form-item label="班级：">
          {{ student.bjmc || "暂无" }}
        </el-form-item>
        <el-form-item label="课程名称：" prop="kcmc">
          <el-input
            type="text"
            @keyup.enter.native="keyUpSubmit"
            v-model="ruleForm.kcmc"
            autocomplete="off"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="学分：" prop="xf">
          <el-input
            type="text"
            @keyup.enter.native="keyUpSubmit"
            v-model="ruleForm.xf"
            autocomplete="off"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="考试成绩：" prop="kscj">
          <el-input
            type="text"
            @keyup.enter.native="keyUpSubmit"
            v-model="ruleForm.kscj"
            autocomplete="off"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="绩点：" prop="jd">
          <el-input
            type="text"
            @keyup.enter.native="keyUpSubmit"
            v-model="ruleForm.jd"
            autocomplete="off"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form> -->
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
        nj: "",
        bjmc: "",
        xf: "",
        kscj: "",
        xn: "",
        jd: "",
        xq: "",
        kcmc: "",
        kclb: "",
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
          label: "课程类别：",
          placeholder: "请选择课程类别",
          span: 12,
          prop: "kclb",
          type: "select",
          options: [
            {
              label: "必修",
              value: "必修",
            },
            {
              label: "选修",
              value: "选修",
            },
          ],
        },
        {
          label: "课程名称：",
          placeholder: "请输入课程名称",
          span: 12,
          prop: "kcmc",
          type: "text",
          rule: [
            {
              required: true,
              message: "请输入课程名称",
              trigger: "blur",
            },
          ],
        },
        {
          label: "学分：",
          placeholder: "请输入学分",
          span: 12,
          prop: "xf",
          type: "text",
          rule: [
            {
              required: true,
              message: "请输入学分",
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
          label: "考试成绩：",
          placeholder: "请输入考试成绩",
          span: 12,
          prop: "kscj",
          type: "text",
          rule: [
            {
              required: true,
              message: "请输入考试成绩",
              trigger: "blur",
            },
          ],
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
          label: "绩点：",
          placeholder: "请输入绩点",
          span: 12,
          prop: "jd",
          type: "text",
          rule: [
            {
              required: true,
              message: "请输入绩点",
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
