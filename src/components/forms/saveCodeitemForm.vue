<template>
  <el-form
    size="medium"
    :model="ruleForm"
    status-icon
    :rules="rules"
    ref="ruleForm"
    label-width="auto"
  >
    <el-row gutter="15">
      <el-col :span="12">
        <el-form-item label="代码分类ID" prop="codekindid">
          <el-input
            type="text"
            placeholder="请输入代码分类ID"
            @keyup.enter.native="keyUpSubmit"
            v-model="ruleForm.codekindid"
            autocomplete="off"
            :disabled="true"
          ></el-input>
        </el-form-item>

        <el-form-item label="代码ID" prop="codeitemid">
          <el-input
            type="text"
            placeholder="请输入代码ID"
            @keyup.enter.native="keyUpSubmit"
            v-model.number="ruleForm.codeitemid"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="代码名称" prop="codeitemname">
          <el-input
            type="text"
            placeholder="请输入代码名称"
            @keyup.enter.native="keyUpSubmit"
            v-model.number="ruleForm.codeitemname"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="是否使用" prop="isvalid">
          <el-select v-model="ruleForm.isvalid" placeholder="是否使用">
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="转换代码" prop="trancode">
          <el-input
            type="text"
            placeholder="请输入转换代码"
            @keyup.enter.native="keyUpSubmit"
            v-model="ruleForm.trancode"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            type="text"
            placeholder="请输入备注"
            @keyup.enter.native="keyUpSubmit"
            v-model="ruleForm.remark"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="序号" prop="orderno">
          <el-input
            type="text"
            placeholder="请输入序号"
            @keyup.enter.native="keyUpSubmit"
            v-model="ruleForm.orderno"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
<script>
import formMinxin from "./minxins/formMinxin";

export default {
  mixins: [formMinxin],
  props: {
    patchData: Object,
  },
  data() {
    return {
      ruleForm: {
        codekindid: "",
        codeitemid: "",
        codeitemname: "",
        orderno: "",
        remark: "",
        parentid: this.patchData.codekindid,
        trancode: "",
        isvalid: "0",
      },
      rules: {
        codekindid: [
          { required: true, message: `请输入代码分类ID`, trigger: "blur" },
        ],
        codeitemid: [
          { required: true, message: `请输入代码ID`, trigger: "blur" },
        ],
        codeitemname: [
          { required: true, message: `请输入代码名称`, trigger: "blur" },
        ],
        orderno: [
          {
            required: false,
            validator: this.validatorZzs,
            message: `请输入正确排序号`,
            trigger: "blur",
          },
        ],
        isvalid: [
          {
            required: true,
            message: "请选择任务状态",
            trigger: "change",
          },
        ],
      },
    };
  },
  created() {
    this.initForm(this.patchData);

    if (Object.getOwnPropertyNames(this.patchData).length == 2) {
      this.status = 2;
    }
  },
  watch: {
    patchData: function () {
      this.initForm(this.patchData);
      if (Object.getOwnPropertyNames(this.patchData).length == 2) {
        this.status = 2;
      }
    },
  },
};
</script>
<style lang="scss"></style>
