<template>
  <div class="check-in-table">
    <el-tag v-if="patchData.fullname" style="width: 100%">{{
      "房间：" + patchData.fullname
    }}</el-tag>
    <basic-table
      v-model="tableParams"
      @selectionChange="selectionChange"
      ref="basicTable"
      :muti="false"
      :call-server="callServer"
      :columns="columns1"
    ></basic-table>
    <check-out-form
      :patch-data="currentItem"
      ref="checkOutForm"
      @closed="fecthData"
    ></check-out-form>
    <v-dialog
      width="720px"
      ref="saveDialog"
      @handleClose="saveItem"
      title="安排入住"
      :show-footer="false"
    >
      <basic-table
        v-model="tableParams1"
        @selectionChange="selectionChange1"
        ref="basicTable1"
        :call-server="callServer1"
        :columns="columns2"
        :muti="false"
      >
        <div slot="tableHeader" class="txt-right">
          <v-form :fields="fields1" :fieldsData="tableParams1">
            <el-col :span="6" class="txt-left">
              <el-button type="primary" @click="fecthData1()">查询</el-button>
              <el-button type="default" @click="reloadData1()">清空</el-button>
            </el-col>
          </v-form>
        </div>
      </basic-table>
    </v-dialog>
    <distribution-form
      :patch-data="currentItem"
      ref="distributionForm"
    ></distribution-form>
  </div>
