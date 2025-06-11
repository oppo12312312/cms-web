<template>
  <v-page>
    <el-card shadow="never">
      <div slot="header" class="clearfix">
        <el-row>
          <el-col class="txt-right">
            <v-btn
              type="add"
              @handleClick="$router.push({ name: 'stuCardbbInfo' })"
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
    </el-card>
    <v-dialog
      ref="saveDialog"
      width="920px"
      @handleClose="saveItem"
      :show-footer="
        isEmptyObject(currentItem) || currentItem.isPatch ? true : false
      "
      :title="
        isEmptyObject(currentItem)
          ? '新增申请'
          : currentItem.isPatch
          ? '修改申请'
          : '申请详情'
      "
      :close-on-click="
        isEmptyObject(currentItem) || currentItem.isPatch ? false : true
      "
    >
      <save-card-form
        ref="saveItemForm"
        :userid="userInfo.userId"
        :patch-data="currentItem"
      ></save-card-form>
    </v-dialog>
  </v-page>
</template>

<script>
import {
  stdApproveList,
  exportsExcel,
  stdApproveDelete,
  stdApproveAddOrUpdate,
  stdApproveDetail,
} from "@/api/studentCard";
import basicTable from "_c/tables";
import saveCardForm from "../components/saveCardForm";
export default {
  components: {
    basicTable,
    saveCardForm,
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
          label: "学年",
          prop: "xn",
        },
        {
          label: "学期",
          prop: "xq",
        },
        {
          label: "补办原因",
          prop: "blyy",
        },
        {
          label: "最终审批状态",
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
      return stdApproveList;
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
        stdApproveDetail({ applyid: item.applyid }).then((data) => {
          this.currentItem = data.data;
          this.currentItem.isPatch = isPatch;
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
        this.$refs.saveDialog.posting = true;
        if (this.$refs.saveItemForm.status) {
          stdApproveAddOrUpdate(data)
            .then(() => {
              this.$refs.saveDialog.close();
              me.toast("修改成功", "success");
              me.fecthData();
            })
            .catch((err) => {
              this.$refs.saveDialog.posting = false;
            });
        } else {
          stdApproveAddOrUpdate(data)
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
          return stdApproveDelete({
            applyid: item.applyid,
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
