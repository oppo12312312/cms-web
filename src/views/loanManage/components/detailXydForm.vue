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
          <el-form-item label="性别：">{{
            patchData.xb ? patchData.xb : "暂无"
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
        <el-col :span="12">
          <el-form-item label="班级：">{{
            patchData.bjmc ? patchData.bjmc : "暂无"
          }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="身份证号码：">{{
            patchData.sfzhm ? patchData.sfzhm : "暂无"
          }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="出生日期：">{{
            patchData.csrq ? patchData.csrq : "暂无"
          }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="国籍：">{{
            patchData.gj ? patchData.gj : "暂无"
          }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="入学年份：">{{
            patchData.rxnf ? patchData.rxnf : "暂无"
          }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="学制：">{{
            patchData.xz ? patchData.xz : "暂无"
          }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="毕业日期：">{{
            patchData.byny ? patchData.byny : "暂无"
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
          <el-form-item label="申请编号：">{{
            patchData.sqbh ? patchData.sqbh : "暂无"
          }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="客户姓名：">{{
            patchData.khxm ? patchData.khxm : "暂无"
          }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="教育程度：">{{
            patchData.jycd ? patchData.jycd : "暂无"
          }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="婚姻状况：">{{
            patchData.hyzk ? patchData.hyzk : "暂无"
          }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="有无子女：">{{
            patchData.ywzn ? patchData.ywzn : "暂无"
          }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="本地居住年限：">{{
            patchData.bdjznx ? patchData.bdjznx : "暂无"
          }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="`所在${lang_college}：`">{{
            patchData.szxy ? patchData.szxy : "暂无"
          }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="第一学年发放金额：">{{
            patchData.dyxnje ? patchData.dyxnje : "暂无"
          }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="第二学年发放金额：">{{
            patchData.dexnje ? patchData.dexnje : "暂无"
          }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="第三学年发放金额：">{{
            patchData.dsxnje ? patchData.dsxnje : "暂无"
          }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="居住地址：">{{
            patchData.jzdz ? patchData.jzdz : "暂无"
          }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="住宅电话区号：">{{
            patchData.zzdhqh ? patchData.zzdhqh : "暂无"
          }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="住宅电话：">{{
            patchData.zzdh ? patchData.zzdh : "暂无"
          }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手机号码：">{{
            patchData.sjh ? patchData.sjh : "暂无"
          }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="个人税后月收入：">{{
            patchData.grshysr ? patchData.grshysr : "暂无"
          }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="单位电话区号：">{{
            patchData.dwdhqh ? patchData.dwdhqh : "暂无"
          }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="单位电话：">{{
            patchData.dwdh ? patchData.dwdh : "暂无"
          }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="授信金额：">{{
            patchData.sxje ? patchData.sxje : "暂无"
          }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="贷款期限：">{{
            patchData.dkqx ? patchData.dkqx : "暂无"
          }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="放款金额：">{{
            patchData.fkje ? patchData.fkje : "暂无"
          }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="转账账号：">{{
            patchData.zzzh ? patchData.zzzh : "暂无"
          }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="扣款账号：">{{
            patchData.kkzh ? patchData.kkzh : "暂无"
          }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="工作单位客户编码：">{{
            patchData.gzdwkhbm ? patchData.gzdwkhbm : "暂无"
          }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="学校名称：">{{
            patchData.xxmc ? patchData.xxmc : "暂无"
          }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="学校所在地行政区划编码：">{{
            patchData.xxszdbm ? patchData.xxszdbm : "暂无"
          }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="学校地址：">{{
            patchData.xxdz ? patchData.xxdz : "暂无"
          }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="辅导员姓名：">{{
            patchData.fdyxm ? patchData.fdyxm : "暂无"
          }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="见证人姓名：">{{
            patchData.jzrxm ? patchData.jzrxm : "暂无"
          }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="身份证有效期：">{{
            patchData.sfzyxq ? patchData.sfzyxq : "暂无"
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
