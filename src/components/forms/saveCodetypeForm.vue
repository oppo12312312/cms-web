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
          ></el-input>
        </el-form-item>

        <el-form-item label="序号" prop="orderno">
          <el-input
            type="text"
            placeholder="请输入序号"
            @keyup.enter.native="keyUpSubmit"
            v-model.number="ruleForm.orderno"
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
        <el-form-item label="代码分组" prop="codegroup">
          <el-select
            :disabled="this.currentGroup == '根节点' ? false : true"
            v-model="ruleForm.codegroup"
            placeholder="代码分组"
          >
            <el-option
              v-for="(g, index) in groups"
              :key="index"
              :label="g"
              :value="g"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="代码分类名称" prop="codekindname">
          <el-input
            type="text"
            placeholder="请输入代码分类名称"
            @keyup.enter.native="keyUpSubmit"
            v-model="ruleForm.codekindname"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item label="备注" prop="remark">
          <el-input
            type="textarea"
            placeholder="请输入备注"
            @keyup.enter.native="keyUpSubmit"
            v-model="ruleForm.remark"
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
    groups: Array,
    currentGroup: String,
  },
  data() {
    return {
      ruleForm: {
        codekindid: "",
        codekindname: "",
        orderno: "",
        codegroup: "",
        remark: "",
        isvalid: "0",
      },
      rules: {
        codekindid: [
          { required: true, message: `请输入代码分类ID`, trigger: "blur" },
        ],
        codekindname: [
          { required: true, message: `请输入代码分类名称`, trigger: "blur" },
        ],
        orderno: [
          {
            required: false,
            validator: this.validatorZzs,
            message: `请输入正确排序号`,
            trigger: "blur",
          },
        ],
        // codegroup: [
        //   { required: true, message: `请输入执行命令`, trigger: "blur" },
        // ],
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
    this.ruleForm.codegroup =
      this.currentGroup == "根节点" ? this.groups[0] : this.currentGroup;
  },
  watch: {
    patchData: function () {
      this.initForm(this.patchData);
    },
  },
};
</script>
<style lang="scss"></style>
