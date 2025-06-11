<!-- 迎新方案管理-环节管理 -->
<template>
  <v-page>
    <el-card shadow="never">
      <div slot="header" class="clearfix">
        <el-row :gutter="15">
          <el-col :sm="12" :md="4">
            <el-input
              v-model="tableParams.userXm"
              @keyup.enter.native="fecthData"
              class="input-with-search"
              placeholder="请输入操作人"
            ></el-input>
          </el-col>
          <el-col :sm="12" :md="4">
            <el-button type="primary" @click="fecthData()">查询</el-button>
          </el-col>
        </el-row>
      </div>
      <basic-table
        :call-server="callServer"
        @selectionChange="selectionChange"
        :columns="columns"
        ref="bacsicTable"
        :muti="false"
        v-model="tableParams"
      >
      </basic-table>
    </el-card>
  </v-page>
</template>

<script>
import basicTable from "_c/tables/";

import { listAccess } from "@/api/systemlog";

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
      return listAccess;
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
