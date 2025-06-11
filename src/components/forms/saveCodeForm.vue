<template>
  <el-form
    size="mini"
    :model="ruleForm"
    status-icon
    ref="ruleForm"
    label-width="auto"
  >
    <el-row gutter="15">
      <el-col :span="12">
        <el-form-item
          label="字段名称："
          prop="codekindname"
          :rules="rules.itemName"
        >
          <el-input
            type="text"
            @keyup.enter.native="keyUpSubmit"
            v-model="ruleForm.codekindname"
            autocomplete="off"
            placeholder="请输入字段名称"
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="代码标准：" prop="codekindid" :rules="rules.code">
          <el-input
            type="text"
            @keyup.enter.native="keyUpSubmit"
            v-model="ruleForm.codekindid"
            autocomplete="off"
            placeholder="请输入代码标准"
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="排序：" prop="orderno" :rules="rules.orderno">
          <el-input
            type="text"
            @keyup.enter.native="keyUpSubmit"
            v-model="ruleForm.orderno"
            autocomplete="off"
            placeholder="请输入排序"
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="备注：" prop="remark" :rules="rules.remark">
          <el-input
            type="text"
            @keyup.enter.native="keyUpSubmit"
            v-model="ruleForm.remark"
            autocomplete="off"
            placeholder="请输入备注"
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-button
          type="primary"
          size="mini"
          icon="el-icon-plus"
          @click="addItem()"
          >新增选项</el-button
        >
      </el-col>
    </el-row>
    <el-row gutter="15" v-for="(item, index) in ruleForm.allList" :key="index">
      <el-col :span="7">
        <el-form-item
          label="选项名称："
          :prop="'allList.' + index + '.codeitemname'"
          :rules="rules.itemName"
        >
          <el-input
            type="text"
            @keyup.enter.native="keyUpSubmit"
            v-model="item.codeitemname"
            autocomplete="off"
            placeholder="请输入选项名称"
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="7">
        <el-form-item
          label="代码："
          :prop="'allList.' + index + '.codeitemid'"
          :rules="rules.code"
        >
          <el-input
            type="text"
            @keyup.enter.native="keyUpSubmit"
            v-model="item.codeitemid"
            autocomplete="off"
            placeholder="请输入代码"
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="7">
        <el-form-item
          label="排序："
          :prop="'allList.' + index + '.orderno'"
          :rules="rules.orderno"
        >
          <el-input
            type="text"
            @keyup.enter.native="keyUpSubmit"
            v-model="item.orderno"
            autocomplete="off"
            placeholder="请输入排序"
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="3">
        <el-button
          type="primary"
          :disabled="ruleForm.allList.length < 2"
          size="mini"
          icon="el-icon-delete"
          @click="delItem(index)"
          >删除</el-button
        >
      </el-col>
      <!-- <el-col>
        <el-form-item label="备注：" prop="remark">
          <el-input
            type="text"
            @keyup.enter.native="keyUpSubmit"
            v-model="ruleForm.remark"
            autocomplete="off"
            placeholder="请输入备注"
          ></el-input>
        </el-form-item>
      </el-col>-->
    </el-row>
  </el-form>
</template>
<script>
import formMinxin from "./minxins/formMinxin";

export default {
  props: {
    patchData: Object,
  },
  mixins: [formMinxin],
  data() {
    return {
      id: "",
      // item: {
      //   codekindname: "",
      //   codekindid: "",
      //   orderno: "",
      // },
      ruleForm: {
        codekindname: "", // 字段代码名称
        codekindid: "", //字段代码id
        orderno: "", //排序
        allList: [],
        remark: "",
        codegroup: "growplan",
        //remark: '',
      },
      rules: {
        itemName: [
          { required: true, message: `请输入选项名称`, trigger: "blur" },
        ],
        code: [{ required: true, message: `请输入选项名称`, trigger: "blur" }],
        orderno: [
          {
            validator: this.validatorZzs,
            message: `请输入正整数`,
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.initForm(this.patchData);
    this.init();
  },
  watch: {
    patchData: function () {
      this.initForm(this.patchData);
      this.init();
    },
  },
  methods: {
    init() {
      this.ruleForm.codegroup = "growplan";
      if (this.patchData.allList == null) {
        this.ruleForm.allList = [];
        this.ruleForm.allList.push({});
      }
    },
    addItem() {
      this.ruleForm.allList.push({});
    },
    delItem(index) {
      this.ruleForm.allList.splice(index, 1);
    },
  },
};
</script>
<style lang="scss"></style>
