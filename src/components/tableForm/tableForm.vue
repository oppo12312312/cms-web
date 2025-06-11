<template>
  <el-form size="mini" label-width="auto" ref="tableForm" class="table-form">
    <el-table :data="tableData" style="width: 100%">
      <el-table-column
        v-for="(col, index) in columns"
        :label="col.label"
        :key="index"
      >
        <template slot-scope="scope">
          <el-form-item
            label=""
            :prop="scope.$index + '.' + col.prop"
            :rules="col.rule"
            class="form-input"
          >
            <span v-if="!scope.row.canEdit">
              {{
                col.showTxt
                  ? col.showTxt(scope.row[col.prop])
                  : scope.row[col.prop]
              }}
            </span>
            <el-input
              v-if="col.type == 'text' && scope.row.canEdit"
              size="mini"
              v-model="scope.row[col.prop]"
              :placeholder="
                scope.row.placeHolder ? scope.row.placeHolder : '请输入文字'
              "
            ></el-input>
            <el-select
              v-if="col.type == 'select' && scope.row.canEdit"
              size="mini"
              v-model="scope.row[col.prop]"
              @change="(val) => (col.change ? col.change(val, scope.row) : '')"
              :placeholder="
                scope.row.placeHolder ? scope.row.placeHolder : '请选择'
              "
            >
              <el-option
                v-for="(op, index) in col.options"
                :key="index"
                :label="op.label"
                :value="op.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="edit(scope.row)"
            size="middle"
            class="txt-highlight"
          >
            {{ scope.row.canEdit ? "保存" : "修改" }}
          </el-button>
          <el-button
            type="text"
            @click="del(scope.$index, scope.row)"
            size="middle"
            class="txt-highlight"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div
      @click="addRow"
      style="cursor: pointer; line-height: 32px"
      class="txt-center"
    >
      + 添加{{ itemName }}
    </div>
    <slot></slot>
  </el-form>
</template>

<script>
export default {
  model: {
    prop: "tableData",
    event: "handleChange",
  },
  props: {
    columns: Array,
    tableData: { type: Array, default: [] },
    itemName: String,
  },
  data() {
    return {
      orObj: {},
      ruleForm: {},
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      const obj = {};
      for (const td of this.tableData) {
        td.canEdit = false;
        for (const k in this.columns[0]) {
          if (k == "prop") {
            obj[k] = this.columns[0][k];
          } else {
            obj[k] = "";
          }
        }
      }
      obj.canEdit = true;
      this.orObj = this.copy(obj);
      this.tableData.push(obj);
    },
    handleChange() {
      this.$emit("handleChange", this.tableData);
    },
    edit(item) {
      item.canEdit = !item.canEdit;
      this.tableData = Object.assign([], this.tableData);
    },
    addRow() {
      this.tableData.push(this.copy(this.orObj));
    },
    del(index, item) {
      this.tableData.splice(index, 1);
    },
    validate(cb) {
      this.$refs.tableForm.validate((valid) => {
        if (valid) {
          cb();
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss">
.table-form {
  .el-form-item {
    margin-bottom: 0;
  }
  .form-input {
    .el-form-item__error {
      position: relative;
    }
    .el-form-item__label-wrap {
      margin-left: 0 !important;
    }
    .el-form-item__content {
      margin-left: 0px !important;
    }
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
}
</style>
