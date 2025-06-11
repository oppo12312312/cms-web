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
            <!-- <el-col :span="4" v-else class="txt-left">
              <el-button type="primary" @click="fecthData1">查询</el-button>
              <el-button type="default" @click="reloadData1">清空</el-button>
            </el-col> -->
          </v-form>
        </el-col>
      </el-row>
    </div>
    <el-card shadow="never" class="card-header-tabs">
      <div slot="header" class="clearfix">
        <el-tabs v-model="activeName" @tab-click="tabClick">
          <el-tab-pane label="处分" name="1"></el-tab-pane>
          <el-tab-pane label="已解除" name="2"></el-tab-pane>
        </el-tabs>
        <div class="btns-wrap">
          <v-table-set-btn
            :columns="columns"
            :download="exportsExecutes"
            file-name="处分信息"
            @colsChange="colsChange"
          >
          </v-table-set-btn>
          <v-btn
            v-if="isEdit && activeName != 2"
            class="fn-ml10"
            type="add"
            txt="新增"
            @handleClick="openSaveDialog"
          ></v-btn>
          <v-btn
            v-if="isEdit"
            class="fn-ml10"
            type="del"
            @handleClick="del"
          ></v-btn>
          <v-btn
            type="data"
            icon="A1"
            txt="查看统计"
            @handleClick="checkStatistics"
          ></v-btn>
        </div>
      </div>
      <v-page>
        <basic-table
          :columns="columns"
          :call-server="callServer"
          @selectionChange="selectionChange"
          v-model="tableParams"
          ref="basicTable"
        >
        </basic-table>
      </v-page>
      <!-- <v-page v-else>
        <basic-table
          :columns="columns"
          :call-server="callServer1"
          @selectionChange="selectionChange"
          ref="basicTable1"
          v-model="tableParams"
        >
        </basic-table>
      </v-page> -->
      <v-dialog
        ref="saveDialog"
        width="900px"
        @handleClose="saveItem"
        :title="
          isRemove == 'true'
            ? '解除处分'
            : isEmptyObject(currentItem)
            ? '新增处分'
            : '修改处分'
        "
      >
        <save-punish-form
          ref="saveItemForm"
          :patch-data="currentItem"
          :punish-data="cflxOpts"
          :remove-data="isRemove"
          :active-data="hasRemove"
        ></save-punish-form>
      </v-dialog>
      <v-dialog
        ref="detailDialog"
        width="900px"
        title="违纪处分详细信息"
        :show-footer="false"
      >
        <detail-punish-form
          ref="savedetailForm"
          :patch-data="currentItem"
          :type-data="activeName"
          :punish-data="cflxOpts"
          :is-loading="isLoading"
        ></detail-punish-form>
      </v-dialog>
      <v-dialog
        ref="statisticsDialog"
        width="900px"
        :title="activeName == '1' ? '处分统计' : '解除处分统计'"
        :show-footer="false"
      >
        <statistics-details
          ref="savedetailForm"
          :cfzt-data="currentItem"
        ></statistics-details>
      </v-dialog>
    </el-card>
  </div>
</template>

<script>
import basicTable from "_c/tables";
import fdyTable from "_c/tables/fdyTable";
import savePunishForm from "./components/savePunishForm";
import detailPunishForm from "./components/detailPunishForm";
import statisticsDetails from "./components/statisticsDetails";

