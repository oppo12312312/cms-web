<template>
  <div>
    <div class="tableFiltersWrap">
      <el-row class="txt-right">
        <el-col>
          <v-form :fields="fields" :fieldsData="tableParams">
            <el-col :span="6" class="txt-left">
              <el-button type="primary" @click="fecthData">查询</el-button>
              <el-button type="default" @click="reloadData">重置</el-button>
            </el-col>
          </v-form>
        </el-col>
      </el-row>
    </div>
    <div class="table-with-tab">
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
      width="960px"
      @handleClose="saveItem"
      :title="isEmptyObject(currentItem) ? '新增任务调度' : '修改任务调度'"
    >
      <save-task-form
        ref="saveItemForm"
        :patch-data="currentItem"
        @keyUpSubmit="saveItem"
      ></save-task-form>
    </v-dialog>
    <v-dialog
      ref="detailsDialog"
      width="960px"
      @handleClose="saveItem"
      title="任务详情"
      :showFooter="false"
    >
      <task-details-form
        ref="detailsItemForm"
        :patch-data="detailsItem"
      ></task-details-form>
    </v-dialog>
  </div>
</template>

<script>
import basicTable from "_c/tables";
import formMinxin from "_c/forms1/minxins/formMinxin.js";
import { list, update, del, manual } from "@/api/scheduleJob";
import saveTaskForm from "./components/saveTaskForm";
import taskDetailsForm from "./components/taskDetailsForm";
export default {
  mixins: [formMinxin],
  props: {
    patchData: Object,
    patchId: String,
  },
  components: {
    basicTable,
    saveTaskForm,
    taskDetailsForm,
  },
  data() {
    return {
      tableParams: {},
      currentItem: {},
      detailsItem: {},
      subsysOpts: [],
      columns: [
        {
          label: "任务名称",
          minWidth: "150",
          prop: "name",
        },
        {
          label: "子系统名称",
          minWidth: "100",
          prop: "subsystem",
        },
        {
          label: "执行命令",
          prop: "execCommand",
        },
        {
          label: "实现方式",
          prop: "implType",
        },
        {
          label: "定时器类型",
          minWidth: "100",
          render: (h, row) => {
            switch (row.scheduleType) {
              case "cron":
                return <span>cron表达式</span>;
                break;
              case "fixedDelay":
                return <span>固定延迟</span>;
                break;
              case "fixedRate":
                return <span>固定频率</span>;
                break;
            }
          },
        },
        {
          label: "定时器表达式",
          minWidth: "115",
          render: (h, row) => {
            switch (row.scheduleType) {
              case "cron":
                return <span>{row.expression}</span>;
                break;
              case "fixedDelay":
                return <span>{row.expression}秒</span>;
                break;
              case "fixedRate":
                return <span>{row.expression}秒</span>;
                break;
            }
          },
        },
        {
          label: "任务状态",
          render: (h, row) => {
            switch (row.status) {
              case "open":
                return <span class="txt-success">开启</span>;
                break;
              case "close":
                return <span class="txt-danger">关闭</span>;
                break;
            }
          },
        },
        {
          label: "是否中断后启动立刻执行一次",
          minWidth: "150",
          render: (h, row) => {
            switch (row.triggerOnAbort) {
              case true:
                return <span class="txt-success">是</span>;
                break;
              case false:
                return <span class="txt-danger">否</span>;
                break;
            }
          },
        },
        {
          label: "创建时间",
          minWidth: "120",
          prop: "createTime",
        },
        {
          label: "更新时间",
          minWidth: "120",
          prop: "updateTime",
        },
        {
          label: "生效时间",
          minWidth: "120",
          prop: "effectiveTime",
        },
        {
          label: "失效时间",
          minWidth: "120",
          prop: "expireTime",
        },
        {
          label: "备注",
          prop: "remark",
        },
        {
          label: "操作",
          fixed: "right",
          width: "240px",
          render: (h, row) => {
            return (
              <div>
                <el-button
                  type="text"
                  onClick={() => this.openSaveDialog(row)}
                  size="middle"
                  class="txt-highlight"
                >
                  修改
                </el-button>
                <el-button
                  type="text"
                  onClick={() => this.deleteTask(row)}
                  size="middle"
                  class="txt-highlight"
                >
                  删除
                </el-button>
                <el-button
                  type="text"
                  onClick={() => this.manualTask(row)}
                  size="middle"
                  class="txt-highlight"
                >
                  手动执行
                </el-button>
                <el-button
                  type="text"
                  onClick={() => this.openDetailsDialog(row)}
                  size="middle"
                  class="txt-highlight"
                >
                  查看详情
                </el-button>
              </div>
            );
          },
        },
      ],
    };
  },
  computed: {
    fields: function () {
      return [
        {
          label: "",
          placeholder: "请输入任务名称",
          prop: "keyword",
          span: 6,
          type: "text",
        },
      ];
    },
  },
  created() {},
  methods: {
    callServer() {
      return list;
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
    openSaveDialog(item) {
      this.currentItem = item || {};
      this.$refs.saveDialog.dialogVisible = true;
    },
    openDetailsDialog(item) {
      this.detailsItem = item || {};
      this.$refs.detailsDialog.dialogVisible = true;
    },
    isEmptyObject(item) {
      return JSON.stringify(item) == "{}";
    },
    saveItem() {
      const me = this;
      this.$refs.saveItemForm.validate((data) => {
        this.$refs.saveDialog.posting = true;
        if (this.$refs.saveItemForm.status) {
          update(data)
            .then(() => {
              this.$refs.saveDialog.close();
              me.toast("修改成功", "success");
              me.fecthData();
            })
            .catch((err) => {
              this.$refs.saveDialog.posting = false;
            });
        } else {
          add(data)
            .then(() => {
              this.$refs.saveDialog.close();
              me.toast("添加成功", "success");
              me.fecthData();
            })
            .catch((err) => {
              this.$refs.saveDialog.posting = false;
            });
        }
      });
    },
    deleteTask(item) {
      const me = this;
      this.alert("确定删除选中任务？", "删除", {
        type: "error",
        request() {
          return del({ id: item.id });
        },
        success() {
          me.toast("删除成功", "success");
          me.fecthData(true);
        },
      });
    },
    manualTask(item) {
      const me = this;
      this.alert("确定立即执行一次同步任务？", "执行", {
        type: "warning",
        request() {
          return manual({ jobid: item.id });
        },
        success() {
          me.toast("执行成功", "success");
        },
      });
    },
  },
  watch: {
    patchId: function () {},
  },
};
</script>
