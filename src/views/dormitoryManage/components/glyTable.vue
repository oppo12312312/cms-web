<template>
  <div class="check-in-table">
    <basic-table
      v-model="tableParams"
      @selectionChange="selectionChange"
      ref="basicTable"
      :call-server="callServer"
      :columns="columns"
      :muti="false"
    >
      <div slot="tableHeader" class="txt-right">
        <v-form :fields="fields1" :fieldsData="tableParams">
          <el-col :span="6" class="txt-left">
            <el-button type="primary" @click="fecthData()">查询</el-button>
            <el-button type="default" @click="reloadData">清空</el-button>
          </el-col>
        </v-form>
        <v-table-set-btn
          file-name="管理员"
          :download="exportsExecutes"
          :columns="columns"
          @colsChange="colsChange"
        ></v-table-set-btn>
      </div>
    </basic-table>
  </div>
</template>
<script>
import basicTable from "_c/tables";
import { findSgUsers, findSgList } from "@/projects/hbmu-suguan/api/common";
import { getDeptsListOptions } from "@/filters/options";

export default {
  props: {
    patchData: Object,
  },
  components: {
    basicTable,
  },
  data() {
    return {
      currentItem: {},
      tableParams: {},
      showFields: [],
      depts: [],
      multipleSelection: [],
    };
  },
  created() {
    getDeptsListOptions().then((data) => {
      this.depts = data;
    });
  },
  computed: {
    columns: function () {
      const cols = [
        {
          label: "账号",
          prop: "username",
        },
        {
          label: "姓名",
          prop: "truename",
        },
        {
          label: "性别",
          prop: "xb",
        },
        {
          label: this.lang_college,
          prop: "deptname",
        },
        {
          label: "邮箱",
          prop: "email",
        },
        {
          label: "电话",
          prop: "tel",
        },
        {
          label: "操作",
          fixed: "right",
          render: (h, row) => {
            return (
              <div>
                <el-button
                  type="text"
                  onClick={() => this.select(row)}
                  size="middle"
                  class="txt-highlight"
                >
                  选择
                </el-button>
              </div>
            );
          },
        },
      ];
      if (this.showFields.length) {
        for (let i = 0; i < cols.length; i++) {
          if (cols[i].prop || cols[i].field) {
            const field = cols[i].prop || cols[i].field;
            cols[i].isHide = this.showFields.indexOf(field) > -1 ? false : true;
          }
        }
      }
      return cols;
    },
    fields1: function () {
      return [
        {
          label: "",
          prop: "username",
          span: 6,
          type: "text",
          placeholder: "输入账号",
        },
        {
          label: "",
          prop: "truename",
          span: 6,
          type: "text",
          placeholder: "输入姓名",
        },
        {
          label: "",
          prop: "deptid",
          span: 6,
          type: "select",
          placeholder: "选择部门",
          options: this.depts,
        },
      ];
    },
  },
  watch: {
    patchData: function () {
      this.init(this.patchData);
    },
  },
  methods: {
    init() {
      this.initForm(this.patchData);
    },
    callServer() {
      return findSgList;
    },
    selectionChange(val) {
      this.multipleSelection = val;
    },
    fecthData(keep) {
      this.$refs.basicTable.fecthData();
    },
    reloadData() {
      this.tableParams = {};
      this.$refs.basicTable.reload();
    },
    exportsExecutes(fields, filename) {
      return exportStudents(
        Object.assign(this.tableParams, {
          excelDtos: fields,
        }),
        filename
      );
    },
    colsChange(showFields) {
      this.showFields = showFields;
    },
    select(item) {
      this.$emit("change", item);
    },
  },
};
</script>
<style lang="scss">
.tj-tag {
  .el-tag {
    height: 48px;
    line-height: 48px;
    padding: 0 10px;
  }
}
</style>
