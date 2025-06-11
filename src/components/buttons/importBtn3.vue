<template>
  <el-button type="default" @click="openExceImportDialog">
    {{ name }}
    <v-dialog
      ref="exceImportDialog"
      :title="(filename || $route.meta.title) + '导入'"
      width="860px"
      :show-footer="showFooter"
      confirmBtnTxt="确定"
      :show-cancel="false"
      @handleClose="handleClose"
    >
      <exce-import
        v-if="show"
        ref="exceImport"
        :action="action"
        :data="data"
        :auto-upload="false"
        :tip="tip"
        :type="type"
        :filename="filename"
        :template-download="temDownload"
        @uploaded="uploaded"
        @checkHis="checkHis"
        :result="result"
        :detail-type="detailType"
      >
        <div slot="result">
          <div style="min-height: 80px" v-if="!finished" v-loading="loading">
            <div v-if="!showRes">解析中...</div>
            <basic-table
              v-if="showRes"
              :columns="columns"
              :call-server="callServer"
              :before-show="beforeShow"
              v-model="tableParams"
              ref="basicTable"
              :muti="false"
            >
              <div slot="tableHeader" class="">
                <v-form :fields="fields" :fieldsData="tableParams"> </v-form>
              </div>
            </basic-table>
            <el-row v-if="showRes">
              <el-col class="txt-right">
                <el-button
                  :loading="posting"
                  type="primary"
                  @click="submit(false)"
                  >确认导入</el-button
                >
              </el-col>
            </el-row>
          </div>
          <div v-else-if="finished">
            导入成功：{{ successCount }} 条
            <el-row>
              <el-col class="txt-right">
                <el-button @click="$refs.exceImportDialog.close()"
                  >关闭</el-button
                >
              </el-col>
            </el-row>
          </div>
        </div>
      </exce-import>
      <slot v-else name="replace"></slot>
    </v-dialog>
    <v-dialog
      :show-footer="false"
      width="860px"
      ref="abnormalDialog"
      title="异常信息"
    >
      <el-card shadow="never">
        <div slot="header" class="clearfix">
          行号{{ currentItem.rowNum }}
          <el-button
            @click="$refs.editDialog.dialogVisible = true"
            style="float: right"
            size="small"
            type="primary"
            >修改</el-button
          >
        </div>
        <basic-table
          :columns="columns1"
          :props-data="currentItem.yiData"
          ref="basicTable1"
          :muti="false"
        >
        </basic-table>
      </el-card>
    </v-dialog>
    <v-dialog
      :show-footer="false"
      width="860px"
      ref="hisDialog"
      :title="(filename || $route.meta.title) + '导入历史'"
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
      confirmBtnTxt="确认导入"
      width="860px"
      ref="resultDialog"
      title="导入结果"
      @handleClose="handleClose1"
      :show-footer="currentItem.status != 1"
    >
      数据状态：
      <el-radio-group
        v-model="tableParams3.status"
        @change="$refs.basicTable3.fecthData()"
      >
        <el-radio label="">全部</el-radio>
        <el-radio label="1">正常</el-radio>
        <el-radio label="0">异常</el-radio>
      </el-radio-group>
      <basic-table
        v-loading="loading3"
        v-if="showRes"
        :columns="columns"
        :call-server="callServer"
        :before-show="beforeShow"
        v-model="tableParams3"
        ref="basicTable3"
        :muti="false"
      >
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
    <v-dialog @handleClose="saveItem1" ref="confirmDialog" title="确认导入">
      <v-form
        ref="confirmForm"
        :fields="fields2"
        :fieldsData="confirmForm"
      ></v-form>
    </v-dialog>
  </el-button>
</template>

