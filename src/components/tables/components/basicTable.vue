<template>
  <div class="table-wrapper">
    <slot name="tableHeader" :scope="{ loading, tableData, multipleSelection }"></slot>
    <slot
      v-if="isOther"
      name="isOther"
      :scope="{ loading, tableData, multipleSelection }"
    ></slot>
    <el-table
      v-show="!isOther"
      :data="tableData"
      ref="elTable"
      :max-height="height"
      :border="border"
      :rowClassName="rowClassName"
      :header-cell-style="{ background: '#ECEEF2' }"
      tooltip-effect="dark"
      style="width: 100%"
      class="flex-1"
      :show-header="showHeader || true"
      v-loading="loading"
      :span-method="spanMethod"
      :summary-method="summaryMethod"
      :show-summary="!!summaryMethod"
      @selection-change="handleSelectionChange"
      :header-cell-class-name="handleHeadAddClass"
      @sort-change="handleSortChange"
    >
      <el-table-column v-if="operate" width="40">
        <template slot="header">
          <i @click="addRow()" class="el-icon-circle-plus txt-highlight cursorPoint"></i>
        </template>
        <template slot-scope="scope">
          <i
            @click="delRow(scope.$index)"
            class="el-icon-remove txt-highlight cursorPoint"
          ></i>
        </template>
      </el-table-column>
      <el-table-column
        v-if="muti"
        width="50"
        type="selection"
        header-align="center"
        align="center"
      ></el-table-column>
      <el-table-column
        :label="indexName || '序号'"
        v-if="showIndex"
        :index="indexMethod"
        width="60"
        type="index"
        fixed="left"
      >
        <template slot-scope="scope">
          <span>{{
            (pagination.pageIndex - 1) * pagination.pageSize + scope.$index + 1
          }}</span>
        </template>
      </el-table-column>
      <table-column
        v-for="(column, index) in columns"
        :key="index"
        :column="column"
        :empty-txt="emptyTxt"
      ></table-column>
    </el-table>
    <div class="pagination-wrapper clearfix" v-show="!loading && showpagination">
      <div class="pagination-left clearfix">
        <span v-if="!propsData">每页显示{{ pagination.pageSize }}条，</span>
        <span>共{{ propsData ? propsData.length : total }}条</span>
      </div>
      <div class="pagination-right">
        <el-pagination
          :hide-on-single-page="total < 2"
          background
          :current-page="pagination.pageIndex"
          layout="prev, pager, next,sizes,jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="pageSizes"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import tableOperate from "./tableOperate";
import tableColumn from "./tableColumn";

