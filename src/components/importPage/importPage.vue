<template>
  <div>
    <div class="tableFiltersWrap">
      <v-form :fields="fields" :fieldsData="params">
        <el-col :span="6" class="txt-left">
          <el-button type="primary" @click="fecthData">查询</el-button>
          <el-button type="default" @click="reloadData">清空</el-button>
        </el-col>
      </v-form>
    </div>
    <el-card shadow="never">
      <div slot="header" class="clearfix">
        <div class="btns-wrap txt-right">
          <v-table-set-btn
            file-name="filename"
            :columns="columns"
            @colsChange="colsChange"
          >
            <import-btn
              v-if="isEdit"
              @uploaded="fecthData"
              :importid="importid"
              :filename="filename + '导入模板'"
              :only-upload="true"
            ></import-btn>

            <!-- <el-button v-if="isEdit" type="default" @click="openImportDialog(2)"
              >批量导入DBF</el-button
            > -->
            <!-- <el-button v-if="isEdit" type="default" @click="exportsForm"
              >数据检查项配置</el-button
            > -->
            <el-button type="default" v-if="isEdit" @click="submit"
              >导入正式库</el-button
            >
            <el-button type="default" @click="checkHis">查看导入历史</el-button>
          </v-table-set-btn>
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
            :before-show="beforeShow"
          >
          </basic-table>
        </div>
      </v-page>
    </el-card>
    <v-dialog
      :show-footer="false"
      width="860px"
      ref="hisDialog"
      title="招生计划导入历史"
    >
      <basic-table
        :columns="columns2"
        :call-server="callServer2"
        ref="basicTable2"
        :muti="false"
        v-model="tableParams2"
      >
        <div slot="tableHeader" class="txt-right">
          <v-form :fields="fields3" :fieldsData="tableParams2">
            <el-col :span="4" class="txt-left">
              <el-button type="primary" @click="$refs.basicTable2.fecthData()"
                >查询</el-button
              >
            </el-col>
          </v-form>
        </div>
      </basic-table>
    </v-dialog>
    <v-dialog
      @handleClose="saveItem"
      width="960px"
      ref="editDialog"
      :title="'第' + currentItem.rowNum + '行修改'"
    >
      <v-form
        :label-width="160"
        ref="editForm"
        :fields="fields1"
        :fieldsData="auditForm"
      ></v-form>
    </v-dialog>
    <v-dialog
      ref="importDialog"
      width="720px"
      :title="importDialog.title"
      :show-footer="false"
    >
      <exce-import
        :type="importDialog.type"
        :has-his="false"
        ref="dbfImport"
        :action="importDialog.action"
        @uploaded="uploaded"
      >
        <v-form
          class="fn-mt15"
          label-width="140"
          ref="ruleForm"
          :fields="fields1"
          :fieldsData="ruleForm"
        ></v-form>
      </exce-import>
    </v-dialog>
    <v-dialog
      confirmBtnTxt="确认导入"
      width="860px"
      ref="resultDialog"
      title="导入结果"
      @handleClose="handleClose1"
      :show-footer="currentItem.status != 1"
    >
      <basic-table
        v-loading="loading3"
        v-if="showRes"
        :columns="columns"
        :call-server="callServer3"
        :before-show="beforeShow"
        v-model="tableParams3"
        ref="basicTable3"
        :muti="false"
      >
      </basic-table>
    </v-dialog>
  </div>
</template>

<script>
import {
  importTemplate,
  upload,
  progress,
  result,
  submit,
  titles,
  abnormal,
  remove,
  aduit,
  history,
  download,
  hisRemove,
  last,
} from "@/api/excel";
import basicTable from "_c/tables";
import { getOptTxt, getCodeOptions } from "@/filters/options";
import exceImport from "./exceImport";
import importBtn from "./importBtn";

