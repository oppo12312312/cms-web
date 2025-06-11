<template>
  <div>
    <div class="tableFiltersWrap">
      <el-row class="txt-right">
        <el-col>
          <v-form :fields="fields" :fieldsData="tableParams">
            <el-col :span="6" class="txt-left">
              <el-button type="primary" @click="fecthData">查询</el-button>
              <el-button type="default" @click="reloadData">清空</el-button>
            </el-col>
          </v-form>
        </el-col>
      </el-row>
    </div>
    <v-page>
      <el-card shadow="never" class="card-header-tabs">
        <div slot="header" class="clearfix">
          <div class="txt-right fn-pr15">
            <v-table-set-btn
              file-name="宿位调整记录"
              :download="exportsExecutes"
              :columns="columns"
              :params="tableParams"
              :fields="fields"
              @colsChange="colsChange"
            >
            </v-table-set-btn>
            <v-btn
              class="fn-ml10"
              type="add"
              @handleClick="openSaveDialog"
            ></v-btn>
          </div>
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
    </v-page>
    <v-dialog ref="saveDialog" @handleClose="saveItem" title="添加批次">
      <save-batch-form
        ref="saveItemForm"
        :patch-data="currentItem"
      ></save-batch-form>
    </v-dialog>
    <v-dialog :show-footer="false" width="960px" ref="yxfpDialog" title="分配">
      <yxfp-table ref="yxfpTable" :patch-data="currentItem"></yxfp-table>
    </v-dialog>
    <v-dialog
      :show-footer="false"
      width="960px"
      ref="yxfptzDialog"
      title="查看分配"
    >
      <yxfptz-table ref="yxfptzTable" :patch-data="currentItem"></yxfptz-table>
    </v-dialog>
  </div>
</template>

<script>
import {
  batchList,
  exportBatchList,
  batchAdd,
  batchDelete,
  batchUpdate,
  preDeptDetail,
  preRangeApartmentList,
  preRangeBed,
  preRangeBedList,
  preRangeRoomList,
  preRangeFloorList,
} from "@/projects/hbmu-suguan/api/sgPreRange";
import { mapGetters, mapActions } from "vuex";
import basicTable from "_c/tables";
import saveBatchForm from "../components/saveBatchForm";
import yxfpTable from "../components/yxfpTable";
import yxfptzTable from "../components/yxfptzTable";

export default {
  components: {
    basicTable,
    saveBatchForm,
    yxfpTable,
    yxfptzTable,
  },
  created() {
    this.getOpts(["xbOpts"]);
  },
  data() {
    return {
      tableParams: {},
      showFields: [],
      currentItem: {},
    };
  },
  computed: {
    ...mapGetters(["xbOpts"]),
    columns: function () {
      const cols = [
        {
          label: "批次名称",
          prop: "settingName",
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
          label: "开始时间",
          prop: "startTime",
          render: (h, row) => {
            return <span>{row.startTime.substr(0, 10)}</span>;
          },
        },
        {
          label: "结束时间",
          prop: "endTime",
          render: (h, row) => {
            return <span>{row.endTime.substr(0, 10)}</span>;
          },
        },
        {
          label: "是否开放",
          prop: "openStatus",
        },
        {
          label: "操作",
          fixed: "right",
          width: "180px",
          render: (h, row) => {
            return (
              <div>
                <el-button
                  type="text"
                  onClick={() => this.openFpDialog(row)}
                  size="middle"
                  class="txt-highlight"
                >
                  分配
                </el-button>
                <el-button
                  type="text"
                  onClick={() => this.openTzDialog(row)}
                  size="middle"
                  class="txt-highlight"
                >
                  查看
                </el-button>
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
                  onClick={() => this.del(row)}
                  size="middle"
                  class="txt-highlight"
                >
                  删除
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
    fields() {
      return [
        {
          label: "",
          prop: "settingName",
          span: 6,
          type: "text",
          placeholder: "请输入批次名称",
        },
      ];
    },
  },
  methods: {
    ...mapActions(["getOpts"]),
    exportsExecutes(fields, filename) {
      return exportBatchList(
        Object.assign(this.tableParams, {
          excelDtos: fields,
        }),
        filename
      );
    },
    colsChange(showFields) {
      this.showFields = showFields;
    },
    callServer(pagination) {
      return batchList;
    },
    fecthData() {
      this.$refs.basicTable.fecthData();
    },
    reloadData() {
      this.tableParams = {};
      this.$refs.basicTable.reload();
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
    openSaveDialog(item) {
      this.currentItem = item || {};
      this.$refs.saveDialog.dialogVisible = true;
    },
    openFpDialog(item) {
      this.currentItem = item || {};
      this.$refs.yxfpDialog.dialogVisible = true;
    },
    openTzDialog(item) {
      this.currentItem = item || {};
      this.$refs.yxfptzDialog.dialogVisible = true;
    },
    saveItem() {
      const me = this;
      this.$refs.saveItemForm.validate((data) => {
        this.$refs.saveDialog.posting = true;
        if (this.$refs.saveItemForm.status) {
          batchUpdate(data)
            .then(() => {
              this.$refs.saveDialog.close();
              me.toast("修改成功", "success");
              me.fecthData();
            })
            .catch((err) => {
              this.$refs.saveDialog.posting = false;
            });
        } else {
          batchAdd(data)
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
    del(item) {
      const me = this;
      const dels = [];
      const ids = [];
      if (item) {
        dels.push(item.settingName);
        ids.push(item.settingId);
      } else {
        if (this.multipleSelection.length) {
          for (const ml of this.multipleSelection) {
            dels.push(ml.settingName);
            ids.push(ml.settingId);
          }
        }
      }
      this.alert("删除批次：" + dels.join(",") + "。", "确认要进行删除吗？", {
        type: "warning",
        request() {
          return batchDelete({ settingId: ids.join(",") });
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
