<template>
  <v-dialog
    ref="saveDialog"
    width="960px"
    title="请假审批"
    :show-confirm="false"
    :show-footer="showFooter"
    :close-on-click="closeOnClick"
  >
    <el-form
      size="medium"
      :model="ruleForm"
      status-icon
      ref="saveItemForm"
      :rules="rules"
      label-width="auto"
    >
      <slot v-if="patchData.status != 3"></slot>
      <el-card
        v-if="patchData.status == 1 || patchData.status == 3"
        class="box-card fn-mt15"
        shadow="never"
      >
        <div slot="header" class="clearfix">
          <span class="tle">审核意见</span>
        </div>
        <el-form-item label="审核意见：" prop="spyj">
          <el-input
            type="textarea"
            @keyup.enter.native="keyUpSubmit"
            v-model="ruleForm.spyj"
            autocomplete="off"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
      </el-card>
      <basic-table
        v-if="patchData.status == 3"
        :columns="patchData.columns"
        :props-data="patchData.tableData"
        :muti="false"
        ref="basicTable"
      >
      </basic-table>
    </el-form>
    <template slot="footer" slot-scope="scope" v-if="showFooter">
      <div class="disIbk fn-ml10">
        <el-button type="danger" :loading="scope.posting" @click="refuse"
          >审批拒绝</el-button
        >
        <el-button
          v-if="patchData.status != 3"
          type="danger"
          :loading="scope.posting"
          @click="turnDown"
          >审批打回</el-button
        >
        <el-button type="primary" @click="closeProcess" :loading="scope.posting"
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
          v-if="patchData.status == 3"
          type="primary"
          @click="pass"
          :loading="scope.posting"
          >审批</el-button
        >
      </div>
    </template>
    <v-dialog ref="nextStepDialog" @handleClose="saveItem" title="选择下一步">
      <next-form ref="nextForm" :props-data="nextStepData"></next-form>
    </v-dialog>
  </v-dialog>
</template>
<script>
import formMinxin from "_c/forms/minxins/formMinxin.js";
import basicTable from "_c/tables";
import { selectApprovalTrack, getStatus } from "@/api/process";

export default {
  mixins: [formMinxin],
  components: {
    basicTable,
  },
  props: {
    patchData: Object,
    showFooter: Boolean,
    closeOnClick: Boolean,
    defid: String,
  },
  data() {
    return {
      student: {},
      ruleForm: {
        spyj: "",
      },
      rules: {
        spyj: [{ required: true, message: `请输入审核意见`, trigger: "blur" }],
      },
    };
  },
  methods: {
    getSteps() {
      return this.$refs.leaveDetail.getSteps();
    },
    show() {
      this.$refs.saveDialog.dialogVisible = true;
    },
    saveItem() {
      const me = this;
      const query = {
        defid: this.defid,
        spyj: this.nextStepData.spyj,
        nextstepid: this.$refs.nextForm.radio,
        status: this.nextStepData.aduitStatus,
        isRetrial: this.showFooter ? "0" : "1",
      };
      if (this.patchData.status == 3) {
        const ids = [];
        for (let i = 0; i < this.multipleSelection.length; i++) {
          ids.push(this.multipleSelection[i].applyid);
        }
        query.ides = ids.join(",");
        this.patchData
          .doExecutes(query)
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
        query.businessid = this.patchData.applyid;
        this.patchData
          .doExecute(query)
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
      this.$refs.saveItemForm.validate().then((valid) => {
        if (valid) {
          this.$refs.saveDialog.posting = true;
          const query = {
            defid: this.defid,
            spyj: data.spyj,
            nextstepid: "",
            status: 2,
            isRetrial: this.showFooter ? "0" : "1",
          };
          if (this.patchData.status == 3) {
            const ids = [];
            for (let i = 0; i < this.multipleSelection.length; i++) {
              ids.push(this.multipleSelection[i].applyid);
            }
            query.ides = ids.join(",");
            this.patchData
              .doExecutes(query)
              .then(() => {
                me.$refs.saveDialog.close();
                me.toast("操作成功", "success");
                me.fecthData();
              })
              .catch((err) => {
                me.$refs.saveDialog.posting = false;
              });
          } else {
            query.businessid = this.patchData.applyid;
            this.patchData
              .doExecute(query)
              .then(() => {
                me.$refs.saveDialog.close();
                me.toast("操作成功", "success");
                me.fecthData();
              })
              .catch((err) => {
                me.$refs.saveDialog.posting = false;
              });
          }
        }
      });
    },
    turnDown() {
      const me = this;
      this.$refs.saveItemForm.validate().then((valid) => {
        if (valid) {
          this.$refs.saveDialog.posting = true;
          if (this.patchData.status == 3) {
            selectApprovalTrack({
              defid: this.defid,
              businessid: this.patchData.businessid,
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
        }
      });
    },
    pass() {
      const me = this;
      this.$refs.saveItemForm.validate().then((valid) => {
        if (valid) {
          this.$refs.saveDialog.posting = true;
          if (this.patchData.status == 3) {
            selectApprovalTrack({
              defid: this.defid,
              businessid: this.patchData.businessid,
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
        }
      });
    },
    closeProcess() {
      const me = this;
      this.$refs.saveItemForm.validate().then((valid) => {
        if (valid) {
          this.$refs.saveDialog.posting = true;
          const query = {
            defid: this.defid,
            spyj: data.spyj,
            nextstepid: "",
            status: 3,
            isRetrial: this.showFooter ? "0" : "1",
          };
          if (this.patchData.status == 3) {
            const ids = [];
            for (let i = 0; i < this.multipleSelection.length; i++) {
              ids.push(this.multipleSelection[i].applyid);
            }
            query.ides = ids.join(",");
            this.patchData
              .doExecutes(query)
              .then(() => {
                me.$refs.saveDialog.close();
                me.toast("操作成功", "success");
                me.fecthData();
              })
              .catch((err) => {
                me.$refs.saveDialog.posting = false;
              });
          } else {
            query.businessid = this.patchData.applyid;
            this.patchData
              .doExecute(query)
              .then(() => {
                me.$refs.saveDialog.close();
                me.toast("结束成功", "success");
                me.fecthData();
              })
              .catch((err) => {
                me.$refs.saveDialog.posting = false;
              });
          }
        }
      });
    },
  },
};
</script>
<style lang="scss">
.set-form {
  .el-checkbox {
    margin-right: 5px;
  }
}
</style>
