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

import { listOp } from "@/api/systemlog";

export default {
  components: {
    basicTable,
  },
  data() {
    return {
      currentItem: {},
      columns: [
        {
          label: "模块标题",
          prop: "logname",
        },
        {
          label: "业务类型",
          prop: "logtype",
        },
        {
          label: "操作人",
          prop: "usertruename",
        },
        {
          label: "请求地址",
          prop: "requestUrl",
        },
        {
          label: "请求方式",
          prop: "requestMethod",
        },
        {
          label: "操作地点",
          prop: "sourceIp",
        },
        {
          label: "操作类别",
          prop: "opType",
        },
        {
          label: "请求参数",
          prop: "requestParam",
          width: 400,
        },
        {
          label: "操作状态",
          prop: "succeed",
          render: (h, row) => {
            const dist = {
              200: "成功",
              403: "无权限",
              500: "失败",
            };
            return (
              <div style="height:40px;line-height:40px;">
                {dist[row.succeed] || "未知"}
              </div>
            );
          },
        },
        {
          label: "操作时间",
          prop: "createtime",
          width: 180,
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
      if (this.tableParams.logname) {
        params.logname = this.tableParams.logname;
      }
      if (this.tableParams.usertruename) {
        params.usertruename = this.tableParams.usertruename;
      }
      if (this.tableParams.logtype) {
        params.logtype = this.tableParams.logtype;
      }
      if (this.tableParams.succeed) {
        params.succeed = this.tableParams.succeed;
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
          prop: "logname",
          span: 4,
          type: "text",
          placeholder: "请输入模块标题",
        },
        {
          label: "",
          prop: "usertruename",
          span: 3,
          type: "text",
          placeholder: "请输入操作人",
        },
        {
          label: "",
          prop: "logtype",
          span: 3,
          type: "text",
          placeholder: "请输入业务类型",
        },
        {
          label: "",
          prop: "succeed",
          span: 3,
          type: "select",
          placeholder: "请选择操作状态",
          options: [
            { label: "无权限", value: "403" },
            { label: "成功", value: "200" },
            { label: "失败", value: "500" },
          ],
        },
        {
          label: "",
          prop: "createTime",
          span: 6,
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
      return listOp;
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
