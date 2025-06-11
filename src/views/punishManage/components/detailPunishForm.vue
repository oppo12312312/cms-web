<template>
  <div v-loading="isLoading">
    <el-form size="mini" label-width="auto">
      <el-row :gutter="15">
        <el-col>
          <el-form-item label="学生信息" class="title"></el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="学号：">{{
            patchData.xh ? patchData.xh : "暂无"
          }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="姓名：">{{
            patchData.xm ? patchData.xm : "暂无"
          }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="性别：">{{
            patchData.xb ? patchData.xb : "暂无"
          }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="lang_college + '：'">{{
            patchData.xy ? patchData.xy : "暂无"
          }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="专业：">{{
            patchData.zy ? patchData.zy : "暂无"
          }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="班级：">{{
            patchData.bjmc ? patchData.bjmc : "暂无"
          }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="年级：">{{
            patchData.nj ? patchData.nj : "暂无"
          }}</el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="处分信息" class="title"></el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="处分文号：">{{
            patchData.cfwh ? patchData.cfwh : "暂无"
          }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="违纪原因：">{{
            patchData.cfyj ? patchData.cfyj : "暂无"
          }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="处分类型：">{{
            patchData.cfjb ? patchData.cfjb : "暂无"
          }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="处分开始时间：">{{
            patchData.cfkssj ? patchData.cfkssj : "暂无"
          }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="处分结束时间：">{{
            patchData.cfjssj ? patchData.cfjssj : "暂无"
          }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="处分期限：">{{
            patchData.cfsx ? patchData.cfsx : "暂无"
          }}</el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="处分原因：">{{
            patchData.cfyy ? patchData.cfyy : "暂无"
          }}</el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注：">{{
            patchData.bz ? patchData.bz : "暂无"
          }}</el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="typeData == '2'">
        <el-col>
          <el-form-item label="处分解除信息" class="title"></el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="解除日期：">{{
            patchData.sqjcsj ? patchData.sqjcsj : "暂无"
          }}</el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="解除原因：">{{
            patchData.sqjcyy ? patchData.sqjcyy : "暂无"
          }}</el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import formMinxin from "_c/forms/minxins/formMinxin.js";
import { getOptTxt, getCodeOptions2 } from "@/filters/options";

export default {
  mixins: [formMinxin],
  props: {
    patchData: Object,
    punishData: Array,
    typeData: String,
    isLoading: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {};
  },
  created() {},
  watch: {},
  methods: {},
};
</script>
<style lang="scss">
.title {
  .el-form-item__label {
    color: #24386a;
    font-weight: bold;
  }
}
</style>
