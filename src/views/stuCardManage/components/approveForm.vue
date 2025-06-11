<template>
  <el-form
    size="medium"
    :model="ruleForm"
    status-icon
    ref="ruleForm"
    :rules="rules"
    label-width="auto"
  >
    <save-card-form
      :is-detail="true"
      ref="saveCardForm"
      :patch-data="patchData"
      :userid="patchData.xh"
      v-if="patchData.status != 3"
    ></save-card-form>
    <el-card
      v-if="patchData.status == 1 || patchData.status == 3"
      class="box-card fn-mt15"
      shadow="never"
    >
      <div slot="header" class="clearfix">
        <span class="tle">审核意见</span>
      </div>
      <el-form-item label="审核意见：" prop="spyj">
        <el-input
          type="textarea"
          @keyup.enter.native="keyUpSubmit"
          v-model="ruleForm.spyj"
          autocomplete="off"
          placeholder="请输入"
        ></el-input>
      </el-form-item>
    </el-card>
    <basic-table
      v-if="patchData.status == 3"
      :columns="columns"
      :props-data="patchData.tableData"
      :muti="false"
      ref="basicTable"
    >
    </basic-table>
  </el-form>
</template>
<script>
import { queryStudentInfoByXh } from "@/api/common";
import formMinxin from "_c/forms/minxins/formMinxin.js";
import saveCardForm from "./saveCardForm";
import basicTable from "_c/tables";

export default {
  mixins: [formMinxin],
  components: {
    saveCardForm,
    basicTable,
  },
  props: {
    patchData: Object,
  },
  data() {
    return {
      student: {},
      columns: [
        {
          label: "学号",
          prop: "xh",
        },
        {
          label: "姓名",
          prop: "xm",
        },
        {
          label: this.lang_college,
          prop: "xy",
        },
        {
          label: "班级",
          prop: "bjmc",
        },
        {
          label: "联系电话",
          prop: "lxdh",
        },
        {
          label: "办理原因",
          prop: "blyy",
        },
      ],
      ruleForm: {
        spyj: "",
      },
      rules: {
        spyj: [{ required: true, message: `请输入审核意见`, trigger: "blur" }],
      },
    };
  },
  created() {
    if (this.patchData.status != 3) {
      queryStudentInfoByXh(this.patchData.xh).then((data) => {
        this.student = data.data;
      });
    }
  },
  methods: {
    getSteps() {
      return this.$refs.saveCardForm.getSteps();
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
