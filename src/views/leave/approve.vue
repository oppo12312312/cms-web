<template>
  <div>
    <div class="tableFiltersWrap">
      <el-row class="txt-right">
        <el-col>
          <v-form :fields="fields" :fieldsData="tableParams">
            <el-col :span="6">
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
        <el-tabs v-model="activeName" @tab-click="tabClick">
          <el-tab-pane label="待审批" name="approve"></el-tab-pane>
          <el-tab-pane label="全部名单" name="list"></el-tab-pane>
        </el-tabs>
        <div class="btns-wrap">
          <v-table-set-btn
            :columns="columns"
            :download="exportsExecutes"
            file-name="请假数据"
            @colsChange="colsChange"
          >
          </v-table-set-btn>
          <v-btn
            v-if="activeName == 'approve'"
            class="fn-ml10"
            icon="el-icon-check"
            txt="批量审核"
            @handleClick="openSaveDialog({}, 3)"
          ></v-btn>
        </div>
      </div>
      <v-page>
        <el-row class="forItem">
          <el-col class="con">
            <v-form :fields="fields2" :fieldsData="tableParams"></v-form>
          </el-col>
        </el-row>
        <basic-table
          :columns="columns"
          :call-server="callServer"
          @selectionChange="selectionChange"
          v-model="tableParams"
          ref="basicTable"
          :query="tableQuery"
        >
        </basic-table>
      </v-page>

      <v-dialog
        ref="saveDialog"
        width="960px"
        title="请假审批"
        :show-confirm="false"
        :show-footer="activeName == 'approve' || currentItem.flag == 'yes'"
        :close-on-click="
          activeName == 'approve' || currentItem.flag == 'yes' ? false : true
        "
      >
        <approve-form
          ref="saveItemForm"
          :patch-data="currentItem"
        ></approve-form>
        <template
          slot="footer"
          slot-scope="scope"
          v-if="activeName == 'approve' || currentItem.flag == 'yes'"
        >
          <div class="disIbk fn-ml10">
            <el-button type="danger" :loading="scope.posting" @click="refuse"
              >审批拒绝</el-button
            >
            <el-button
              v-if="currentItem.status != 3"
              type="danger"
              :loading="scope.posting"
              @click="turnDown"
              >审批打回</el-button
            >
            <el-button
              type="primary"
              @click="closeProcess"
              :loading="scope.posting"
              >结束流程</el-button
            >
            <el-button
              v-if="showPass"
              type="primary"
              @click="pass"
              :loading="scope.posting"
              >审批通过</el-button
            >
            <el-button
              v-if="currentItem.status == 3"
              type="primary"
              @click="pass"
              :loading="scope.posting"
              >审批</el-button
            >
          </div>
        </template>
      </v-dialog>
      <v-dialog ref="nextStepDialog" @handleClose="saveItem" title="选择下一步">
        <next-form ref="nextForm" :props-data="nextStepData"></next-form>
      </v-dialog>
    </el-card>
  </div>
</template>

<script>
import basicTable from "_c/tables";
import approveForm from "./components/approveForm";
import nextForm from "./components/nextForm";
import { selectApprovalTrack, getStatus } from "@/api/process";
import { getCodeOptions } from "@/filters/options";

