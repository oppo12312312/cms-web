<template>
  <v-page>
    <el-card shadow="never">
      <div slot="header" class="clearfix">
        <el-row>
          <el-col class="txt-right">
            <v-btn
              type="add"
              @handleClick="$router.push({ name: 'leaveStuInfo' })"
            ></v-btn>
          </el-col>
        </el-row>
      </div>
      <div class="text item">
        <basic-table
          ref="basicTable"
          :columns="columns"
          :call-server="callServer"
          @selectionChange="selectionChange"
          v-model="tableParams"
        ></basic-table>
      </div>
      <v-dialog
        ref="saveDialog"
        width="820px"
        @handleClose="saveItem"
        :show-footer="
          isEmptyObject(currentItem) || currentItem.isPatch ? true : false
        "
        :title="
          isEmptyObject(currentItem)
            ? '请假申请'
            : currentItem.isPatch
            ? '请假修改'
            : '请假详情'
        "
        :close-on-click="
          isEmptyObject(currentItem) || currentItem.isPatch ? false : true
        "
      >
        <save-leave-form
          ref="saveItemForm"
          :patch-data="currentItem"
        ></save-leave-form>
      </v-dialog>
    </el-card>
  </v-page>
</template>

<script>
import {
  leaveList,
  saveOrUpdate,
  leaveDetail,
  deleteQJApply,
} from "@/api/leave";
import basicTable from "_c/tables";
import saveLeaveForm from "../components/saveLeaveForm";
export default {
  components: {
    basicTable,
    saveLeaveForm,
  },
  data() {
    return {
      tableParams: {},
      fields: [
        {
          label: "",
          prop: "truename",
          span: 6,
          type: "text",
          placeholder: "输入姓名",
        },
        {
          label: "",
          prop: "username",
          span: 6,
          type: "text",
          placeholder: "输入用户名",
        },
        {
          label: "",
          prop: "deptname",
          span: 6,
          type: "text",
          placeholder: "输入部门",
        },
      ],
      columns: [
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
            return <span>{this.dateTimeRangeFormate(row.qssj, row.zzsj)}</span>;
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
          render: (h, row) => {
            return (
              <div>
                <el-button
                  type="text"
                  onClick={() => this.openSaveDialog(row)}
                  size="middle"
                  class="txt-highlight"
                >
                  查看详情
                </el-button>
                <el-button
                  type="text"
                  onClick={() => this.openSaveDialog(row, true)}
                  size="middle"
                  class={
                    row.flag == "yes"
                      ? "txt-highlight"
                      : "txt-highlight displayNone"
                  }
                >
                  修改
                </el-button>
                <el-button
                  type="text"
                  onClick={() => this.del(row)}
                  size="middle"
                  class={
                    row.flag == "yes"
                      ? "txt-highlight"
                      : "txt-highlight displayNone"
                  }
                >
                  删除
                </el-button>
              </div>
            );
          },
        },
      ],
      currentItem: {},
    };
  },
  methods: {
    callServer(pagination) {
      return leaveList;
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
    handleNodeClick(node) {
      if (node.children) {
        this.currentNode = node;
        this.fecthData(node.id);
      }
    },
    openSaveDialog(item, isPatch) {
      if (item) {
        leaveDetail({ applyid: item.applyid }).then((data) => {
          this.currentItem = data.data.qjInfo;
          this.currentItem.isPatch = isPatch;
          this.currentItem.fileInfo = data.data.fileInfo;
          this.$refs.saveDialog.dialogVisible = true;
        });
      } else {
        this.currentItem = {};
        this.$refs.saveDialog.dialogVisible = true;
      }
    },
    saveItem() {
      const me = this;
      this.$refs.saveItemForm.validate((data) => {
        const oData = {};
        for (const key in data) {
          if (key != "files" && data[key] != "null") {
            oData[key] = data[key];
          }
        }
        this.$refs.saveDialog.posting = true;
        if (this.$refs.saveItemForm.status) {
          saveOrUpdate(data.files, oData)
            .then(() => {
              this.$refs.saveDialog.close();
              me.toast("修改成功", "success");
              me.fecthData();
            })
            .catch((err) => {
              this.$refs.saveDialog.posting = false;
            });
        } else {
          saveOrUpdate(data.files, oData)
            .then(() => {
              this.$refs.saveDialog.close();
              me.toast("申请成功", "success");
              me.fecthData();
            })
            .catch((err) => {
              this.$refs.saveDialog.posting = false;
            });
        }
      });
    },
    del(item) {
      const me = this;
      this.alert("删除请假。", "确认要进行删除吗？", {
        type: "warning",
        request() {
          return deleteQJApply({
            applyId: item.applyid,
          });
        },
        success() {
          me.toast("删除成功", "success");
          me.fecthData();
        },
      });
    },
  },
};
</script>