import {
  punishList,
  add,
  detail,
  edit,
  delPunish,
  removePunish,
  statistics,
  exportPunish,
} from "@/api/punish";
import {
  getOptTxt,
  getXueyuanOptions,
  getCodeOptions2,
} from "@/filters/options";
export default {
  components: {
    basicTable,
    fdyTable,
    savePunishForm,
    detailPunishForm,
    statisticsDetails,
  },
  data() {
    const activeName = this.$route.query.activeName || "1";
    return {
      isRemove: "false", //判断是否为 解除 操作
      hasRemove: "1", //判断是否应有解除信息
      isLoading: true,
      activeName: activeName,
      tableParams: {
        cfzt: activeName,
      },
      multipleSelection: [],
      currentItem: {},
      publishType: {},
      deptOptions: [],
      cflxOpts: [],
      cfyjOpts: [
        { label: "违纪", value: "1" },
        { label: "考试舞弊", value: "2" },
      ],
      showFields: [],
    };
  },
  created() {
    getXueyuanOptions().then((data) => {
      this.deptOptions = data;
    });
    this.getOptions("cflx", "10018");
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
          label: "年级",
          prop: "nj",
        },
        {
          label: this.lang_college,
          prop: "xy",
        },
        {
          label: "处分文号",
          prop: "cfwh",
        },
        {
          label: "处分原因",
          prop: "cfyy",
        },
        {
          label: "违纪原因",
          prop: "cfyj",
        },
        {
          label: "专业",
          prop: "zy",
        },
        {
          label: "班级",
          prop: "bjmc",
        },
        {
          label: "处分类型",
          prop: "cfjb",
        },
        {
          label: "处分开始时间",
          prop: "cfkssj",
        },
        /* {
          label: "解除文号",
          isHide: this.activeName == "1",
          prop: "jcwh",
        }, */
        {
          label: "解除时间",
          isHide: this.activeName == "1",
          prop: "sqjcsj",
        },
      ];
      if (this.isEdit) {
        cols.push({
          label: "操作",
          fixed: "right",
          width: "150px",
          render: (h, row) => {
            if (this.activeName == "1") {
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
                    onClick={() => this.remove(row)}
                    size="middle"
                    class="txt-highlight"
                  >
                    解除
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
            } else {
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
            }
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
        {
          label: "",
          prop: "xyId",
          span: 4,
          type: "selectDialog",
          placeholder: `选择${this.lang_college}`,
          empty: `暂时没有${this.lang_college}`,
          selectData: this.deptOptions,
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
          prop: "cfjbdm",
          span: 4,
          type: "select",
          options: this.cflxOpts,
          placeholder: "选择处分类型",
        },
        {
          label: "",
          placeholder: "选择处分开始时间",
          prop: "cfkssj",
          type: "date",
          dType: "date",
          format: "yyyy-MM-dd",
          formate: "yyyy-MM-dd",
          span: 4,
        },
        {
          label: "",
          placeholder: "选择处分结束时间",
          prop: "cfjssj",
          type: "date",
          dType: "date",
          format: "yyyy-MM-dd",
          formate: "yyyy-MM-dd",
          span: 4,
        },
      ];
    },
  },
  methods: {
    getOptions(type, code) {
      if (!this[type + "Opts"].length) {
        getCodeOptions2(code, {
          label: "dmname",
          value: "dmcode",
        }).then((data) => {
          this[type + "Opts"] = data;
        });
      }
    },
    callServer(pagination) {
      return punishList;
    },
    callServer1(pagination) {
      return punishList;
    },
    tabClick(tab) {
      this.activeName = tab.name;
      this.hasRemove = tab.name;
      this.tableParams.cfzt = tab.name;
      this.$router.replace({
        name: this.$route.name,
        query: {
          activeName: tab.name,
        },
      });
      this.$refs.basicTable.reload();
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
      return exportPunish(
        {
          headers: headers,
          columns: columns,
          cfzt: this.activeName,
        },
        filename
      );
    },
    fecthData() {
      if (this.$refs.basicTable) {
        this.tableParams.cfzt = this.activeName;
        this.$refs.basicTable.fecthData();
      }
    },
    reloadData() {
      if (this.$refs.basicTable) {
        this.tableParams = {
          cfzt: this.activeName,
        };
        this.$refs.basicTable.reload();
      }
    },
    fecthData1() {
      if (this.$refs.basicTable1) {
        this.$refs.basicTable1.fecthData();
      }
    },
    reloadData1() {
      if (this.$refs.basicTable1) {
        this.tableParams = {};
        this.$refs.basicTable1.reload();
      }
    },
    selectionChange(val) {
      this.multipleSelection = val;
    },
    openSaveDialog(item) {
      this.isRemove = "false";
      if (this.activeName == "1") {
        this.hasRemove = "1";
      } else {
        this.hasRemove = "2";
      }
      if (item) {
        this.currentItem = item;
        detail(item.id).then((data) => {
          this.currentItem = data.data.dto || item;
        });
      } else {
        this.currentItem = {};
      }
      this.$refs.saveDialog.dialogVisible = true;
    },
    remove(item) {
      this.currentItem = item;
      detail(item.id).then((data) => {
        this.currentItem = data.data.dto || item;
      });
      this.isRemove = "true";
      this.hasRemove = "2";
      this.$refs.saveDialog.dialogVisible = true;
    },
    openDetailDialog(item) {
      if (item) {
        detail(item.id).then((data) => {
          this.currentItem = data.data.dto || item;
          this.isLoading = false;
        });
      }
      this.$refs.detailDialog.dialogVisible = true;
    },
    saveItem() {
      const me = this;
      this.$refs.saveItemForm.validate((data) => {
        this.$refs.saveDialog.posting = true;
        if (this.isRemove == "false") {
          //新增修改
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
        } else {
          //解除
          removePunish(data)
            .then(() => {
              this.$refs.saveDialog.close();
              me.toast("解除成功", "success");
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
        ids.push(item.id);
      } else {
        if (this.multipleSelection.length) {
          for (const ml of this.multipleSelection) {
            dels.push(ml.xm);
            ids.push(ml.id);
          }
        } else {
          me.toast("请先选择至少一项", "warning");
          return false;
        }
      }
      this.alert("删除处分人：" + dels.join(",") + "。", "确认要进行删除吗？", {
        type: "warning",
        request() {
          return delPunish(ids.join(","));
        },
        success() {
          me.toast("删除成功", "success");
          me.fecthData();
        },
      });
    },
    checkStatistics() {
      this.currentItem = this.activeName;
      this.$refs.statisticsDialog.dialogVisible = true;
    },
  },
};
</script>

<style lang="scss"></style>