export default {
  props: {
    importid: String,
    filename: String,
  },
  components: {
    basicTable,
    exceImport,
    importBtn,
  },
  data() {
    return {
      loading3: false,
      params: {},
      tableParams: {},
      tableParams1: {},
      tableParams2: {},
      tableParams3: {},
      ruleForm: {},
      multipleSelection: [],
      currentItem: {},
      importDialog: {},
      showFields: [],
      cols: [
        {
          label: "操作",
          fixed: "right",
          width: "100px",
          render: (h, row) => {
            return (
              <div>
                <el-button
                  type="text"
                  onClick={() => this.editAbnormal(row)}
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
            // if (!row.status || row.status != 1) {
            //   return (
            //     <div>
            //       <el-button
            //         type="text"
            //         onClick={() => this.editAbnormal(row)}
            //         size="middle"
            //         class="txt-highlight"
            //       >
            //         修改
            //       </el-button>
            //       <el-button
            //         type="text"
            //         onClick={() => this.del(row)}
            //         size="middle"
            //         class="txt-highlight"
            //       >
            //         删除
            //       </el-button>
            //     </div>
            //   );
            // }
          },
        },
      ],
      columns2: [
        {
          label: "操作人",
          prop: "creatorName",
        },
        {
          label: "上传时间",
          prop: "scrq",
        },
        {
          label: "文件名",
          prop: "fileName",
        },
        {
          label: "状态",
          render(h, row) {
            return (
              <span
                class={
                  row.status == 1
                    ? "txt-highlight"
                    : row.status == 2
                    ? "txt-danger"
                    : ""
                }
              >
                {row.status == 1
                  ? "导入成功"
                  : row.status == 2
                  ? "导入失败"
                  : "待导入"}
                （{row.itemNum}条）
              </span>
            );
          },
        },
        {
          label: "备注",
          prop: "remark",
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
                  onClick={() => this.checkResult(row)}
                  size="middle"
                  class="txt-highlight"
                >
                  查看
                </el-button>
                <el-button
                  type="text"
                  onClick={() => this.submit1(row)}
                  size="middle"
                  class={row.status == 0 ? "txt-highlight" : "displayNone"}
                >
                  导入
                </el-button>
                <el-button
                  type="text"
                  onClick={() => this.delRow(row)}
                  size="middle"
                  class={row.status == 0 ? "txt-highlight" : "displayNone"}
                >
                  删除
                </el-button>
                <el-button
                  type="text"
                  onClick={() => this.download(row)}
                  size="middle"
                  class="txt-highlight"
                >
                  下载
                </el-button>
              </div>
            );
          },
        },
      ],
      batchId: "",
      loading: true,
      fields1: [],
      auditForm: {},
      showRes: false,
      fields3: [
        {
          label: "",
          placeholder: "请选择上传开始日期",
          prop: "uploadTimeAfter",
          type: "date",
          dType: "date",
          format: "yyyy-MM-dd",
          span: 6,
        },
        {
          label: "",
          placeholder: "请选择上传结束日期",
          prop: "uploadTimeBefore",
          type: "date",
          dType: "date",
          format: "yyyy-MM-dd",
          span: 6,
        },
      ],
    };
  },
  computed: {
    isEdit: function () {
      return !this.$route.meta.isQuery;
    },
    columns: function () {
      const cols = this.cols;
      if (this.showFields.length) {
        for (let i = 0; i < cols.length; i++) {
          if (cols[i].prop || cols[i].field) {
            const field = cols[i].prop || cols[i].field;
            cols[i].isHide = this.showFields.indexOf(field) > -1 ? false : true;
          }
        }
      }
      this.$forceUpdate();
      return cols;
    },
    fields: function () {
      return [
        {
          label: "",
          type: "xyzybj",
          layout: ["zy"],
          span: 6,
        },
      ];
    },
  },
  watch: {
    params: function (val) {
      console.log(val.zy);
      this.tableParams.filters = {
        fieldName: "field6",
        operator: "=",
        paramValues: [val.zy],
      };
    },
  },
  created() {
    this.initTitles();
    this.init();
  },
  methods: {
    init() {},
    initTitles() {
      const cols = this.cols;
      titles(this.importid).then((data) => {
        for (let i = 0; i < data.data.length; i++) {
          cols.push({
            label: data.data[i].fieldAlias,
            prop: data.data[i].fieldName,
          });
        }
        this.$set(this, "cols", cols);
      });
    },
    callServer(pagination) {
      const req = (query) => {
        return last(this.importid, this.tableParams);
      };
      return req;
    },
    callServer2() {
      const req = (query) => {
        return history(this.importid, query);
      };
      return req;
    },
    callServer3() {
      const req = (query) => {
        return result(this.importid, query);
      };
      return req;
    },
    fecthData() {
      if (this.$refs.basicTable) {
        this.$refs.basicTable.fecthData();
      }
    },
    checkHis() {
      this.$refs.hisDialog.dialogVisible = true;
    },
    download(item) {
      return download(this.importid, item.fileName, {
        batchId: item.batchId,
        importId: this.importid,
      });
    },
    getProcess(id, cb) {
      const me = this;
      clearTimeout(me.timer);
      progress(this.importid, id).then((data) => {
        if (data.data.done) {
          titles(me.importid).then((data) => {
            me.titles = data.data;
            if (data.data.length) {
              for (const da of data.data) {
                me.columns.push({
                  label: da.fieldAlias,
                  prop: da.fieldName,
                  width: 160,
                });
              }
            }

            this.showRes = true;
            me.tableParams.batchId = id;
            if (cb) {
              cb();
            }
          });
        } else {
          me.timer = setTimeout(() => me.getProcess(id), 1000);
        }
      });
    },
    submit1(item) {
      this.posting = true;
      submit(this.importid, item.batchId, false)
        .then((data) => {
          this.successCount = data.data;
          this.finished = true;
          this.posting = false;
          this.$refs.hisDialog.dialogVisible = fasle;
          me.fecthData();
          this.$emit("uploaded");
        })
        .catch((err) => {
          this.posting = false;
        });
    },
    delRow(item) {
      const me = this;
      this.alert("删除该条上传记录？", "确认要进行删除吗？", {
        type: "warning",
        request() {
          return hisRemove(me.importid, {
            batchId: item.batchId,
            importId: me.importid,
          });
        },
        success() {
          me.toast("删除成功", "success");
          me.$refs.basicTable2.fecthData();
          me.$emit("uploaded");
          me.fecthData();
        },
      });
    },
    checkResult(item) {
      //导入结果查看
      this.currentItem = item;
      this.$refs.resultDialog.dialogVisible = true;
      //this.loading3 = true;
      this.tableParams3.batchId = item.batchId;
      this.showRes = true;
      /*  this.getProcess(item.batchId, () => {
        this.loading3 = false;
      }); */
    },
    setForm(data) {
      this.editForm = {
        dataId: data.dataId,
        recheck: true,
        auditDatas: [],
      };
      this.auditForm = {
        dataId: data.dataId,
        recheck: true,
        auditDatas: [],
      };
      this.fields1 = [];
      for (let i = 0; i < data.items.length; i++) {
        const label = data.items[i].fieldAlias;
        this.editForm.auditDatas.push({
          fieldAlias: data.items[i].fieldAlias,
          fieldName: data.items[i].fieldName,
          fieldValue: data.items[i].fieldValue,
        });
        this.$set(
          this.auditForm,
          data.items[i].fieldName,
          data.items[i].fieldValue || ""
        );
        this.fields1.push({
          label: data.items[i].hasyc ? `(异常)${label}：` : `${label}：`,
          placeholder: `请输入${label}`,
          prop: data.items[i].fieldName,
          type: "text",
          span: 12,
          class: {
            "txt-danger": data.items[i].hasyc ? "#ff4949" : "",
          },
          tip: data.items[i].exceptDesc,
          // rule: [
          //   {
          //     required: true,
          //     message: `请输入${label}`,
          //     trigger: "blur",
          //   },
          // ],
        });
      }
    },
    reloadData() {
      if (this.$refs.basicTable) {
        this.params = {};
        this.tableParams = {};
        this.$refs.basicTable.reload();
      }
    },
    beforeShow(data) {
      if (data.length) {
        const arr = data.map((item) => {
          for (let i = 0; i < item.items.length; i++) {
            item[item.items[i].fieldName] = item.items[i].fieldValue;
          }
          return item;
        });
        return arr;
      }
    },
    selectionChange(val) {
      this.multipleSelection = val;
    },
    colsChange(showFields) {
      this.showFields = showFields;
    },
    exportsExcel(fields, filename) {
      return exportsExcel(
        Object.assign(this.tableParams, {
          excelDtos: fields,
        }),
        filename
      );
    },
    editAbnormal(item) {
      if (item.status == "1") {
        this.currentItem = {
          dataId: item.id,
          rowNum: item.rowNum,
          items: item.items,
          batchId: item.batchId,
        };
        this.setForm(this.currentItem);
        this.$refs.editDialog.dialogVisible = true;
      } else {
        abnormal(this.importid, {
          dataId: item.id,
          importId: this.importid,
        }).then((data) => {
          this.currentItem = {
            dataId: item.id,
            rowNum: item.rowNum,
            items: item.items,
            batchId: item.batchId,
          };
          for (let i = 0; i < this.currentItem.items.length; i++) {
            for (let j = 0; j < data.data.items.length; j++) {
              if (
                this.currentItem.items[i].fieldName ==
                data.data.items[j].fieldName
              ) {
                this.currentItem.items[i].hasyc = true;
                this.currentItem.items[i].exceptDesc =
                  data.data.items[j].exceptDesc;
              }
            }
          }
          this.setForm(this.currentItem);
          this.$refs.editDialog.dialogVisible = true;
        });
      }
    },
    del(item) {
      const me = this;
      this.alert("删除该条数据？", "确认要进行删除吗？", {
        type: "warning",
        request() {
          return remove(me.importid, {
            batchId: item.batchId,
            dataIds: [item.id],
            recheck: false,
          });
        },
        success() {
          me.toast("删除成功", "success");
          me.fecthData();
        },
      });
    },
    submit() {
      const me = this;
      if (
        this.$refs.basicTable.tableData &&
        this.$refs.basicTable.tableData.length
      ) {
        this.alert("确定导入正式库？", "导入正式库", {
          type: "warning",
          request() {
            return submit(
              me.importid,
              me.$refs.basicTable.tableData[0].batchId,
              true
            );
          },
          success() {
            me.toast("导入成功", "success");
            me.fecthData();
          },
        });
      } else {
        this.toast("没有可导入的记录", "warning");
      }
    },
    uploaded() {
      this.toast("上传成功", "success");
      this.fecthData();
    },
    openImportDialog(type) {
      if (type == 1) {
        this.importDialog = {
          title: "excel导入",
          action: importExcel(),
          type: "excel",
        };
      } else {
        this.importDialog = {
          title: "批量导入DBF",
          //action: importDbf(),
          type: "zip",
        };
      }
      this.$refs.importDialog.dialogVisible = true;
    },
    saveItem() {
      const me = this;
      this.$refs.editForm.validate().then((valid) => {
        if (valid) {
          this.$refs.editDialog.posting = true;
          for (let i = 0; i < this.editForm.auditDatas.length; i++) {
            this.editForm.auditDatas[i].fieldValue =
              this.auditForm[this.editForm.auditDatas[i].fieldName];
          }
          this.editForm.batchId = this.currentItem.batchId;
          aduit(this.importid, this.editForm)
            .then(() => {
              this.$refs.editDialog.close();
              me.toast("修改成功", "success");
              me.fecthData();
            })
            .catch((err) => {
              this.$refs.editDialog.posting = false;
            });
        }
      });
    },
    handleClose1() {
      const me = this;
      this.$refs.resultDialog.posting = true;
      submit(this.importid, this.currentItem.batchId, false)
        .then((data) => {
          this.$refs.resultDialog.close();
          me.toast("导入成功", "success");
        })
        .catch((err) => {
          this.$refs.resultDialog.posting = false;
          this.posting = false;
        });
    },
  },
};
</script>
