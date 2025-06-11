<template>
  <div class="statistics-table">
    <basic-table
      :call-server="callServer"
      :props-data="tableData"
      :muti="false"
      :columns="columns"
      v-model="tableParams"
      ref="bacsicTable"
      class="bd-line txt-center"
    >
    </basic-table>
    <el-row slot="scope" class="fn-ac">
      <el-button type="primary" @click="export1">导出为Excel</el-button>
    </el-row>
  </div>
</template>

<script>
import basicTable from "_c/tables";
import { statistics, exportStatistics } from "@/api/punish";

export default {
  props: {
    cfztData: String,
  },
  components: {
    basicTable,
  },
  data() {
    return {
      loading: true,
      multipleSelection: [],
      tableData: [],
      columns: [
        {
          label: "班级名称",
          prop: "bjmc",
        },
        {
          label: "通报批评",
          prop: "tbpp",
          empty: "0",
        },
        {
          label: "警告",
          prop: "jinggao",
          empty: "0",
        },
        {
          label: "严重警告",
          prop: "yzjg",
          empty: "0",
        },
        {
          label: "留校察看",
          prop: "lxck",
          empty: "0",
        },
        {
          label: "记过",
          prop: "jiguo",
          empty: "0",
        },
        {
          label: "记大过",
          prop: "jidaguo",
          empty: "0",
        },
        {
          label: "开除学籍",
          prop: "kcxj",
          empty: "0",
        },
        {
          label: "延长处分时间",
          prop: "yccsj",
          empty: "0",
        },
        {
          label: "总人数",
          prop: "total",
          empty: "0",
        },
        {
          label: "占比",
          prop: "percent",
        },
      ],
      tableData: [],
      tableParams: {
        cfzt: this.cfztData,
      },
      currentItem: {},
    };
  },
  created() {},
  methods: {
    callServer(pagination) {
      return statistics;
    },
    export1() {
      const params = {};
      for (const p in this.tableParams) {
        params[p] = this.tableParams[p] || "";
      }
      const headers = [];
      const columns = [];
      this.columns.forEach((item, i) => {
        if (item.prop && item.prop != "") {
          columns.push(item.prop);
          headers.push(item.label);
        }
      });
      params.headers = headers;
      params.columns = columns;
      const name = this.cfztData == "1" ? "处分统计" : "解除处分统计";
      exportStatistics(params, name);
    },
  },
};
</script>
<style lang="scss">
.statistics-table {
  .table-wrapper {
    &.bd-line {
      table {
        &.el-table__header {
          thead {
            tr {
              th {
                display: table-cell !important;
              }
            }
          }
        }
      }
    }
    &.txt-center {
      table {
        &.el-table__header {
          thead {
            tr {
              th {
                text-align: center;
              }
            }
          }
        }
        &.el-table__body {
          tbody {
            tr {
              td {
                text-align: center;
              }
            }
          }
        }
      }
    }
  }
}
</style>
