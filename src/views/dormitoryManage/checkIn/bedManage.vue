<template>
  <v-page :has-left="true">
    <template #left>
      <el-card shadow="never">
        <div slot="header" class="clearfix">
          <span class="txt-bold">宿舍信息</span>
        </div>
        <div>
          <dom-tree ref="domTree" @handleNodeClick="handleNodeClick"></dom-tree>
        </div>
      </el-card>
    </template>
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
      <el-card shadow="never" class="card-header-tabs">
        <div slot="header" class="clearfix">
          <div class="txt-right fn-pr15">
            <v-table-set-btn
              file-name="学生床位信息"
              :download="exportsExecutes"
              :columns="columns"
              :params="tableParams"
              :fields="fields"
              @colsChange="colsChange"
            >
              <v-import-btn
                @uploaded="fecthData"
                importid="importRoomassign"
                filename="学生床位名单导入模板"
              ></v-import-btn>
              <el-button type="default" @click="openSaveDialog2"
                >批量退宿</el-button
              >
            </v-table-set-btn>
          </div>
        </div>
        <basic-table
          v-model="tableParams"
          @selectionChange="selectionChange"
          ref="basicTable"
          :call-server="callServer"
          :columns="columns"
        ></basic-table>
      </el-card>
    </div>
    <v-dialog
      width="720px"
      ref="saveDialog"
      @handleClose="saveItem"
      title="安排学生入住"
      :show-footer="false"
    >
      <check-in-table
        :patch-data="currentItem"
        ref="checkInTable"
      ></check-in-table>
    </v-dialog>
    <distribution-form
      :patch-data="currentItem"
      ref="distributionForm"
    ></distribution-form>
    <check-out-form
      :patch-data="currentItem"
      ref="checkOutForm"
      @closed="fecthData"
    ></check-out-form>
  </v-page>
</template>

<script>
import domTree from "../components/domTree";
import basicTable from "_c/tables";
import checkInTable from "../components/checkInTable";
import checkOutForm from "../components/checkOutForm";
import { mapGetters, mapActions } from "vuex";
import distributionForm from "../components/distributionForm";

import {
  listStudents,
  exportStudents,
} from "@/projects/hbmu-suguan/api/sgStudentBed";
export default {
  components: {
    basicTable,
    domTree,
    checkInTable,
    checkOutForm,
    distributionForm,
  },
  data() {
    return {
      isEdit: false,
      loading: false,
      resources: [],
      tableParams: {},
      currentItem: {},
      showFields: [],
      multipleSelection: [],
    };
  },
  created() {
    this.getOpts(["xbOpts"]);
  },
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
        },
        {
          label: "性别",
          prop: "xb",
        },
        {
          label: "院系",
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
          label: "年级",
          prop: "nj",
        },
        {
          label: "民族",
          prop: "mz",
        },
        {
          label: "宿舍",
          prop: "fullname",
          width: "160px",
        },
        // {
        //   label: "辅导员",
        //   prop: "fullStatus",
        // },
        // {
        //   label: "辅导员电话",
        //   prop: "fullStatus",
        // },
        {
          label: "操作",
          fixed: "right",
          width: "120px",
          render: (h, row) => {
            return (
              <div>
                <el-button
                  type="text"
                  onClick={() => this.openSaveDialog(row)}
                  size="middle"
                  class="txt-highlight"
                >
                  宿舍调整
                </el-button>
                <el-button
                  type="text"
                  onClick={() => this.openSaveDialog1(row)}
                  size="middle"
                  class="txt-highlight"
                >
                  退宿
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
          span: 6,
          type: "text",
          placeholder: "请输入学号",
          prop: "xh",
        },
        {
          label: "",
          span: 6,
          type: "text",
          placeholder: "请输入姓名",
          prop: "xm",
        },
        {
          label: "",
          span: 6,
          type: "xyzybj",
          layout: ["xy"],
        },
        {
          label: "",
          prop: "nj",
          span: 6,
          type: "date",
          dType: "year",
          format: "yyyy",
          formate: "yyyy",
          placeholder: "选择年级",
        },
      ];
    },
  },
  methods: {
    ...mapActions(["getOpts"]),
    exportsExecutes(fields, filename) {
      return exportStudents(
        Object.assign(this.tableParams, {
          excelDtos: fields,
        }),
        filename
      );
    },
    colsChange(showFields) {
      this.showFields = showFields;
    },
    handleNodeClick(node) {
      this.currentNode = node;
      this.tableParams.aptId = node.aptId == "node0" ? "" : node.aptId;
      this.tableParams.aptLevel = node.aptLevel;
      this.fecthData();
    },
    callServer() {
      return listStudents;
    },
    selectionChange(val) {
      this.multipleSelection = val;
    },
    fecthData(keep) {
      this.$refs.basicTable.fecthData();
    },
    reloadData() {
      this.tableParams = {};
      this.$refs.basicTable.reload({
        aptId: this.currentNode.aptId,
        aptLevel: this.currentNode.aptLevel,
      });
    },
    openSaveDialog(item) {
      // this.currentItem = item || {};
      // this.$refs.saveDialog.dialogVisible = true;
      this.currentItem = item || {};

      this.$refs.distributionForm.show();
    },
    openSaveDialog1(item) {
      this.currentItem = item || {};
      this.$set(this.currentItem, "tsType", "single");
      this.$refs.checkOutForm.show();
    },
    openSaveDialog2() {
      if (this.multipleSelection.length) {
        this.currentItem.selected = this.multipleSelection;
        this.$set(this.currentItem, "tsType", "many");
        this.$refs.checkOutForm.show();
      } else {
        this.toast("请先选择至少一项", "warning");
        return false;
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
              me.$refs.domTree();
            })
            .catch((err) => {
              this.$refs.saveDialog.posting = false;
            });
        } else {
          console.log(data.files, oData);
          // addCampus(data.files, oData)
          //   .then(() => {
          //     this.$refs.saveDialog.close();
          //     me.toast("添加成功", "success");
          //     me.fecthData();
          //   })
          //   .catch((err) => {
          //     this.$refs.saveDialog.posting = false;
          //   });
        }
      });
    },
  },
};
</script>
