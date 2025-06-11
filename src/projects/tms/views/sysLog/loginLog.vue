<!-- 迎新方案管理-环节管理 -->
<template>
  <div>
    <div class="tableFiltersWrap">
      <el-row class="txt-right">
        <el-col>
          <v-form :fields="fields" :fieldsData="tableParams">
            <el-col :span="4" class="txt-left">
              <el-button type="primary" @click="fecthData">查询</el-button>
              <el-button type="default" @click="reloadData">清空</el-button>
            </el-col>
          </v-form>
        </el-col>
      </el-row>
    </div>
    <v-page>
      <el-card shadow="never">
        <basic-table
          :call-server="callServer"
          :columns="columns"
          ref="bacsicTable"
          :muti="false"
          v-model="tableParamsCopy"
          :height="height"
        >
        </basic-table>
      </el-card>
    </v-page>
  </div>
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
      columns: [
        {
          label: "用户账号",
          prop: "userXm",
          render: (h, row) => {
            return (
              <div style="height:40px;line-height:40px;">{row.userXm}</div>
            );
          },
        },
        {
          label: "登录地点",
          prop: "place",
        },
        {
          label: "登录ip地址",
          prop: "ip",
        },
        {
          label: "操作系统",
          prop: "osname",
        },
        {
          label: "登录状态",
          prop: "status",
        },
        {
          label: "提示消息",
          prop: "content",
        },
        {
          label: "访问时间",
          prop: "logTime",
          render: (h, row) => {
            return (
              <div style="height:40px;line-height:40px;">{row.logTime}</div>
            );
          },
        },
      ],
      tableData: [],
      tableParams: {},
      height: window.innerHeight - 258,
    };
  },
  created() {
    window.addEventListener("resize", this.handleResize);
  },
  destroyed() {
    window.removeEventListener("resize", this.handleResize);
  },
  computed: {
    tableParamsCopy() {
      const params = {};
      if (this.tableParams.userXm) {
        params.userXm = this.tableParams.userXm;
      }
      if (this.tableParams.place) {
        params.place = this.tableParams.place;
      }
      if (this.tableParams.status) {
        params.status = this.tableParams.status;
      }
      if (
        this.tableParams.createTime &&
        this.tableParams.createTime.length == 2
      ) {
        params.beginTime = this.tableParams.createTime[0];
        params.endTime = this.tableParams.createTime[1];
      }
      return params;
    },
    fields() {
      return [
        {
          label: "",
          prop: "userXm",
          span: 4,
          type: "text",
          placeholder: "请输入用户账号",
        },
        {
          label: "",
          prop: "place",
          span: 4,
          type: "text",
          placeholder: "请输入登录地点",
        },
        {
          label: "",
          prop: "status",
          span: 4,
          type: "select",
          placeholder: "请选择登录状态",
          options: [
            { label: "成功", value: "成功" },
            { label: "失败", value: "失败" },
          ],
        },
        {
          label: "",
          prop: "createTime",
          span: 8,
          type: "daterange",
          sPlaceholder: "开始时间",
          ePlaceholder: "结束时间",
        },
      ];
    },
  },
  methods: {
    handleResize() {
      this.height = window.innerHeight - 258;
    },
    callServer() {
      return listAccess;
    },
    fecthData() {
      this.$refs.bacsicTable.fecthData();
    },
    reloadData() {
      this.tableParams = {};
      this.$refs.basicTable.reload();
    },
  },
};
</script>
