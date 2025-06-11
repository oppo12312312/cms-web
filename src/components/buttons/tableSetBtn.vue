<template>
  <span>
    <slot></slot>
    <el-button v-if="download" type="default" @click="openExportDialog">
      导出excel
      <v-dialog
        ref="saveDialog"
        confirm-btn-txt="导出"
        @handleClose="exportFile"
        title="导出excel"
      >
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
          <div class="fields-area">
            <el-checkbox-group
              v-model="checkedFields"
              @change="handleCheckedFieldsChange"
            >
              <el-checkbox
                v-for="(f, index) in exportHeaders || fields"
                :label="f"
                :key="index"
                >{{ f.header }}
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </el-form>
      </v-dialog>
    </el-button>
    <el-popover
      placement="bottom"
      title
      width="200"
      trigger="click"
      content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。"
      popper-class="fn-p00"
      @hide="colsChange"
    >
      <div slot="reference" class="disIbk">
        <el-button type="default">列表设置</el-button>
      </div>
      <el-card shadow="never">
        <div slot="header" class="clearfix txt-right">
          <el-checkbox v-model="checkAll1" @change="handleCheckAllChange1"
            >全选</el-checkbox
          >
        </div>
        <div style="max-height: 300px; overflow: auto">
          <el-checkbox-group
            v-model="checkedFields1"
            @change="handleCheckedFieldsChange1"
          >
            <el-checkbox
              v-for="(f, index) in fields"
              :label="f.column"
              :key="index"
              class="block fn-mb10"
              >{{ f.header }}</el-checkbox
            >
          </el-checkbox-group>
        </div>
      </el-card>
    </el-popover>
    <slot name="after"></slot>
  </span>
</template>

<script>
export default {
  props: {
    download: Function,
    columns: Array,
    exportHeaders: {
      //当传入这个属性的时候，意味着自定义了导出表格的列头，即导出的信息以此为准
      type: Array,
      require: false,
    },
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
    columns() {
      this.init();
    },
    fileName(val) {
      this.ruleForm.filename = val;
    },
  },
  methods: {
    init() {
      this.fields = [];
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
    openExportDialog() {
      if (this.easyExport) {
        this.download([], this.ruleForm.filename);
      } else {
        this.checkedFields = [];
        this.$refs.saveDialog.dialogVisible = true;
      }
    },
    exportFile() {
      this.$refs.ruleForm.validate().then(async (valid) => {
        if (valid) {
          if (this.checkedFields.length) {
            this.$refs.saveDialog.posting = true;
            await this.download(this.checkedFields, this.ruleForm.filename);
            this.$refs.saveDialog.posting = false;
          } else {
            this.toast("请至少选择一个字段导出", "warning");
          }
        }
      });
    },
    handleCheckAllChange(val) {
      if (val) {
        this.checkedFields = this.exportHeaders || this.fields;
      } else {
        this.checkedFields = [];
      }
      this.isIndeterminate = false;
    },
    handleCheckedFieldsChange(value) {
      const checkedCount = value.length;
      this.checkAll =
        checkedCount ===
        (this.exportHeaders ? this.exportHeaders.length : this.fields.length);
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
