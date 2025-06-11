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
              file-name="宿舍信息"
              :download="exportsExecutes"
              :columns="columns"
              :params="tableParams"
              :fields="fields"
              @colsChange="colsChange"
            ></v-table-set-btn>
          </div>
        </div>
        <basic-table
          :muti="false"
          v-model="tableParams"
          @selectionChange="selectionChange"
          ref="basicTable"
          :call-server="callServer"
          :columns="columns"
        ></basic-table>
      </el-card>
    </div>
    <v-dialog
      width="840px"
      ref="saveDialog"
      @handleClose="saveItem"
      title="安排学生入住"
      :show-footer="false"
    >
      <check-in-table
        @close="fecthData"
        :patch-data="currentItem"
        ref="checkInTable"
      ></check-in-table>
      <!-- <check-out-form
        :patch-data="currentItem"
        ref="checkOutForm"
        @closed="fecthData"
      ></check-out-form> -->
    </v-dialog>
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
import minxin from "../minxins/minxin";
import { getOptTxt } from "@/filters/options";
import {
  listRooms,
  listBeds,
  exportRooms,
} from "@/projects/hbmu-suguan/api/sgStudentRoom";
export default {
  components: {
    basicTable,
    domTree,
    checkInTable,
    checkOutForm,
  },
  mixins: [minxin],
  data() {
    return {
      isEdit: false,
      loading: false,
      resources: [],
      tableParams: {},
      currentItem: {},
      showFields: [],
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
          label: "宿舍",
          prop: "fullname",
          width: "120px",
        },
        {
          label: "床位数量",
          prop: "bedTotal",
        },
        {
          label: "收费标准",
          prop: "charge",
        },
        {
          label: "性别属性",
          prop: "roomSex",
        },
        {
          label: "已住人数",
          prop: "checkin",
          empty: "0",
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
          label: "学制",
          prop: "xz",
        },
        {
          label: "是否满员",
          render: (h, row) => {
            return (
              <span>{getOptTxt(this.fullStatusOpts, row.fullStatus)}</span>
            );
          },
        },
        {
          label: "操作",
          fixed: "right",
          width: "160px",
          render: (h, row) => {
            return (
              <div>
                <el-button
                  type="text"
                  onClick={() => this.openSaveDialog(row)}
                  size="middle"
                  class="txt-highlight"
                >
                  安排入住
                </el-button>
                <el-button
                  type="text"
                  onClick={() => this.openSaveDialog1(row)}
                  size="middle"
                  class="txt-highlight"
                >
                  整房退宿
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
        {
          label: "",
          prop: "roomSex",
          span: 6,
          type: "select",
          placeholder: "请选择性别属性",
          options: this.xbOpts,
        },
        {
          label: "",
          prop: "fullStatus",
          span: 6,
          type: "select",
          placeholder: "是否满员",
          options: this.fullStatusOpts,
        },
        {
          label: "",
          prop: "xz",
          span: 6,
          type: "select",
          placeholder: "请选择学制",
          options: this.xzOpts,
        },
      ];
    },
  },
  methods: {
    ...mapActions(["getOpts"]),
    exportsExecutes(fields, filename) {
      return exportRooms(
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
      return listRooms;
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
      this.currentItem = item || {};
      this.$refs.saveDialog.dialogVisible = true;
    },
    openSaveDialog1(item) {
      this.currentItem = item || {};
      this.currentItem.aptLevel = "room";
      this.currentItem.aptId = item.roomId;
      this.currentItem.tsType = "overall";
      this.$refs.checkOutForm.show();
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
