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
    <el-card shadow="never" class="card-header-tabs">
      <div slot="header" class="clearfix">
        <el-tabs v-model="activeName" @tab-click="tabClick">
          <el-tab-pane label="校内学生" name="1"></el-tab-pane>
          <el-tab-pane label="校外学生" name="2"></el-tab-pane>
          <el-tab-pane label="未住宿学生" name="3"></el-tab-pane>
        </el-tabs>
        <div class="btns-wrap">
          <v-table-set-btn
            file-name="学生名单"
            :download="exportsExcel"
            :columns="columns"
            @colsChange="colsChange"
          >
          </v-table-set-btn>

          <v-btn
            v-if="isEdit && activeName == '2'"
            class="fn-ml10"
            type="add"
            @handleClick="openSaveDialog"
          ></v-btn>
          <v-btn
            v-if="isEdit && activeName == '2'"
            type="del"
            txt="删除"
            @handleClick="del"
          ></v-btn>
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
    <v-dialog
      width="720px"
      ref="saveDialog"
      @handleClose="saveItem"
      title="新增学生"
    >
      <save-stu-form
        ref="saveItemForm"
        :patch-data="currentItem"
        type="校外学生"
      ></save-stu-form>
    </v-dialog>
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
import {
  listAll,
  listXN,
  listXW,
  listOther,
  listNS,
  update,
  add,
  deleteStu,
  exportsSginfo,
} from "@/projects/hbmu-suguan/api/studentInfo";
import { getXueyuanOptions } from "@/filters/options";
import basicTable from "_c/tables";
import minxin from "./minxin/";
import { getOptTxt, getCodeOptions } from "@/filters/options";
import saveStuForm from "_c/forms/saveStuForm";
import studentInfo from "../components/studentInfo.vue";
export default {
  mixins: [minxin],
  components: {
    basicTable,
    saveStuForm,
    studentInfo,
  },
  data() {
    const activeName = this.$route.query.activeName || "1";
    return {
      activeName: activeName,
      tableParams: {},
      multipleSelection: [],
      deptOptions: [],
      currentItem: {},
      showFields: [],
      queryAct: "学生信息查询",
      cflxOpts: [],
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
          prop: "xh",
          span: 4,
          type: "text",
          placeholder: "输入学号",
        },
        {
          label: "",
          prop: "xm",
          span: 4,
          type: "text",
          placeholder: "输入姓名",
        },
        {
          label: "",
          span: 12,
          type: "xyzybj",
          layout: ["xy", "zy", "bj"],
        },
        {
          label: "",
          prop: "nj",
          span: 4,
          type: "date",
          dType: "year",
          format: "yyyy",
          formate: "yyyy",
          placeholder: "选择年级",
        },
        {
          label: "",
          prop: "zjhm",
          span: 4,
          type: "text",
          placeholder: "输入身份证号",
        },
        {
          label: "",
          prop: "mz",
          span: 4,
          type: "select",
          placeholder: "请选择民族",
          options: this.mzOpts,
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
          prop: "zzmm",
          span: 4,
          type: "select",
          placeholder: "请选择政治面貌",
          options: this.zzmmOpts,
        },
      ];
    },
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
          label: this.lang_college,
          prop: "xy",
        },
        {
          label: "专业",
          prop: "zy",
        },
        {
          label: "班级名称",
          prop: "bjmc",
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
          label: "联系电话",
          prop: "lxdh",
        },
        {
          label: "培养层次",
          prop: "pycc",
        },
        {
          label: "民族",
          prop: "mz",
        },
        {
          label: "辅导员",
          prop: "fdy",
        },
      ];
      if (this.isEdit && this.activeName == "2") {
        cols.push({
          label: "操作",
          fixed: "right",
          width: "100px",
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
  created() {
    getXueyuanOptions().then((data) => {
      this.deptOptions = data;
    });
    getCodeOptions("10018", true).then((data) => {
      this.cflxOpts = data;
    });
  },
  methods: {
    callServer(pagination) {
      if (this.activeName == "1") {
        return listXN;
      } else if (this.activeName == "2") {
        return listXW;
      } else if (this.activeName == "3") {
        return listNS;
      }
    },
    fecthData() {
      if (this.$refs.basicTable) {
        this.$refs.basicTable.fecthData();
      }
    },
    tabClick(tab) {
      this.activeName = tab.name;
      this.$router.replace({
        name: this.$route.name,
        query: {
          activeName: tab.name,
        },
      });
      this.tableParams.sfzx = tab.name;
      this.$refs.basicTable.reload();
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
      let queryType = 0;
      let checkinFlag = "";
      switch (this.activeName) {
        case "1":
          queryType = 0;
          break;
        case "2":
          queryType = 1;
          break;
        case "3":
          queryType = 3;
          checkinFlag = 0;
          break;
      }
      return exportsSginfo(
        Object.assign(this.tableParams, {
          excelDtos: fields,
          queryType: queryType,
          checkinFlag: checkinFlag,
        }),
        filename
      );
    },
    exportsForm() {
      if (this.multipleSelection.length == 1) {
        exportsForm(
          { studentId: this.multipleSelection[0].studentId },
          "个人登记表"
        );
      } else {
        this.toast("请先选择一名学生", "warning");
      }
    },
    queryClick() {
      this.reloadData();
    },
    openSaveDialog(item) {
      this.currentItem = item || {};
      this.$refs.saveDialog.dialogVisible = true;
    },
    openStuDialog(item) {
      this.currentItem = item || {};
      this.$refs.stuDialog.dialogVisible = true;
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
    del(item) {
      if (this.multipleSelection.length) {
        const me = this;
        const ids = [];
        for (let i = 0; i < this.multipleSelection.length; i++) {
          ids.push(this.multipleSelection[i].infoId);
        }
        me.alert("确定删除选中学生？", "删除", {
          type: "error",
          request() {
            return deleteStu(ids);
          },
          success() {
            me.toast("删除成功", "success");
            me.fecthData();
          },
        });
      } else {
        this.toast("请先选择至少一项", "warning");
      }
    },
  },
};
</script>