export default {
  model: {
    prop: "params",
    event: "paramsChange",
  },
  props: {
    operate: Boolean,
    indexName: String,
    callServer: Function,
    beforeShow: Function,
    emptyTxt: String,
    spanMethod: Function,
    summaryMethod: Function,
    border: Boolean,
    rowClassName: Function,
    showpagination: {
      type: Boolean,
      default: () => {
        return true;
      },
    },
    pageSizes: {
      type: Array,
      default: () => {
        return [10, 15, 20, 50, 100, 500];
      },
    },
    params: {
      type: [Object, String, Number],
      default: () => {
        return {};
      },
    },
    query: {
      type: [Object, String, Number],
      default: () => {
        return {};
      },
    },
    indexMethod: Function,
    fixed: String,
    isOther: {
      type: Boolean,
      default: false,
    },
    muti: {
      type: Boolean,
      default: true,
    },
    showIndex: {
      type: Boolean,
      default: false,
    },
    limit: Number,
    showHeader: Boolean,
    propsData: Array,
    columns: Array,
    height: [String, Number],
    selectKey: { type: Array, default: () => [] },
    keyCode: { type: String, default: "id" },
    isGetDataNow: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    tableOperate,
    tableColumn,
  },
  data() {
    return {
      res: {},
      tableData: this.propsData || [],
      total: 0,
      multipleSelection: [],
      loading: false,
      pagination: {
        pageIndex: 1,
        pageSize: this.limit || 10,
      },
      sortArr: [],
      sort: "",
    };
  },
  created() {
    this.isGetDataNow && this.init();
  },
  computed: {
    isOperate: () => {
      return (type) => {
        if (type) {
          if (type == "operate") {
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      };
    },
  },
  watch: {
    callServer: function () {
      this.fecthData();
    },
    propsData(val) {
      if (val) {
        this.$set(this, "tableData", val);
      }
    },
  },
  methods: {
    init() {
      if (this.callServer) {
        this.fecthData();
      }
    },
    fecthData() {
      if (typeof this.callServer == "function") {
        this.loading = true;
        console.log("fecthData", this.params, this.pagination, this.query);
        this.callServer()(Object.assign(this.params, this.pagination), this.query)
          .then((res) => {
            if (!res?.data?.length && this.pagination?.pageIndex > 1) {
              this.pagination.pageIndex = 1;
              this.fecthData();
            } else {
              this.res = res;
              this.total = res.flag;
              if (this.beforeShow) {
                this.tableData = this.beforeShow(res.data);
              } else {
                this.tableData = res.data;
              }
              this.$nextTick(() => {
                this.tableData &&
                  this.tableData.forEach((row) => {
                    this.$refs.elTable.toggleRowSelection(
                      row,
                      this.selectKey.findIndex((s) => s == row[this.keyCode]) > -1
                    );
                  });
              });
              this.getTableData();
            }
          })
          .finally(() => {
            this.loading = false;
          });
      }
    },
    reload(params) {
      this.pagination.pageIndex = 1;
      const params1 = params || {};
      this.$nextTick(() => {
        this.$emit("paramsChange", params1);
        this.fecthData();
      });
    },
    getTableData() {
      this.$emit("getTableData", this.res);
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.elTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.elTable.clearSelection();
      }
    },
    toggleAllSelection() {
      this.$refs.elTable.toggleAllSelection();
    },
    selectAll(selected) {
      if (selected) {
        this.tableData.forEach((row) => {
          this.$refs.elTable.toggleRowSelection(row, true);
        });
      } else {
        this.$refs.elTable.clearSelection();
      }
    },
    toggleRowSelection(row, selected) {
      this.$refs.elTable.toggleRowSelection(row, selected);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.$emit("selectionChange", val);
    },
    handleHeadAddClass({ column }) {
      this.sortArr.forEach((item) => {
        if (item.prop == column.property) {
          column.order = item.order;
        }
      });
    },
    handleSortChange({ column, prop, order }) {
      console.log(column);
      if (prop) {
        this.sortArr.forEach((item, index) => {
          if (item.prop == prop) {
            this.sortArr[index].order = order;
          }
        });
        const a = this.sortArr.some((item) => item.prop == prop);
        if (!a) {
          const col = this.columns.find((v) => v.prop == prop);
          this.sortArr.push({ prop, order, sort: col.sort });
        }
      }

      const config = { descending: "desc", ascending: "asc" };
      this.sort = this.sortArr
        .filter((v) => v.order)
        .map((v) => `${v.sort || v.prop} ${config[v.order]}`)
        .join(",");

      this.fecthData();
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.fecthData(true);
    },
    handleCurrentChange(val) {
      this.pagination.pageIndex = val;
      this.fecthData(true);
    },
    addRow() {
      this.$emit("addRow");
    },
    delRow(index) {
      this.$emit("delRow", index);
    },
    setKeys() {
      this.tableData.forEach((row) => {
        this.$refs.elTable.toggleRowSelection(
          row,
          this.selectKey.findIndex((s) => s == row[this.keyCode]) > -1
        );
      });
    },
  },
};
</script>
<style lang="scss">
.tableFiltersWrap {
  .el-col {
    .el-date-editor.el-input {
      width: 100%;
    }
    .el-select {
      width: 100%;
    }
  }
  .el-form-item {
    margin-bottom: 0;
  }
  .rowInrow {
    .el-col {
      margin-bottom: 0;
    }
  }
}
.operateFormTable {
  .el-form-item {
    margin-bottom: 0;
  }
  .el-form-item__error {
    position: relative;
  }
}
.table-with-tab {
  .tableHeader {
    padding: 10px 0;
  }
  .table-wrapper {
    background: #fff;
    padding: 10px;
    table {
      &.el-table__header {
        thead {
          tr {
            th {
              background-color: #fcf9fc;
            }
          }
        }
      }
    }

    .el-table__body-wrapper {
      overflow-x: auto;
      table {
        &.el-table__body {
          // min-width: 760px;
        }
      }
    }
    .el-table__fixed-right {
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.12);
    }
    .pagination-wrapper {
      text-align: right;
      position: relative;
      .pagination-left {
        float: left;
        padding: 10px;
      }
      .el-pagination {
        display: inline-block;
        padding: 10px;
      }
      .el-pagination__jump {
        margin-left: 0;
      }
    }
  }
}
.el-card__header {
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 100%;
  }
}
.table-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  .el-table {
    flex: 1;
  }
  .el-select {
    width: 100%;
  }
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 100%;
  }
  .pagination-wrapper {
    margin-top: 10px;
  }
  .pagination-left {
    float: left;
  }
  .pagination-right {
    float: right;
  }
}
.el-table__header {
  thead {
    tr {
      th {
        color: #606266;
      }
    }
  }
}
</style>
