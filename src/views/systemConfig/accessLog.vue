<!-- 迎新方案管理-环节管理 -->
<template>
  <div class="table-with-tab">
    <div class="tableFiltersWrap">
      <el-row :gutter="15">
        <el-col :sm="12" :md="4">
          <el-input
            v-model="tableParams.userXm"
            @keyup.enter.native="fecthData"
            class="input-with-search"
            placeholder="请输入操作人"
          ></el-input>
        </el-col>
        <el-col :sm="12" :md="6">
          <el-button type="primary" @click="fecthData()">查询</el-button>
          <el-button type="default" @click="fecthData(true)">重置</el-button>
        </el-col>
      </el-row>
    </div>
    <basic-table
      :call-server="callServer"
      @selectionChange="selectionChange"
      :columns="columns"
      v-model="tableParams"
      ref="bacsicTable"
      :muti="false"
    ></basic-table>
  </div>
</template>

<script>
import basicTable from "_c/tables/";

import { accessLogList } from "#/api/systemLog";

export default {
  components: {
    basicTable,
  },
  data() {
    return {
      currentItem: {},
      multipleSelection: [],
      columns: [
        {
          label: "操作人",
          prop: "userXm",
        },
        {
          label: "操作描述",
          prop: "content",
        },
        {
          label: "操作时间",
          prop: "logTime",
        },
      ],
      tableData: [],
      tableParams: {},
    };
  },
  methods: {
    callServer(pagination) {
      return accessLogList;
    },
    fecthData(keep) {
      if (keep) {
        this.tableParams = {};
      }
      this.$refs.bacsicTable.fecthData(keep);
    },
    selectionChange(val) {
      this.multipleSelection = val;
    },
    handleTabClick(tab) {
      this.fecthData();
    },
  },
};
</script>
