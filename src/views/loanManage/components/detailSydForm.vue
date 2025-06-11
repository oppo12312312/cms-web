<template>
  <div>
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
          <el-form-item :label="lang_college + '：'">{{
            patchData.xy ? patchData.xy : "暂无"
          }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="班级：">{{
            patchData.bjmc ? patchData.bjmc : "暂无"
          }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="专业：">{{
            patchData.zy ? patchData.zy : "暂无"
          }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="年级：">{{
            patchData.nj ? patchData.nj : "暂无"
          }}</el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="贷款信息" class="title"></el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="贷款年度：">{{
            patchData.nd ? patchData.nd : "暂无"
          }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="回执校验码：">{{
            patchData.hzjym ? patchData.hzjym : "暂无"
          }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="贷款银行：">{{
            patchData.dkyh ? patchData.dkyh : "暂无"
          }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="合同号：">{{
            patchData.hth ? patchData.hth : "暂无"
          }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="计划贷款金额：">{{
            patchData.jhdkje ? patchData.jhdkje : "暂无"
          }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="贷款金额：">{{
            patchData.dkje ? patchData.dkje : "暂无"
          }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="银行联系人：">{{
            patchData.yhlxr ? patchData.yhlxr : "暂无"
          }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="银行联系电话：">{{
            patchData.yhlxdh ? patchData.yhlxdh : "暂无"
          }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="当地教育局联系人：">{{
            patchData.ddjyjlxr ? patchData.ddjyjlxr : "暂无"
          }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="当地教育局联系电话：">{{
            patchData.ddjyjlxdh ? patchData.ddjyjlxdh : "暂无"
          }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="办理证明时间：">{{
            patchData.blzmsj ? patchData.blzmsj : "暂无"
          }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="贷款用途：">{{
            patchData.dkyt ? patchData.dkyt : "暂无"
          }}</el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注：">{{
            patchData.bz ? patchData.bz : "暂无"
          }}</el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import formMinxin from "_c/forms/minxins/formMinxin.js";

export default {
  mixins: [formMinxin],
  props: {
    patchData: Object,
  },
  data() {
    return {
      ruleForm: {},
    };
  },
  created() {
    this.initForm(this.patchData);
  },
  watch: {
    patchData: function () {
      this.initForm(this.patchData);
    },
  },
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
