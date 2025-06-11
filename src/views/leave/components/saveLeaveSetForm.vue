<template>
  <el-form
    size="medium"
    :model="ruleForm"
    status-icon
    ref="ruleForm"
    label-width="auto"
  >
    <el-alert
      title="选中可配置项，则可将该行信息加入请假单。"
      type="warning"
      :style="{
        margin: '-10px 0 10px 0',
      }"
    >
    </el-alert>
    <el-row class="set-form">
      <el-col :span="12">
        <el-form-item label="姓名：" prop="xm">
          <el-input
            type="text"
            @keyup.enter.native="keyUpSubmit"
            v-model="ruleForm.xm"
            autocomplete="off"
            placeholder="请输入姓名"
            :disabled="true"
          ></el-input>
        </el-form-item>
        <el-form-item label="性别：" prop="xm">
          <el-input
            type="text"
            @keyup.enter.native="keyUpSubmit"
            v-model="ruleForm.xb"
            autocomplete="off"
            placeholder="请输入性别"
            :disabled="true"
          ></el-input>
        </el-form-item>
        <el-form-item label="年级：" prop="nj">
          <el-input
            type="text"
            @keyup.enter.native="keyUpSubmit"
            v-model="ruleForm.nj"
            autocomplete="off"
            placeholder="请输入年级"
            :disabled="true"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系电话：" prop="sj">
          <el-input
            type="text"
            @keyup.enter.native="keyUpSubmit"
            v-model="ruleForm.sj"
            autocomplete="off"
            placeholder="请输入联系电话"
            :disabled="true"
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="学号：" prop="xh">
          <el-input
            type="text"
            @keyup.enter.native="keyUpSubmit"
            v-model="ruleForm.xh"
            autocomplete="off"
            placeholder="请输入学号"
            :disabled="true"
          ></el-input>
        </el-form-item>
        <el-form-item :label="lang_college + '：'" prop="xy">
          <el-input
            type="text"
            @keyup.enter.native="keyUpSubmit"
            v-model="ruleForm.xy"
            autocomplete="off"
            :placeholder="`请输入${lang_college}`"
            :disabled="true"
          ></el-input>
        </el-form-item>
        <el-form-item label="班级：" prop="bj">
          <el-input
            type="text"
            @keyup.enter.native="keyUpSubmit"
            v-model="ruleForm.nj"
            autocomplete="off"
            placeholder="请输入年级"
            :disabled="true"
          ></el-input>
        </el-form-item>
        <el-form-item label="请假类型：" prop="sj">
          <el-select
            @keyup.enter.native="keyUpSubmit"
            v-model="ruleForm.sj"
            autocomplete="off"
            placeholder="请选择请假类型"
            :disabled="true"
          ></el-select>
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item label="请假时间：" prop="xh">
          <el-date-picker
            :disabled="true"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="请假理由：" prop="bj">
          <el-input
            type="textarea"
            @keyup.enter.native="keyUpSubmit"
            v-model="ruleForm.nj"
            autocomplete="off"
            placeholder="请输入"
            :disabled="true"
          ></el-input>
        </el-form-item>
      </el-col>
      <el-checkbox-group v-model="checkList">
        <el-col :span="12">
          <el-form-item label="紧急联系人：" prop="xm">
            <template #label>
              <el-checkbox label=""></el-checkbox
              ><label for="" class="el-form-item__label" style="width: 100px"
                >紧急联系人：</label
              >
            </template>
            <el-input
              type="text"
              @keyup.enter.native="keyUpSubmit"
              v-model="ruleForm.xm"
              autocomplete="off"
              placeholder="请输入"
              :disabled="true"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="紧急联系电话：" prop="xm">
            <el-input
              type="text"
              @keyup.enter.native="keyUpSubmit"
              v-model="ruleForm.xm"
              autocomplete="off"
              placeholder="请输入"
              :disabled="true"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="寝室信息：" prop="xm">
            <template #label>
              <el-checkbox label=""></el-checkbox
              ><label for="" class="el-form-item__label" style="width: 100px"
                >寝室信息：</label
              >
            </template>
            <el-input
              type="text"
              @keyup.enter.native="keyUpSubmit"
              v-model="ruleForm.xm"
              autocomplete="off"
              placeholder="请输入"
              :disabled="true"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="附件：" prop="xm">
            <template #label>
              <el-checkbox label=""></el-checkbox
              ><label for="" class="el-form-item__label" style="width: 100px"
                >附件：</label
              >
            </template>
            <el-button icon="el-icon-upload" type="primary">上传</el-button>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="请假承诺：" prop="xm">
            <template #label>
              <el-checkbox label=""></el-checkbox
              ><label for="" class="el-form-item__label" style="width: 100px"
                >请假承诺：</label
              >
            </template>
            <el-input
              type="textarea"
              @keyup.enter.native="keyUpSubmit"
              v-model="ruleForm.xm"
              autocomplete="off"
              placeholder="请输入承诺内容，学生确认后，请假单将显示学生对该承诺的签名信息。"
              :disabled="true"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-checkbox-group>
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
      id: "",
      checkList: [],
      ruleForm: {},
      rules: {
        itemName: [
          { required: true, message: `请输入选项名称`, trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.init(this.patchData);
  },
  watch: {
    patchData: function () {
      this.init(this.patchData);
    },
  },
  methods: {
    init() {},
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
