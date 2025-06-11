<template>
  <el-form label-width="120px">
    <el-row :gutter="15">
      <el-col :span="12">
        <el-form-item label="学号：">
          {{ stu.xh || "暂无" }}
        </el-form-item>
        <el-form-item label="性别：">
          {{ stu.xb || "暂无" }}
        </el-form-item>
        <el-form-item label="民族：">
          {{ stu.mz || "暂无" }}
        </el-form-item>
        <el-form-item label="培养层次：">
          {{ stu.pycc || "暂无" }}
        </el-form-item>
        <el-form-item label="校区：">
          {{ stu.xq || "暂无" }}
        </el-form-item>
        <el-form-item label="院系：">
          {{ stu.xy || stu.deptname || "暂无" }}
        </el-form-item>
        <el-form-item label="年级：">
          {{ stu.nj || "暂无" }}
        </el-form-item>
        <el-form-item label="籍贯：">
          {{ stu.jg || "暂无" }}
        </el-form-item>
        <el-form-item label="家庭地址：">
          {{ stu.jtzz || "暂无" }}
        </el-form-item>
        <el-form-item label="电话：">
          {{ stu.lxdh || "暂无" }}
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="姓名：">
          {{ stu.xm || "暂无" }}
        </el-form-item>
        <el-form-item label="出生日期：">
          {{ stu.csrq || "暂无" }}
        </el-form-item>
        <el-form-item label="身份证号：">
          {{ stu.zjhm || "暂无" }}
        </el-form-item>
        <el-form-item label="学生类别：">
          {{ stu.pycc || "暂无" }}
        </el-form-item>
        <el-form-item label="政治面貌：">
          {{ stu.zzmm || "暂无" }}
        </el-form-item>
        <el-form-item label="专业：">
          {{ stu.zy || "暂无" }}
        </el-form-item>
        <el-form-item label="班级：">
          {{ stu.bjmc || "暂无" }}
        </el-form-item>
        <el-form-item label="户口所在地：">
          {{ stu.hkd || "暂无" }}
        </el-form-item>
        <el-form-item label="邮编：">
          {{ stu.yzbm || "暂无" }}
        </el-form-item>
        <el-form-item label="email：">
          {{ stu.email || "暂无" }}
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
<script>
export default {
  props: {
    patchData: Object,
  },
  data() {
    return {
      stu: {},
    };
  },
  created() {
    this.stu = this.patchData;
  },
  watch: {
    patchData: function () {
      this.stu = this.patchData;
    },
  },
  methods: {},
};
</script>