<script>
import exceImport from "_c/exceImport/";
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
} from "@/api/excel3";
import basicTable from "_c/tables";
export default {
  model: {
    prop: "data",
  },
  computed: {
    action: function () {
      return upload(this.importCode);
    },
    data: function () {
      return {
        tableid: this.importCode,
      };
    },
  },
  props: {
    tip: String,
    importCode: String,
    filename: String,
    onlyUpload: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
      default: "导入",
    },
    type: String,
    result: {
      type: Boolean,
      default: true,
    },
    replace: {
      type: Boolean,
      default: false,
    },
    detailType: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      loading3: false,
      showFooter: false,
      showSlot: true,
      show: true,
      timer: null,
      showRes: false,
      loading: false,
      posting: false,
      finished: false,
      successCount: 0,
      activeName: "total",
      currentItem: {},
      tableParams: {
        status: "",
      },
      tableParams1: {},
      tableParams2: {},
      tableParams3: { status: "" },
      columns: [
        {
          label: "excel行号",
          prop: "rowNum",
          width: 90,
        },
        {
          label: "数据状态",
          render: (h, row) => {
            return (
              <div
                onClick={() => this.abnormal(row)}
                class={row.status == 1 ? "" : "txt-danger cursor-p"}
              >
                {row.status == 1 ? "正常" : "异常"}
              </div>
            );
          },
        },
        {
          label: "操作",
          fixed: "right",
          width: "100px",
          render: (h, row) => {
            if (!this.currentItem.status || this.currentItem.status != 1) {
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
            }
          },
        },
      ],
      columns1: [
        {
          label: "异常类型",
          prop: "exceptType",
        },
        {
          label: "异常字段",
          prop: "fieldAlias",
        },
        {
          label: "描述",
          prop: "exceptDesc",
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
      fields: [
        {
          label: "数据状态：",
          prop: "status",
          type: "radio",
          options: [
            {
              label: "所有",
              value: "",
            },
            {
              label: "正常数据",
              value: 1,
            },
            {
              label: "异常数据",
              value: 0,
            },
          ],
          change: (val) => {
            this.fecthData();
          },
        },
      ],
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
      editForm: {},
      fields1: [],
      auditForm: {},
      titles: [],
      fields2: [
        {
          label: "",
          prop: "ignoreAbnormal",
          type: "radio",
          options: [
            {
              label: "检查异常后导入",
              value: 1,
            },
            {
              label: "忽略异常直接导入",
              value: 0,
            },
          ],
        },
      ],
      confirmForm: {
        ignoreAbnormal: 1,
      },
    };
  },
  components: {
    exceImport,
    basicTable,
  },
  methods: {
    download(item) {
      return download(this.importCode, item.fileName, {
        batchId: item.batchId,
        importCode: this.importCode,
      });
    },
    temDownload() {
      return importTemplate(this.importCode, this.filename);
    },
    callServer() {
      const req = (query) => {
        return result(this.importCode, query);
      };
      return req;
    },
    callServer2() {
      const req = (query) => {
        return history(this.importCode, query);
      };
      return req;
    },
    fecthData() {
      this.$refs.basicTable.fecthData();
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
    getProcess(id, cb) {
      const me = this;
      clearTimeout(me.timer);
      progress(this.importCode, id).then((data) => {
        if (data.data.failMessage) {
          this.toast(
            data.data.failMessage + "，请重新选择文件上传。",
            "warning"
          );
          this.$refs.exceImport.count = 0;
          this.$refs.exceImport.fileList = [];
          this.$refs.exceImport.showResult = false;
          return false;
        }
        if (data.data.done) {
          titles(me.importCode).then((data) => {
            me.titles = data.data;
            if (data.data.length) {
              me.columns = [
                {
                  label: "excel行号",
                  prop: "rowNum",
                  width: 90,
                },
                {
                  label: "数据状态",
                  render: (h, row) => {
                    return (
                      <div
                        onClick={() => this.abnormal(row)}
                        class={row.status == 1 ? "" : "txt-danger cursor-p"}
                      >
                        {row.status == 1 ? "正常" : "异常"}
                      </div>
                    );
                  },
                },
                {
                  label: "操作",
                  fixed: "right",
                  width: "100px",
                  render: (h, row) => {
                    if (
                      !this.currentItem.status ||
                      this.currentItem.status != 1
                    ) {
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
                    }
                  },
                },
              ];
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
    submit(ignoreAbnormal) {
      this.posting = true;
      const me = this;
      submit(this.importCode, this.tableParams.batchId, ignoreAbnormal)
        .then((data) => {
          me.toast("导入成功", "success");
          this.$emit("uploaded");
          me.$refs.exceImportDialog.close();
        })
        .catch((err) => {
          this.posting = false;
        });
    },
    submit1(item) {
      this.posting = true;
      submit(this.importCode, item.batchId, false)
        .then((data) => {
          this.successCount = data.data;
          this.finished = true;
          this.posting = false;
          this.$emit("uploaded");
        })
        .catch((err) => {
          this.posting = false;
        });
    },
    handleClose1() {
      const me = this;
      this.$refs.resultDialog.posting = true;
      submit(this.importCode, this.currentItem.batchId, false)
        .then((data) => {
          this.$refs.resultDialog.close();
          this.$emit("uploaded");
          me.toast("导入成功", "success");
        })
        .catch((err) => {
          this.$refs.resultDialog.posting = false;
          this.posting = false;
        });
    },
    saveItem1() {
      const me = this;
      submit(
        this.importCode,
        this.tableParams.batchId,
        this.confirmForm.ignoreAbnormal == 1 ? false : true
      )
        .then((data) => {
          this.successCount = data.data;
          this.$refs.confirmDialog.close();
          this.finished = true;
          this.posting = false;
          this.$emit("uploaded");
          me.toast("导入成功", "success");
        })
        .catch((err) => {
          this.$refs.confirmDialog.close();
          this.$refs.confirmDialog.posting = false;
          this.posting = false;
        });
    },
    checkHis() {
      this.$refs.hisDialog.dialogVisible = true;
    },
    openExceImportDialog() {
      this.show = true;
      this.$refs.exceImportDialog.dialogVisible = true;
    },
    uploaded(res) {
      if (res.data) {
        this.finished = false;
        this.showRes = false;
        this.getProcess(res.data, () => {
          if (this.onlyUpload) {
            this.toast("导入成功", "success");
            this.$refs.exceImportDialog.close();
            this.$emit("uploaded");
          }
        });
      } else {
        this.toast("导入完毕", "success");
        this.$refs.exceImportDialog.close();
        this.currentItem = {};
        this.$emit("uploaded");
      }
    },
    handleClose() {
      this.$refs.exceImportDialog.close();
      this.showSlot = true;

      this.$emit("uploaded");
    },
    abnormal(item) {
      abnormal(this.importCode, {
        dataId: item.id,
        importCode: this.importCode,
      }).then((data) => {
        this.currentItem = {
          dataId: item.id,
          rowNum: item.rowNum,
          items: item.items,
          yiData: data.data.items,
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
        this.$refs.abnormalDialog.dialogVisible = true;
      });
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
        abnormal(this.importCode, {
          dataId: item.id,
          importCode: this.importCode,
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
          aduit(this.importCode, this.editForm)
            .then(() => {
              this.$refs.editDialog.close();
              me.toast("修改成功", "success");
              if (me.$refs.basicTable3) {
                me.$refs.basicTable3.fecthData();
              } else {
                me.fecthData();
              }
            })
            .catch((err) => {
              this.$refs.editDialog.posting = false;
            });
        }
      });
    },
    del(item) {
      const me = this;
      this.alert("删除该条数据？", "确认要进行删除吗？", {
        type: "warning",
        request() {
          return remove(me.importCode, {
            batchId: me.tableParams.batchId,
            dataIds: [item.id],
            recheck: false,
          });
        },
        success() {
          me.toast("删除成功", "success");
          if (me.$refs.basicTable3) {
            me.$refs.basicTable3.fecthData();
          } else {
            me.fecthData();
          }
        },
      });
    },
    delRow(item) {
      const me = this;
      this.alert("删除该条上传记录？", "确认要进行删除吗？", {
        type: "warning",
        request() {
          return hisRemove(me.importCode, {
            batchId: item.batchId,
            importCode: me.importCode,
          });
        },
        success() {
          me.toast("删除成功", "success");
          me.$refs.basicTable2.fecthData();
          me.$emit("uploaded");
        },
      });
    },
    checkResult(item) {
      this.currentItem = item;
      this.$refs.resultDialog.dialogVisible = true;
      this.loading3 = true;
      this.tableParams3.batchId = item.batchId;
      this.tableParams3.status = "";
      this.getProcess(item.batchId, () => {
        this.loading3 = false;
      });
    },
  },
};
</script>