import {
  listLeaveApprove,
  leaveDetail,
  doExecute,
  doExecutes,
  exportsExecutes,
} from "@/api/leave";
export default {
  components: {
    basicTable,
    approveForm,
    nextForm,
  },
  data() {
    const activeName = this.$route.query.activeName || "approve";
    return {
      activeName: activeName,
      tableParams: {},
      multipleSelection: [],
      currentItem: {},
      nextStepData: {},
      showFields: [],
      lxOpts: [],
      resultOpts: [
        {
          label: "全部状态选项",
          value: "",
        },
      ],
      currentIndex: "0",
      steps: [],
    };
  },
  created() {
    getCodeOptions("90003").then((data) => {
      this.lxOpts = data;
    });
    getStatus("leave").then((data) => {
      for (let i = 0; i < data.data.length; i++) {
        this.resultOpts.push({
          label: data.data[i],
          value: data.data[i],
        });
      }
    });
    this.$EventBus.$on("currentApprove", (data) => {
      this.currentIndex = data.currentIndex;
      this.steps = data.steps;
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
          field: "qjsj",
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
                  onClick={() =>
                    this.openSaveDialog(
                      row,
                      this.activeName == "approve" ? "1" : "2"
                    )
                  }
                  size="middle"
                  class="txt-highlight"
                >
                  {this.activeName == "approve" ? "审核" : "查看"}
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
    tableQuery: function () {
      if (this.activeName == "approve") {
        return {
          type: "0",
        };
      } else {
        return {
          type: "1",
        };
      }
    },
    fields: function () {
      return [
        {
          label: "",
          prop: "xh",
          span: 3,
          type: "text",
          placeholder: "请输入学号",
        },
        {
          label: "",
          prop: "xm",
          span: 3,
          type: "text",
          placeholder: "请输入姓名",
        },
        /* {
          label: "",
          prop: "lastResults",
          span: 3,
          type: "select",
          placeholder: "请选择审批状态",
          show: this.activeName == "approve" ? "false" : "true",
          options: this.resultOpts,
        }, */
        {
          label: "",
          prop: "qjlx",
          span: 3,
          type: "select",
          placeholder: "请选择请假类型",
          options: this.lxOpts,
        },
      ];
    },
    fields2: function () {
      return [
        {
          label: "",
          prop: "lastResults",
          span: 3,
          type: "select",
          placeholder: "请选择审批状态",
          show: this.activeName == "approve" ? "false" : "true",
          options: this.resultOpts,
        },
      ];
    },
    showPass: function () {
      return (
        this.currentIndex < this.steps.length - 1 &&
        this.currentItem.status != 3
      );
    },
  },
  methods: {
    emitIndex(approveData) {
      this.currentIndex = approveData.currentIndex;
      this.steps = approveData.steps;
    },
    colsChange(showFields) {
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
        { type: 1 }
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
      if (this.$refs.basicTable) {
        this.tableParams = {};
        this.$refs.basicTable.reload();
      }
    },
    selectionChange(val) {
      this.multipleSelection = val;
    },
    openSaveDialog(item, status) {
      if (status == 3) {
        if (this.multipleSelection.length) {
          this.currentItem.tableData = this.multipleSelection;
          this.currentItem.columns = this.copy(this.columns).splice(
            0,
            this.columns.length - 2
          );
          this.currentItem.status = status;
          this.currentItem.businessid = this.multipleSelection[0].applyid;
          this.currentItem.defid = this.multipleSelection[0].defid;
          this.$refs.saveDialog.dialogVisible = true;
        } else {
          this.toast("请先选择一条记录", "warning");
        }
      } else {
        leaveDetail({ applyid: item.applyid }).then((data) => {
          this.currentItem = data.data.qjInfo;
          this.currentItem.flag = item.flag;
          this.currentItem.fileInfo = data.data.fileInfo;
          this.currentItem.status = status;
          this.$refs.saveDialog.dialogVisible = true;
        });
      }
    },
    saveItem() {
      const me = this;
      const query = {
        defid: this.currentItem.defid,
        spyj: this.nextStepData.spyj,
        nextstepid: this.$refs.nextForm.radio,
        status: this.nextStepData.aduitStatus,
        isRetrial: this.activeName == "approve" ? "0" : "1",
      };
      if (this.currentItem.status == 3) {
        const ids = [];
        for (let i = 0; i < this.multipleSelection.length; i++) {
          ids.push(this.multipleSelection[i].applyid);
        }
        query.ides = ids.join(",");
        doExecutes(query)
          .then(() => {
            me.$refs.nextStepDialog.close();
            me.$refs.saveDialog.close();
            me.toast("操作成功", "success");
            me.fecthData();
          })
          .catch((err) => {
            me.$refs.nextStepDialog.posting = false;
          });
      } else {
        query.businessid = this.currentItem.applyid;
        doExecute(query)
          .then(() => {
            me.$refs.nextStepDialog.close();
            me.$refs.saveDialog.close();
            me.toast("操作成功", "success");
            me.fecthData();
          })
          .catch((err) => {
            me.$refs.nextStepDialog.posting = false;
          });
      }
    },
    refuse() {
      const me = this;
      this.$refs.saveItemForm.validate((data) => {
        this.$refs.saveDialog.posting = true;
        const query = {
          defid: this.currentItem.defid,
          spyj: data.spyj,
          nextstepid: "",
          status: 2,
          isRetrial: this.activeName == "approve" ? "0" : "1",
        };
        if (this.currentItem.status == 3) {
          const ids = [];
          for (let i = 0; i < this.multipleSelection.length; i++) {
            ids.push(this.multipleSelection[i].applyid);
          }
          query.ides = ids.join(",");
          doExecutes(query)
            .then(() => {
              me.$refs.saveDialog.close();
              me.toast("操作成功", "success");
              me.fecthData();
            })
            .catch((err) => {
              me.$refs.saveDialog.posting = false;
            });
        } else {
          query.businessid = this.currentItem.applyid;
          doExecute(query)
            .then(() => {
              me.$refs.saveDialog.close();
              me.toast("操作成功", "success");
              me.fecthData();
            })
            .catch((err) => {
              me.$refs.saveDialog.posting = false;
            });
        }
      });
    },
    turnDown() {
      const me = this;
      this.$refs.saveItemForm.validate((data) => {
        this.$refs.saveDialog.posting = true;
        if (this.currentItem.status == 3) {
          selectApprovalTrack({
            defid: this.currentItem.defid,
            businessid: this.currentItem.businessid,
          }).then((data1) => {
            this.nextStepData = {
              currentIndex: 0,
              steps: data1.data.steps,
              status: "all",
              aduitStatus: "9",
              spyj: data.spyj,
            };
            this.$refs.nextStepDialog.dialogVisible = true;
          });
        } else {
          const { currentIndex, steps } = this.$refs.saveItemForm.getSteps();
          this.nextStepData = {
            currentIndex: currentIndex - 1,
            steps: steps,
            status: "prev",
            aduitStatus: "9",
            spyj: data.spyj,
          };
          this.$refs.nextStepDialog.dialogVisible = true;
        }
      });
    },
    pass() {
      const me = this;
      this.$refs.saveItemForm.validate((data) => {
        this.$refs.saveDialog.posting = true;
        if (this.currentItem.status == 3) {
          selectApprovalTrack({
            defid: this.currentItem.defid,
            businessid: this.currentItem.businessid,
          }).then((data1) => {
            this.nextStepData = {
              currentIndex: 0,
              steps: data1.data.steps,
              status: "all",
              aduitStatus: "1",
              spyj: data.spyj,
            };
            this.$refs.nextStepDialog.dialogVisible = true;
          });
        } else {
          const { currentIndex, steps } = this.$refs.saveItemForm.getSteps();
          this.nextStepData = {
            currentIndex: currentIndex - 1,
            steps: steps,
            status: "next",
            aduitStatus: "1",
            spyj: data.spyj,
          };
          this.$refs.nextStepDialog.dialogVisible = true;
        }
      });
    },
    closeProcess() {
      const me = this;
      this.$refs.saveItemForm.validate((data) => {
        this.$refs.saveDialog.posting = true;
        const query = {
          defid: this.currentItem.defid,
          spyj: data.spyj,
          nextstepid: "",
          status: 3,
          isRetrial: this.activeName == "approve" ? "0" : "1",
        };
        if (this.currentItem.status == 3) {
          const ids = [];
          for (let i = 0; i < this.multipleSelection.length; i++) {
            ids.push(this.multipleSelection[i].applyid);
          }
          query.ides = ids.join(",");
          doExecutes(query)
            .then(() => {
              me.$refs.saveDialog.close();
              me.toast("操作成功", "success");
              me.fecthData();
            })
            .catch((err) => {
              me.$refs.saveDialog.posting = false;
            });
        } else {
          query.businessid = this.currentItem.applyid;
          doExecute(query)
            .then(() => {
              me.$refs.saveDialog.close();
              me.toast("结束成功", "success");
              me.fecthData();
            })
            .catch((err) => {
              me.$refs.saveDialog.posting = false;
            });
        }
      });
    },
    tabClick(tab) {
      this.activeName = tab.name;
      this.$router.replace({
        name: this.$route.name,
        query: {
          activeName: tab.name,
        },
      });
      this.$refs.basicTable.reload();
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
  watch: {
    "tableParams.lastResults": function () {
      this.fecthData();
    },
    $route: function () {
      this.fecthData();
    },
  },
};
</script>

<style lang="scss"></style>
