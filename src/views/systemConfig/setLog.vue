<!-- 迎新方案管理-环节管理 -->
<template>
  <div class="table-with-tab">
    <div class="tableFiltersWrap">
      <el-row :gutter="15">
        <el-col :sm="12" :md="4">
          <el-input
            v-model="tableParams.usertruename"
            @keyup.enter.native="fecthData"
            class="input-with-search"
            placeholder="请输入操作人"
          ></el-input>
        </el-col>
        <el-col :sm="12" :md="4">
          <el-input
            v-model="tableParams.logname"
            @keyup.enter.native="fecthData"
            class="input-with-search"
            placeholder="请输入日志描述"
          ></el-input>
        </el-col>
        <el-col :sm="12" :md="4">
          <el-date-picker
            v-model="tableParams.beginTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            :editable="false"
            type="date"
            placeholder="开始日期"
          ></el-date-picker>
        </el-col>
        <el-col :sm="12" :md="4">
          <el-date-picker
            v-model="tableParams.endTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            :editable="false"
            type="date"
            placeholder="结束日期"
          ></el-date-picker>
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

import { logList } from "#/api/systemLog";

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
          label: "操作类型",
          prop: "logtype",
        },
        {
          label: "日志描述",
          prop: "logname",
        },
        {
          label: "操作人",
          prop: "usertruename",
        },
        {
          label: "类名",
          prop: "classname",
        },
        {
          label: "方法名",
          prop: "method",
        },
        {
          label: "操作时间",
          prop: "createtime",
        },
      ],
      tableData: [],
      tableParams: {},
    };
  },
  methods: {
    callServer(pagination) {
      return logList;
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
    openSaveDialog(item) {
      this.currentItem = item || {};
      this.$refs.saveDialog.dialogVisible = true;
    },
    saveItem() {
      const me = this;
      this.$refs.saveItemForm.validate((data) => {
        this.$refs.saveDialog.posting = true;
        if (this.$refs.saveItemForm.status) {
          linkEdit(data).then(() => {
            this.$refs.saveDialog.close();
            me.toast("添加成功", "success");
            me.fecthData();
          });
        } else {
          linkAdd(data).then(() => {
            this.$refs.saveDialog.close();
            me.toast("添加成功", "success");
            me.fecthData();
          });
        }
      });
    },
    del(item) {
      if (this.multipleSelection.length) {
        const me = this;
        const ids = [];
        for (let i = 0; i < this.multipleSelection.length; i++) {
          ids.push(this.multipleSelection[i].stepid);
        }
        this.alert("确定删除选中用户？", "删除", {
          type: "error",
          request() {
            return linkDelete(ids.join(","));
          },
          success() {
            me.toast("删除成功", "success");
            me.fecthData(true);
          },
        });
      } else {
        this.toast("请先选择环节", "warning");
      }
    },
  },
};
</script>
