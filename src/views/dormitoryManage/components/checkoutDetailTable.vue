<template>
  <div class="check-in-table">
    <basic-table
      v-model="tableParams"
      @selectionChange="selectionChange"
      ref="basicTable"
      :muti="false"
      :call-server="callServer"
      :columns="columns"
    >
      <div slot="tableHeader" class="txt-right">
        <v-form :fields="fields" :fieldsData="tableParams">
          <el-col :span="4" class="txt-left">
            <el-button type="primary" @click="fecthData()">查询</el-button>
            <el-button type="default" @click="reloadData">清空</el-button>
          </el-col>
        </v-form>
        <v-table-set-btn
          file-name="宿舍清空明细"
          :download="exportsExecutes"
          :columns="columns"
          @colsChange="colsChange"
        ></v-table-set-btn>
      </div>
    </basic-table>
    <v-dialog
      :show-footer="false"
      width="720px"
      ref="stuDialog"
      title="学生详情"
    >
      <student-info ref="studentInfo" :patch-data="currentItem"></student-info>
    </v-dialog>
  </div>
</template>
<script>
import basicTable from "_c/tables";
import {
  batchDetailList,
  exportBatchDetailList,
} from "@/projects/hbmu-suguan/api/sgRoomassignClear";
import { mapGetters, mapActions } from "vuex";
import studentInfo from "../components/studentInfo.vue";

export default {
  props: {
    patchData: Object,
  },
  components: {
    basicTable,
    studentInfo,
  },
  data() {
    return {
      currentItem: {},
      tableParams: {
        batchId: this.patchData.batchId,
      },
      multipleSelection: [],
      showFields: [],
    };
  },
  created() {},
  computed: {
    ...mapGetters(["xbOpts"]),
    columns: function () {
      const cols = [
        {
          label: "学号",
          prop: "xh",
        },
        {
          label: "姓名",
          prop: "xm",
          render: (h, row) => {
            return (
              <el-button
                type="text"
                onClick={() => this.openStuDialog(row)}
                size="middle"
                class="txt-highlight"
              >
                {row.xm}
              </el-button>
            );
          },
        },
        {
          label: "性别",
          prop: "xb",
        },
        {
          label: "原因",
          prop: "checkoutReason",
        },
        {
          label: "退宿时间",
          prop: "checkoutTime",
          width: "120px",
          render: (h, row) => {
            return (
              <div>
                {row.checkoutTime ? row.checkoutTime.substr(0, 10) : ""}
              </div>
            );
          },
        },
        {
          label: "详细地址",
          width: "160px",
          prop: "fullname",
        },
        {
          label: this.lang_college,
          prop: "xy",
        },
        {
          label: "年级",
          prop: "nj",
        },
        {
          label: "班级",
          prop: "bjmc",
        },
        {
          label: "操作人",
          prop: "creator",
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
    fields() {
      const me = this;
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
          prop: "xb",
          span: 4,
          type: "select",
          placeholder: "请选择性别",
          options: this.xbOpts,
        },
        {
          label: "",
          span: 8,
          type: "xyzybj",
          layout: ["xy", "bj"],
        },
      ];
    },
  },
  watch: {
    patchData: function () {
      this.init(this.patchData);
    },
  },
  methods: {
    ...mapActions(["getOpts"]),
    init() {
      this.initForm(this.patchData);
    },
    callServer() {
      return batchDetailList;
    },
    selectionChange(val) {
      this.multipleSelection = val;
    },
    fecthData(keep) {
      this.$refs.basicTable.fecthData();
    },
    reloadData() {
      this.tableParams = {};
      this.$refs.basicTable.reload();
    },
    colsChange(showFields) {
      this.showFields = showFields;
    },
    exportsExecutes(fields, filename) {
      return exportBatchDetailList(
        Object.assign(this.tableParams, {
          excelDtos: fields,
        }),
        filename
      );
    },
    openStuDialog(item) {
      this.currentItem = item || {};
      this.$refs.stuDialog.dialogVisible = true;
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
