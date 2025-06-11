<template>
  <div>
    <div class="tableFiltersWrap">
      <el-row class="txt-right">
        <el-col>
          <v-form :fields="fields" :fieldsData="tableParams">
            <el-col :span="4" class="txt-left">
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
            file-name="学生总评成绩"
            :download="exportsExecutes"
            :columns="columns"
            @colsChange="colsChange"
          >
            <v-import-btn
              v-if="isEdit"
              @uploaded="fecthData"
              importid="importStdSumscore"
              filename="学生总评成绩导入模板"
            ></v-import-btn>
          </v-table-set-btn>
          <v-btn
            v-if="isEdit"
            class="fn-ml10"
            type="add"
            @handleClick="openSaveDialog"
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
        <v-dialog
          ref="saveDialog"
          width="900px"
          @handleClose="saveItem"
          :title="isEmptyObject(currentItem) ? '新增学生成绩' : '修改学生成绩'"
        >
          <save-general-score-form
            ref="saveItemForm"
            :patch-data="currentItem"
          ></save-general-score-form>
        </v-dialog>
      </v-page>
    </el-card>
  </div>
</template>
<script>
import { list, add, edit, exportsExcel } from "@/api/stdSumscore";
import { getXueyuanOptions } from "@/filters/options";
import basicTable from "_c/tables";
import saveGeneralScoreForm from "./components/saveGeneralScoreForm";

export default {
  components: {
    basicTable,
    saveGeneralScoreForm,
  },
  data() {
    return {
      tableParams: {
        // truename: "",
        // username: "",
        // deptname: "",
      },
      multipleSelection: [],
      deptOptions: [],
      currentItem: {},
      showFields: [],
    };
  },
  computed: {
    isEdit: function () {
      return !this.$route.meta.isQuery;
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
          // render: (h, row) => {
          //   return (
          //     <el-button
          //       type="text"
          //       onClick={() =>
          //         this.$router.push({
          //           name: "studentInfoSave",
          //           query: {
          //             studentId: row.studentId,
          //           },
          //         })
          //       }
          //       size="middle"
          //       class="txt-highlight"
          //     >
          //       {row.xm}
          //     </el-button>
          //   );
          // },
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
          label: "班级名称",
          prop: "bjmc",
        },
        {
          label: "学年",
          prop: "xn",
        },
        {
          label: "学期",
          prop: "xq",
        },
        {
          label: "总学分",
          prop: "zxf",
        },
        {
          label: "平均绩点",
          prop: "pjjd",
        },
        {
          label: "班级排名",
          prop: "pm",
        },
        {
          label: "班级人数",
          prop: "bjrs",
        },
        {
          label: "专业排名",
          prop: "zypm",
        },
        {
          label: "专业人数",
          prop: "zyrs",
        },
      ];
      if (this.isEdit) {
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
    fields: function () {
      return [
        {
          label: "",
          prop: "xh",
          span: 3,
          type: "text",
          placeholder: "输入学号",
        },
        {
          label: "",
          prop: "xm",
          span: 3,
          type: "text",
          placeholder: "输入姓名",
        },
        {
          label: "",
          prop: "nj",
          span: 3,
          type: "date",
          dType: "year",
          format: "yyyy",
          formate: "yyyy",
          placeholder: "选择年级",
        },
        {
          label: "",
          span: 6,
          type: "xyzybj",
          layout: ["xy", "bj"],
        },
      ];
    },
  },
  created() {
    getXueyuanOptions().then((data) => {
      this.deptOptions = data;
    });
  },
  methods: {
    callServer(pagination) {
      return list;
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
    exportsExecutes(fields, filename) {
      const headers = [];
      const columns = [];
      fields.forEach((item, i) => {
        if (item.column && item.column != "") {
          columns.push(item.column);
          headers.push(item.header);
        }
      });
      return exportsExcel(
        Object.assign(this.tableParams, {
          excelDtos: fields,
        }),
        filename
      );
    },
    openSaveDialog(item) {
      if (item) {
        this.currentItem = item;
      } else {
        this.currentItem = {};
      }
      this.$refs.saveDialog.dialogVisible = true;
    },
    openDetailDialog(item) {
      if (item) {
        detail(item.applyid).then((data) => {
          this.currentItem = data.data.dto || item;
          this.currentItem.files = data.data.fileInfo || [];
        });
      } else {
        this.currentItem = {};
      }
      this.$refs.detailDialog.dialogVisible = true;
    },
    saveItem() {
      const me = this;
      this.$refs.saveItemForm.validate((data) => {
        if (this.$refs.saveItemForm.status) {
          edit(data)
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
      const me = this;
      const dels = [];
      const ids = [];
      if (item) {
        dels.push(item.xm);
        ids.push(item.applyid);
      } else {
        if (this.multipleSelection.length) {
          for (const ml of this.multipleSelection) {
            dels.push(ml.xm);
            ids.push(ml.applyid);
          }
        } else {
          me.toast("请先选择至少一项", "warning");
          return false;
        }
      }
      this.alert("删除贷款人：" + dels.join(",") + "。", "确认要进行删除吗？", {
        type: "warning",
        request() {
          //return deleteSyd(ids.join(","));
          return deleteSyd(ids);
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
