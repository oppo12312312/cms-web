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
    <el-card shadow="never">
      <div slot="header" class="clearfix">
        <div class="txt-right">
          <div class="btns-wrap">
            <v-table-set-btn
              file-name="宿舍清空批次"
              :download="exportsExcel"
              :columns="columns"
              @colsChange="colsChange"
            >
            </v-table-set-btn>

            <v-btn
              v-if="isEdit"
              class="fn-ml10"
              type="add"
              @handleClick="openSaveDialog"
            ></v-btn>
            <!-- <v-btn
            v-if="isEdit"
            type="del"
            txt="删除"
            @handleClick="del"
          ></v-btn> -->
          </div>
        </div>
      </div>
      <v-page>
        <div class="text item">
          <basic-table
            ref="basicTable"
            :columns="columns"
            :call-server="callServer"
            @selectionChange="selectionChange"
            v-model="tableParams"
          >
          </basic-table>
        </div>
      </v-page>
    </el-card>
    <v-dialog ref="saveDialog" @handleClose="saveItem" title="新增退宿信息">
      <save-clear-form
        ref="saveItemForm"
        :patch-data="currentItem"
      ></save-clear-form>
    </v-dialog>
    <v-dialog
      ref="detailDialog"
      title="查看明细"
      width="1100px"
      :show-footer="false"
    >
      <checkout-detail-table
        ref="checkoutDetailTable"
        :patch-data="currentItem"
      ></checkout-detail-table>
    </v-dialog>
  </div>
</template>

<script>
import {
  batchList,
  batchDetailList,
  add,
  restore,
  exportBatchList,
  exportBatchDetailList,
} from "@/projects/hbmu-suguan/api/sgRoomassignClear";
import basicTable from "_c/tables";
import saveClearForm from "../components/saveClearForm";
import checkoutDetailTable from "../components/checkoutDetailTable";
export default {
  components: {
    basicTable,
    saveClearForm,
    checkoutDetailTable,
  },
  data() {
    const activeName = this.$route.query.activeName || "1";
    return {
      activeName: activeName,
      tableParams: {},
      multipleSelection: [],
      currentItem: {},
      showFields: [],
    };
  },
  computed: {
    isEdit: function () {
      return !this.$route.meta.isQuery;
    },
    fields: function () {
      return [
        {
          label: "",
          prop: "xm",
          span: 4,
          type: "text",
          placeholder: "输入批次名称",
        },
      ];
    },
    columns: function () {
      const cols = [
        {
          label: "宿舍范围",
          prop: "aptName",
        },
        {
          label: "学生范围",
          prop: "studentScope",
          render(h, row) {
            return (
              <span>{row.studentScope == "all" ? "全部学生" : "毕业生"}</span>
            );
          },
        },
        {
          label: "退宿原因",
          prop: "clearReason",
        },
        {
          label: "操作时间",
          prop: "clearTime",
        },
      ];
      if (this.isEdit) {
        cols.push({
          label: "操作",
          fixed: "right",
          width: "140px",
          render: (h, row) => {
            return (
              <div>
                <el-button
                  type="text"
                  onClick={() => this.openDetailDialog(row)}
                  size="middle"
                  class="txt-highlight"
                >
                  查看明细
                </el-button>
                <el-button
                  type="text"
                  onClick={() => this.restore(row)}
                  size="middle"
                  class="txt-highlight"
                >
                  恢复
                </el-button>
              </div>
            );
          },
        });
      }
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
  },
  created() {},
  methods: {
    callServer(pagination) {
      return batchList;
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
    colsChange(showFields) {
      this.showFields = showFields;
    },
    exportsExcel(fields, filename) {
      return exportBatchList(
        Object.assign(this.tableParams, {
          excelDtos: fields,
        }),
        filename
      );
    },
    openSaveDialog(item) {
      this.currentItem = item || {};
      this.$refs.saveDialog.dialogVisible = true;
    },
    openDetailDialog(item) {
      this.currentItem = item || {};
      this.$refs.detailDialog.dialogVisible = true;
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
    restore(item) {
      const me = this;
      me.alert("确定恢复选中学生？", "恢复", {
        type: "warning",
        request() {
          return restore({ batchId: item.batchId });
        },
        success() {
          me.toast("恢复成功", "success");
          me.fecthData();
        },
      });
    },
  },
};
</script>