</template>
<script>
import basicTable from "_c/tables";
import checkOutForm from "./checkOutForm";
import distributionForm from "./distributionForm";
import { listAllNS } from "@/projects/hbmu-suguan/api/studentInfo";
import { listBeds } from "@/projects/hbmu-suguan/api/sgStudentRoom";
import { roomAssign } from "@/projects/hbmu-suguan/api/sgRoomassign";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "checkInTable",
  props: {
    patchData: Object,
    isOperate: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    basicTable,
    checkOutForm,
    distributionForm,
  },
  data() {
    return {
      currentItem: {},
      tableParams: {
        roomId: this.patchData.roomId,
      },
      tableParams1: {},
      fields: [
        {
          label: "退宿时间：",
          prop: "bh",
          type: "date",
          placeholder: "请选择退宿时间",
          span: 12,
        },
        {
          label: "退宿原因：",
          prop: "checkoutReason",
          type: "select",
          placeholder: "请选择退宿原因",
          span: 12,
          options: this.tsyyOpts,
        },
        {
          label: "扣除押金：",
          prop: "remark",
          type: "text",
          span: 12,
        },
        {
          label: "扣除原因：",
          prop: "remark",
          type: "text",
          span: 12,
        },
      ],
      multipleSelection1: [],
      fields1: [
        {
          label: "",
          prop: "xh",
          span: 6,
          type: "text",
          placeholder: "请输入学号",
        },
        {
          label: "",
          prop: "xm",
          span: 6,
          type: "text",
          placeholder: "请输入姓名",
        },
        {
          label: "",
          type: "xyzybj",
          span: 6,
          layout: ["xy"],
        },
      ],
    };
  },
  created() {
    this.getOpts(["tsyyOpts"]);
  },
  computed: {
    ...mapGetters(["tsyyOpts"]),
    columns: function () {
      const cols = [
        {
          label: "学号",
          prop: "xh",
          empty: "空床",
        },
        {
          label: "姓名",
          prop: "xm",
          empty: "空床",
        },
        {
          label: "性别",
          prop: "xb",
          empty: "空床",
        },
        {
          label: "院系",
          prop: "xy",
        },
        {
          label: "班级",
          prop: "bjmc",
        },
      ];
      return cols;
    },
    columns1: function () {
      const cols = this.copy(this.columns);
      if (this.isOperate) {
        cols.push({
          label: "操作",
          fixed: "right",
          width: "100px",
          render: (h, row) => {
            if (row.emptyFlag == "空床") {
              return (
                <div>
                  <el-button
                    type="text"
                    onClick={() => this.openSaveDialog1(row)}
                    size="middle"
                    class="txt-highlight"
                  >
                    安排入住
                  </el-button>
                </div>
              );
            } else {
              return (
                <div>
                  <el-button
                    type="text"
                    onClick={() => this.openSaveDialog(row)}
                    size="middle"
                    class="txt-highlight"
                  >
                    退宿
                  </el-button>
                  <el-button
                    type="text"
                    onClick={() => this.openSaveDialog2(row)}
                    size="middle"
                    class="txt-highlight"
                  >
                    调整
                  </el-button>
                </div>
              );
            }
          },
        });
      }
      return cols;
    },
    columns2: function () {
      const cols = this.copy(this.columns);
      if (this.isOperate) {
        cols.push({
          label: "操作",
          fixed: "right",
          width: "100px",
          render: (h, row) => {
            return (
              <div>
                <el-button
                  type="text"
                  onClick={() => this.checkIn(row)}
                  size="middle"
                  class="txt-highlight"
                >
                  安排入住
                </el-button>
              </div>
            );
          },
        });
      }
      return cols;
    },
  },
  watch: {
    patchData: function () {
      (this.tableParams.roomId = this.patchData.roomId), this.init();
    },
  },
  methods: {
    ...mapActions(["getOpts"]),
    init() {
      this.fecthData();
      //this.initForm(this.patchData);
    },
    show() {
      this.$refs.saveDialog.dialogVisible = true;
    },
    callServer() {
      return listBeds;
    },
    callServer1() {
      return listAllNS;
    },
    selectionChange(val) {
      this.multipleSelection = val;
    },
    selectionChange1(val) {
      this.multipleSelection1 = val;
    },
    fecthData(keep) {
      this.$refs.basicTable.fecthData();
    },
    reloadData() {
      this.tableParams = {};
      this.$refs.basicTable.reload();
    },
    fecthData1(keep) {
      this.$refs.basicTable1.fecthData();
    },
    reloadData1() {
      this.tableParams = {};
      this.$refs.basicTable1.reload();
    },
    openSaveDialog(item) {
      this.currentItem = item || {};
      this.$set(this.currentItem, "tsType", "single");
      this.$refs.checkOutForm.show();
    },
    openSaveDialog1(item) {
      this.currentItem = item || {};
      this.tableParams1.xb = this.patchData.roomSex;
      this.$refs.saveDialog.dialogVisible = true;
    },
    openSaveDialog2(item) {
      this.currentItem = item || {};

      this.$refs.distributionForm.show();
    },
    saveItem() {
      const me = this;
      this.$refs.ruleForm.validate().then((valid) => {
        if (valid) {
          this.$refs.saveDialog.posting = true;
          if (this.tsType == "overall") {
            checkout(this.ruleForm)
              .then(() => {
                this.$refs.saveDialog.close();
                me.toast("操作成功", "success");
                me.$emit("closed");
              })
              .catch((err) => {
                this.$refs.saveDialog.posting = false;
              });
          } else {
            checkoutByBeds(this.ruleForm)
              .then(() => {
                this.$refs.saveDialog.close();
                me.toast("操作成功", "success");
                me.$emit("closed");
              })
              .catch((err) => {
                this.$refs.saveDialog.posting = false;
              });
          }
        }
      });
    },
    checkIn(item) {
      const me = this;
      this.alert("安排该学生入住？", "确认", {
        type: "warning",
        request() {
          return roomAssign({
            bedId: me.currentItem.bedId,
            xh: item.xh,
            infoId: item.infoId,
          });
        },
        success() {
          me.toast("安排成功", "success");
          me.$refs.basicTable.fecthData();
          me.$refs.saveDialog.close();
        },
      });
    },
  },
};
</script>
<style lang="scss">
.check-in-table {
  .pagination-wrapper {
    display: none;
  }
}
</style>
