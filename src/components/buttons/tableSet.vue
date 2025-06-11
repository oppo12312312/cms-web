<template>
  <el-row>
    <el-col>
      <el-form
        size="medium"
        :model="ruleForm"
        status-icon
        ref="ruleForm"
        label-width="auto"
      >
        <el-form-item
          label="导出文件名："
          prop="filename"
          :rules="rules.filename"
          style="margin-left: 14px"
        >
          <el-input
            type="text"
            @keyup.enter.native="keyUpSubmit"
            v-model="ruleForm.filename"
            autocomplete="off"
            placeholder="请输入文件名"
          >
            <template slot="append">.xls</template>
          </el-input>
        </el-form-item>
        <el-form-item
          label="请选择字段"
          prop="filename"
          :rules="rules.filename"
          class="txt-right"
        >
          <el-checkbox v-model="checkAll" @change="handleCheckAllChange"
            >全选</el-checkbox
          >
        </el-form-item>
        <div class="fields-area txt-left">
          <el-checkbox-group
            v-model="checkedFields"
            @change="handleCheckedFieldsChange"
          >
            <el-checkbox
              v-for="(f, index) in fields"
              :label="f.column"
              :key="index"
              >{{ f.header }}</el-checkbox
            >
          </el-checkbox-group>
        </div>
      </el-form>
    </el-col>
    <el-col class="fn-ac fn-mt10">
      <el-button type="primary" @click="exportFile">导出统计表</el-button>
      <el-button type="primary" @click="previewFile">预览统计表</el-button>
    </el-col>
  </el-row>
</template>

<script>
export default {
  props: {
    download: Function,
    preview: Function,
    columns: Array,
    fileName: String,
    hasImport: {
      type: Boolean,
      default: false,
    },
    easyExport: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      checkAll: false,
      checkAll1: false,
      isIndeterminate: true,
      checkedFields: [],
      checkedFields1: [],
      fields: [],
      ruleForm: {
        filename: this.fileName,
      },
      rules: {
        filename: [
          {
            required: true,
            message: "请输入文件名",
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
    columns: function () {
      this.init();
    },
  },
  methods: {
    init() {
      for (let i = 0; i < this.columns.length; i++) {
        if (this.columns[i].field || this.columns[i].prop) {
          this.fields.push({
            header: this.columns[i].label,
            column: this.columns[i].field
              ? this.columns[i].field
              : this.columns[i].prop,
          });
        }
        if (
          !this.columns[i].isHide &&
          (this.columns[i].field || this.columns[i].prop)
        ) {
          this.checkedFields1.push(
            this.columns[i].field ? this.columns[i].field : this.columns[i].prop
          );
        }
      }
      this.checkAll1 = this.checkedFields1.length === this.fields.length;
    },
    exportFile() {
      this.$refs.ruleForm.validate().then((valid) => {
        if (valid) {
          if (this.checkedFields.length) {
            const arr = [];
            for (let i = 0; i < this.fields.length; i++) {
              if (this.checkedFields.indexOf(this.fields[i].column) > -1) {
                arr.push(this.fields[i]);
              }
            }
            this.download(arr, this.ruleForm.filename);
          } else {
            this.toast("请至少选择一个字段导出", "warning");
          }
        }
      });
    },
    previewFile() {
      this.$refs.ruleForm.validate().then((valid) => {
        if (valid) {
          if (this.checkedFields.length) {
            const arr = [];
            for (let i = 0; i < this.fields.length; i++) {
              if (this.checkedFields.indexOf(this.fields[i].column) > -1) {
                arr.push(this.fields[i]);
              }
            }
            this.preview(arr, this.ruleForm.filename);
          } else {
            this.toast("请至少选择一个字段导出", "warning");
          }
        }
      });
    },
    handleCheckAllChange(val) {
      if (val) {
        for (let i = 0; i < this.fields.length; i++) {
          this.checkedFields.push(this.fields[i].column);
        }
      } else {
        this.checkedFields = [];
      }
      this.isIndeterminate = false;
    },
    handleCheckedFieldsChange(value) {
      const checkedCount = value.length;
      this.checkAll = checkedCount === this.fields.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.fields.length;
    },
    handleCheckAllChange1(val) {
      if (val) {
        for (let i = 0; i < this.fields.length; i++) {
          this.checkedFields1.push(this.fields[i].column);
        }
      } else {
        this.checkedFields1 = [];
      }
    },
    handleCheckedFieldsChange1(value) {
      const checkedCount = value.length;
      this.checkAll1 = checkedCount === this.fields.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.fields.length;
    },
    colsChange() {
      this.$emit("colsChange", this.checkedFields1);
    },
    saveItem() {},
  },
};
</script>

<style lang="scss">
.fields-area {
  border: 1px solid #ededed;
  border-radius: 2px;
  padding: 15px;
  height: 200px;
  overflow: auto;
  margin-top: -15px;
}
</style>
