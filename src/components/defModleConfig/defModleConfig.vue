<template>
  <div class="con-form-container" v-loading="loading">
    <el-form
      size="medium"
      :model="ruleForm"
      status-icon
      ref="ruleForm"
      label-width="auto"
    >
      <el-form-item label="请假须知：" prop="remark" :rules="rules.remark">
        <tinymce ref="editor" v-model="ruleForm.remark"></tinymce>
      </el-form-item>
      <el-form-item style="padding: 20px 0 15px 340px">
        <el-button type="primary" :loading="posting" @click="onSubmit"
          >保存</el-button
        >
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import basicTable from "_c/tables/";
import tinymce from "_c/tinymce";
import { getModule, updateModule } from "@/api/xgModule";

export default {
  components: {
    basicTable,
    tinymce,
  },
  props: {
    defid: String,
    module: String,
  },
  data() {
    return {
      posting: false,
      loading: false,
      currentItem: {},
      rules: {
        remark: [
          { required: true, message: `请输入请假须知`, trigger: "blur" },
        ],
      },
      ruleForm: {
        defid: "",
        moduleid: "",
        name: "",
        remark: "",
      },
    };
  },
  created() {
    getModule(this.module).then((data) => {
      this.ruleForm.defid = data.data.defid;
      this.ruleForm.moduleid = data.data.moduleid;
      this.ruleForm.name = data.data.name;
      this.ruleForm.remark = this.xss(data.data.remark);
    });
  },
  methods: {
    onSubmit() {
      const me = this;
      this.$refs.ruleForm.validate().then((valid) => {
        if (valid) {
          this.posting = true;
          updateModule(this.ruleForm)
            .then(() => {
              this.posting = false;
              me.toast("设置成功", "success");
            })
            .catch((err) => {
              this.posting = false;
            });
        }
      });
    },
  },
};
</script>

<style lang="scss">
.rule-row {
  .el-row {
    margin-bottom: 15px;
  }
  .el-form-item {
    padding-right: 15px;
    &.is-required {
      padding-left: 5px;
      .el-input {
        position: relative;
        &::before {
          content: "*";
          position: absolute;
          color: #f56c6c;
          left: -10px;
          top: -5px;
        }
      }
    }
  }
  .el-icon-delete {
    cursor: pointer;
  }
}
</style>
