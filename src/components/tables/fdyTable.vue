<template>
  <basic-table
    ref="basicTable"
    :columns="columns"
    :call-server="callServer"
    @selectionChange="selectionChange"
    v-model="tableParams"
  >
    <div slot="tableHeader" class="txt-right">
      <v-form :fields="fields" :fieldsData="tableParams">
        <el-col :span="4" class="txt-left">
          <el-button type="primary" @click="fecthData">查询</el-button>
        </el-col>
      </v-form>
    </div>
  </basic-table>
</template>

<script>
import { add, edit, deleteFdy, fdyInfoList, detail } from "@/api/xgAssFdy";
import basicTable from "_c/tables";
import {
  getOptTxt,
  getDeptsListOptions,
  getXueyuanOptions,
} from "@/filters/options";
export default {
  components: {
    basicTable,
  },
  data() {
    return {
      tableParams: {
        // truename: "",
        // username: "",
        // deptname: "",
      },
      deptOptions: [],
      columns: [
        {
          label: "职工号",
          prop: "zgh",
        },
        {
          label: "姓名",
          prop: "xm",
        },
        {
          label: "所在部门",
          render: (h, row) => {
            return <span>{getOptTxt(this.deptOptions, row.departId)}</span>;
          },
        },
        {
          label: "入党年月",
          prop: "rdny",
        },
        {
          label: "民族",
          prop: "mz",
        },
        {
          label: "出生年月",
          prop: "csny",
        },
        {
          label: "报到日期",
          prop: "csfdygzsj",
        },
        {
          label: "微信",
          prop: "wxh",
        },
        {
          label: "宿舍房号",
          prop: "ssfh",
        },
        {
          label: "籍贯",
          prop: "jg",
        },
        {
          label: "辅导员类型",
          render: (h, row) => {
            return <div>{row.gwly == 1 ? "教工" : "学生"}</div>;
          },
        },
        {
          label: "电话号码",
          prop: "sj",
        },
      ],
    };
  },
  computed: {
    fields: function () {
      return [
        {
          label: "",
          prop: "xm",
          span: 6,
          type: "text",
          placeholder: "输入姓名",
        },
        {
          label: "",
          prop: "zgh",
          span: 6,
          type: "text",
          placeholder: "输入职工号",
        },
        {
          label: "",
          prop: "departId",
          span: 6,
          type: "selectDialog",
          placeholder: "选择部门",
          empty: "暂时没有部门",
          selectData: this.deptOptions,
        },
      ];
    },
  },
  created() {
    getXueyuanOptions().then((data) => {
      this.deptOptions = data;
    });
  },
  methods: {
    callServer(pagination) {
      return fdyInfoList;
    },
    fecthData(keep) {
      if (keep) {
        this.tableParams = {};
      }
      this.$refs.basicTable.fecthData();
    },
    selectionChange(val) {
      this.multipleSelection = val;
    },
  },
};
</script>
