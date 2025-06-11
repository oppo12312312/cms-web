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
        <div class="txt-right fn-pr15">
          <v-table-set-btn
            file-name="校园地贷款名单"
            :download="exportsExecutes"
            :columns="columns"
            @colsChange="colsChange"
          ></v-table-set-btn>
          <v-btn
            v-if="isEdit"
            class="fn-ml10"
            type="add"
            @handleClick="openSaveDialog"
          ></v-btn>
          <v-btn v-if="isEdit" type="del" @handleClick="del"></v-btn>
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
          :title="isEmptyObject(currentItem) ? '新增贷款信息' : '修改贷款信息'"
        >
          <save-xyd-form
            ref="saveItemForm"
            :patch-data="currentItem"
            :dept-data="deptOptions"
          ></save-xyd-form>
        </v-dialog>
        <v-dialog
          ref="detailDialog"
          width="900px"
          title="校园地贷款详细信息"
          :show-footer="false"
        >
          <detail-xyd-form
            ref="savedetailForm"
            :patch-data="currentItem"
          ></detail-xyd-form>
        </v-dialog>
      </v-page>
    </el-card>
  </div>
</template>

<script>
import {
  add,
  edit,
  detail,
  deleteXyd,
  xydLoanList,
  exportXydList,
} from "@/api/xydLoan";
import { getOptTxt, getXueyuanOptions } from "@/filters/options";
import basicTable from "_c/tables";
import saveXydForm from "./components/saveXydForm";
import detailXydForm from "./components/detailXydForm";
export default {
  components: {
    basicTable,
    saveXydForm,
    detailXydForm,
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
          label: "贷款年度",
          prop: "nd",
        },
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
                onClick={() => this.openDetailDialog(row)}
                size="middle"
                class="txt-highlight"
              >
                {row.xm}
              </el-button>
            );
          },
        },
        {
          label: this.lang_college,
          prop: "xy",
        },
        {
          label: "婚姻状况",
          prop: "hyzk",
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
          label: "申请编号",
          prop: "sqbh",
        },
        {
          label: "客户姓名",
          prop: "khxm",
        },
        {
          label: "身份证号码",
          prop: "sfzhm",
        },
        {
          label: "性别",
          prop: "xb",
        },
        {
          label: "第一学年发放金额",
          prop: "dyxnje",
        },
        {
          label: "第二学年发放金额",
          prop: "dexnje",
        },
        {
          label: "第三学年发放金额",
          prop: "dsxnje",
        },
        {
          label: "授信金额",
          prop: "sxje",
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
          prop: "nd",
          span: 4,
          type: "date",
          dType: "year",
          format: "yyyy",
          formate: "yyyy",
          placeholder: "选择年度",
        },
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
        /* {
          label: "",
          prop: "xyId",
          span: 4,
          type: "selectDialog",
          placeholder: "选择学院",
          empty: "暂时没有学院",
          selectData: this.deptOptions,
        }, */
        {
          label: "",
          span: 8,
          type: "xyzybj",
          layout: ["xy", "zy"],
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
      return xydLoanList;
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
      return exportXydList(
        {
          headers: headers,
          columns: columns,
        },
        filename
      );
    },
    openSaveDialog(item) {
      if (item) {
        detail(item.applyid).then((data) => {
          this.currentItem = data.data.dto || item;
          this.currentItem.files = data.data.fileInfo || [];
        });
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
        this.$refs.saveDialog.posting = true;
        const files = data.files;
        const params = {};
        for (const p in data) {
          if (p != "files") {
            params[p] = data[p] || "";
          }
        }
        if (this.$refs.saveItemForm.status) {
          edit(params, files)
            .then(() => {
              this.$refs.saveDialog.close();
              me.toast("修改成功", "success");
              me.fecthData();
            })
            .catch((err) => {
              this.$refs.saveDialog.posting = false;
            });
        } else {
          add(params, files)
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
          //return deleteXyd(ids.join(","));
          return deleteXyd(ids);
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
