<template>
  <el-button type="default" :size="size" @click="openExportDialog">
    {{ txt }}
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
        <el-form-item label="请选择字段" prop="filename" class="txt-right">
          <el-checkbox v-model="checkAll" @change="handleCheckAllChange"
            >全选</el-checkbox
          >
        </el-form-item>
        <div class="fields-area">
          <el-checkbox-group
            v-model="checkedFields"
            @change="handleCheckedFieldsChange"
          >
            <el-row>
              <el-col
                :span="8"
                v-for="(f, index) in exportHeaders || fields"
                :key="index"
              >
                <el-checkbox :label="f">
                  {{ f.header }}
                </el-checkbox>
              </el-col>
            </el-row>
          </el-checkbox-group>
        </div>
      </el-form>
    </v-dialog>
  </el-button>
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
    easyExport: {
      type: Boolean,
      default: false,
    },
    txt: {
      type: String,
      default: "导出",
    },
    size: {
      type: String,
      default: "middle",
    },
  },
  data() {
    return {
      checkAll: false,
      checkedFields: [],
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
      }
    },
    openExportDialog() {
      if (this.easyExport) {
        this.download([], this.ruleForm.filename);
      } else {
        this.checkAll = false;
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
            this.$refs.saveDialog.dialogVisible = false;
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
    },
    handleCheckedFieldsChange(value) {
      const checkedCount = value.length;
      this.checkAll =
        checkedCount ===
        (this.exportHeaders ? this.exportHeaders.length : this.fields.length);
    },
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
