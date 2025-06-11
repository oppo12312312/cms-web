<template>
  <div>
    <div class="tableFiltersWrap">
      <el-row class="txt-right">
        <el-col>
          <v-form :fields="fields" :fieldsData="tableParams">
            <el-col :span="8">
              <v-xyzybj-select
                :layout="['xy', 'bj']"
                v-model="tableParams"
              ></v-xyzybj-select>
            </el-col>
            <el-col :span="4" class="txt-left">
              <el-button type="primary" @click="fecthData">查询</el-button>
              <el-button type="default" @click="reloadData">清空</el-button>
            </el-col>
          </v-form>
        </el-col>
      </el-row>
    </div>
    <el-card shadow="never" class="card-header-tabs">
      <div slot="header" class="clearfix">
        <div class="txt-right fn-pr15">
          <v-table-set-btn
            file-name="请假数据"
            :download="exportsExecutes"
            :columns="columns"
            @colsChange="colsChange"
          ></v-table-set-btn>
        </div>
      </div>
      <v-page>
        <basic-table
          :columns="columns"
          :call-server="callServer"
          @selectionChange="selectionChange"
          v-model="tableParams"
          :query="{
            type: 2,
          }"
          ref="basicTable"
        >
        </basic-table>
        <v-dialog
          ref="saveDialog"
          width="840px"
          title="请假详情"
          :show-confirm="false"
          :show-footer="false"
          :close-on-click="true"
        >
          <approve-form
            ref="saveItemForm"
            :patch-data="currentItem"
          ></approve-form>
        </v-dialog>
      </v-page>
    </el-card>
  </div>
</template>

<script>
import basicTable from "_c/tables";
import approveForm from "./components/approveForm";
import { getCodeOptions } from "@/filters/options";

import { listLeaveApprove, leaveDetail, exportsExecutes } from "@/api/leave";
export default {
  components: {
    basicTable,
    approveForm,
  },
  data() {
    return {
      lxOpts: [],
      tableParams: {
        zzspzt: "1",
      },
      multipleSelection: [],
      currentItem: {},
      nextStepData: {},
      showFields: [],
    };
  },
  created() {
    getCodeOptions("90003").then((data) => {
      this.lxOpts = data;
    });
  },
  computed: {
    columns: function () {
      const cols = [
        {
          label: "学号",
          prop: "xh",
        },
        {
          label: "姓名",
          prop: "xm",
        },
        {
          label: this.lang_college,
          prop: "xy",
        },
        {
          label: "班级",
          prop: "bjmc",
        },
        {
          label: "请假类型",
          prop: "qjlx",
        },
        {
          label: "请假原因",
          prop: "qjyy",
        },
        {
          label: "请假时间",
          width: "320px",
          render: (h, row) => {
            return <div>{this.dateTimeRangeFormate(row.qssj, row.zzsj)}</div>;
          },
        },
        {
          label: "请假天数",
          prop: "qjts",
          empty: "0",
        },
        {
          label: "审批状态",
          prop: "lastResults",
        },
        {
          label: "操作",
          fixed: "right",
          width: "80px",
          render: (h, row) => {
            return (
              <div>
                <el-button
                  type="text"
                  onClick={() => this.openSaveDialog(row, "2")}
                  size="middle"
                  class="txt-highlight"
                >
                  查看
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
    fields: function () {
      return [
        {
          label: "",
          prop: "xh",
          span: 4,
          type: "text",
          placeholder: "请输入学号",
        },
        {
          label: "",
          prop: "xm",
          span: 4,
          type: "text",
          placeholder: "请输入姓名",
        },
        {
          label: "",
          prop: "qjlx",
          span: 4,
          type: "select",
          placeholder: "请选择请假类型",
          options: this.lxOpts,
        },
      ];
    },
  },
  methods: {
    colsChange(showFields) {
      console.log(1);
      this.showFields = showFields;
    },
    callServer(pagination) {
      return listLeaveApprove;
    },
    exportsExecutes(fields, filename) {
      return exportsExecutes(
        Object.assign(this.tableParams, {
          excelDtos: fields,
        }),
        filename,
        { type: 2 }
      );
    },
    save() {
      const me = this;
      const roleids = this.ruleForm.resourceids;
      grantRole({
        userId: me.currentItem.userid,
        roleids: roleids.join(","),
      }).then((data) => {
        me.toast("操作成功", "success");
      });
    },
    cancel() {
      this.showRight = false;
    },
    fecthData() {
      if (this.$refs.basicTable) {
        this.$refs.basicTable.fecthData();
      }
    },
    reloadData() {
      this.tableParams = {
        zzspzt: "1",
      };
      this.$refs.basicTable.reload();
    },
    selectionChange(val) {
      this.multipleSelection = val;
    },
    openSaveDialog(item, status) {
      leaveDetail({ applyid: item.applyid }).then((data) => {
        this.currentItem = data.data.qjInfo;
        this.currentItem.fileInfo = data.data.fileInfo;
        this.currentItem.status = status;
        this.$refs.saveDialog.dialogVisible = true;
      });
    },
    del(item) {
      const me = this;
      const dels = [];
      const ids = [];
      if (this.multipleSelection.length) {
        for (const ml of this.multipleSelection) {
          dels.push(ml.bjmc);
          ids.push(ml.id);
        }
        this.alert("取消任命：" + dels.join(",") + "。", "确认要取消任命吗？", {
          type: "warning",
          request() {
            return disAppointFdy({
              bjids: ids,
            });
          },
          success() {
            me.toast("取消成功", "success");
            me.fecthData1();
          },
        });
      } else {
        this.toast("请选择一名辅导员", "warning");
      }
    },
  },
};
</script>

<style lang="scss"></style>
