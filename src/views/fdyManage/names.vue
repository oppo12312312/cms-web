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
            file-name="辅导员名单"
            :download="exportsExecutes"
            :columns="columns"
            @colsChange="colsChange"
          ></v-table-set-btn>
          <v-btn
            class="fn-ml10"
            type="add"
            @handleClick="openSaveDialog"
          ></v-btn>
          <v-btn type="del" @handleClick="del"></v-btn>
        </div>
      </div>
      <v-page>
        <!-- <el-card shadow="never">
          <div slot="header" class="clearfix">
            <el-row>
              <el-col>
                <v-form :fields="fields" :fieldsData="tableParams">
                  <el-col :span="4" class="txt-left">
                    <el-button type="primary" @click="fecthData">查询</el-button>
                  </el-col>
                </v-form>
              </el-col>
              <el-col :span="8" class="txt-right">
                <v-export-btn :download="export1"></v-export-btn>
                <v-btn type="add" @handleClick="openSaveDialog"></v-btn>
                <v-btn type="del" @handleClick="del"></v-btn>
              </el-col>
            </el-row>
          </div> -->
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
          :title="isEmptyObject(currentItem) ? '新增辅导员' : '修改辅导员'"
        >
          <save-fdy-form
            ref="saveItemForm"
            :patch-data="currentItem"
            :dept-data="deptOptions"
          ></save-fdy-form>
        </v-dialog>
        <!-- </el-card> -->
      </v-page>
    </el-card>
  </div>
</template>

<script>
import {
  add,
  edit,
  deleteFdy,
  fdyInfoList,
  detail,
  exportFdyList,
} from "@/api/xgAssFdy";
import {
  getOptTxt,
  getDeptsListOptions,
  getXueyuanOptions,
} from "@/filters/options";
import basicTable from "_c/tables";
import saveFdyForm from "_c/forms/saveFdyForm";
export default {
  components: {
    basicTable,
    saveFdyForm,
  },
  data() {
    return {
      tableParams: {
        // truename: "",
        // username: "",
        // deptname: "",
      },
      deptOptions: [],
      currentItem: {},
      showFields: [],
    };
  },
  computed: {
    columns: function () {
      const cols = [
        {
          label: "职工号",
          prop: "zgh",
        },
        {
          label: "姓名",
          prop: "xm",
        },
        {
          label: "所在部门",
          render: (h, row) => {
            return <span>{getOptTxt(this.deptOptions, row.departId)}</span>;
          },
        },
        {
          label: "入党日期",
          prop: "rdny",
        },
        {
          label: "民族",
          prop: "mz",
        },
        {
          label: "出生日期",
          prop: "csny",
        },
        {
          label: "报到日期",
          prop: "csfdygzsj",
        },
        // {
        //   label: "微信",
        //   prop: "wxh",
        // },
        // {
        //   label: "宿舍房号",
        //   prop: "ssfh",
        // },
        {
          label: "籍贯",
          prop: "jg",
        },
        {
          label: "辅导员类型",
          prop: "gwlx",
          // render: (h, row) => {
          //   return <div>{row.gwly == 1 ? "教工" : "学生"}</div>;
          // },
        },
        {
          label: "电话号码",
          prop: "sj",
        },
        {
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
    fields: function () {
      return [
        {
          label: "",
          prop: "xm",
          span: 4,
          type: "text",
          placeholder: "输入姓名",
        },
        {
          label: "",
          prop: "zgh",
          span: 4,
          type: "text",
          placeholder: "输入职工号",
        },
        {
          label: "",
          prop: "departId",
          span: 4,
          type: "selectDialog",
          placeholder: "选择部门",
          empty: "暂时没有部门",
          selectData: this.deptOptions,
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
      return fdyInfoList;
    },
    /* fecthData(keep) {
      if (keep) {
        this.tableParams = {};
      }
      this.$refs.basicTable.fecthData();
    }, */
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
    handleNodeClick(node) {
      if (node.children) {
        this.currentNode = node;
        this.fecthData(node.id);
      }
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
      return exportFdyList(
        {
          headers: headers,
          columns: columns,
        },
        filename
      );
    },
    export1() {
      const params = {};
      for (const p in this.tableParams) {
        params[p] = this.tableParams[p] || "";
      }
      const headers = [];
      const columns = [];
      this.columns.forEach((item, i) => {
        if (item.prop && item.prop != "") {
          columns.push(item.prop);
          headers.push(item.label);
        }
      });
      params.headers = headers;
      params.columns = columns;
      exportFdyList(params);
    },
    openSaveDialog(item) {
      this.currentItem = item || {};
      this.$refs.saveDialog.dialogVisible = true;
    },
    saveItem() {
      const me = this;
      this.$refs.saveItemForm.validate((data) => {
        this.$refs.saveDialog.posting = true;
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
        ids.push(item.infoid);
      } else {
        if (this.multipleSelection.length) {
          for (const ml of this.multipleSelection) {
            dels.push(ml.xm);
            ids.push(ml.infoid);
          }
        }
      }
      this.alert("删除辅导员：" + dels.join(",") + "。", "确认要进行删除吗？", {
        type: "warning",
        request() {
          return deleteFdy(ids.join(","));
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
