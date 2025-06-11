<template>
  <el-form
    size="medium"
    :model="ruleForm"
    status-icon
    :rules="rules"
    ref="ruleForm"
    label-width="auto"
  >
    <el-row>
      <el-col :span="12">
        <el-form-item label="栏目名称：" prop="channelName">
          <el-input
            type="text"
            placeholder="请输入栏目名称"
            @keyup.enter.native="keyUpSubmit"
            v-model="ruleForm.channelName"
            autocomplete="off"
            :disabled="true"
          ></el-input>
        </el-form-item>
        <el-form-item label="是否对外：" prop="isRecommend">
          <el-radio-group v-model="ruleForm.isRecommend">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="固定级别：" prop="topLevel">
          <el-input
            type="text"
            placeholder="请输入固定级别"
            @keyup.enter.native="keyUpSubmit"
            v-model="ruleForm.topLevel"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item label="是否加粗：" prop="isBold">
          <el-radio-group v-model="ruleForm.isBold">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
        </el-form-item> -->
      </el-col>
      <el-col>
        <el-form-item label="标题：" prop="title">
          <el-input
            type="text"
            placeholder="请输入标题"
            @keyup.enter.native="keyUpSubmit"
            v-model="ruleForm.title"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item label="描述：">
          <el-input
            type="text"
            placeholder="请输入描述"
            @keyup.enter.native="keyUpSubmit"
            v-model="ruleForm.description"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-col>
      <!-- <el-col>
        <el-form-item label="开放时间" prop="kfsj">
          <el-date-picker
          v-model="ruleForm.kfsj"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          format="yyyy-MM-dd HH:mm"
        ></el-date-picker>
        </el-form-item>
      </el-col> -->
      <el-col>
        <el-form-item label="内容" prop="txt">
          <tinymce ref="editor" height="500" v-model="ruleForm.txt"></tinymce>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
<script>
import formMinxin from "_c/forms/minxins/formMinxin.js";
import tinymce from "_c/tinymce";

export default {
  components: {
    tinymce,
  },
  mixins: [formMinxin],
  props: {
    patchData: Object,
    treeData: Array,
  },
  data() {
    return {
      ruleForm: {
        contentId: "",
        channelId: this.patchData.node.channelId || "0",
        channelName: this.patchData.node.channelName || "栏目根节点",
        topLevel: "",
        isBold: "0",
        title: "",
        isRecommend: "0",
        txt: "",
        description: "",
        kfsj: "",
        kssj: "",
        jssj: "",
      },
      rules: {
        title: [
          {
            required: true,
            message: "请输入标题",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.init();
  },
  watch: {
    patchData: function () {
      this.init();
    },
    "ruleForm.kfsj": function (val) {
      this.ruleForm.kssj = this.$filters.parseTime(
        val[0],
        "{y}-{m}-{d} {h}:{i}:{s}"
      );
      this.ruleForm.jssj = this.$filters.parseTime(
        val[1],
        "{y}-{m}-{d} {h}:{i}:{s}"
      );
    },
  },
  methods: {
    init() {
      this.initForm(this.patchData);
    },
  },
};
</script>
<style lang="scss"></style>
