<template>
  <div>
    <div class="tableFiltersWrap">
      <el-row v-if="activeName == 'unAppointment'" class="txt-right">
        <el-col>
          <v-form :fields="fields" :fieldsData="tableParams">
            <el-col :span="12">
              <v-xyzybj-select
                :layout="['xy', 'zy', 'bj']"
                v-model="tableParams"
              ></v-xyzybj-select>
            </el-col>
            <el-col :span="4" class="txt-left">
              <el-button type="primary" @click="fecthData">查询</el-button>
              <el-button type="default" @click="reloadData">清空</el-button>
            </el-col>
          </v-form>
        </el-col>
      </el-row>
      <el-row v-else class="txt-right">
        <el-col>
          <v-form :fields="fields" :fieldsData="tableParams">
            <el-col :span="12">
              <v-xyzybj-select
                :layout="['xy', 'zy', 'bj']"
                v-model="tableParams"
              ></v-xyzybj-select>
            </el-col>
            <el-col :span="4" class="txt-left">
              <el-button type="primary" @click="fecthData1">查询</el-button>
              <el-button type="default" @click="reloadData1">清空</el-button>
            </el-col>
          </v-form>
        </el-col>
      </el-row>
    </div>
    <el-card shadow="never" class="card-header-tabs">
      <div slot="header" class="clearfix">
        <el-tabs v-model="activeName" @tab-click="tabClick">
          <el-tab-pane label="未任命" name="unAppointment"></el-tab-pane>
          <el-tab-pane label="已任命" name="appointment"></el-tab-pane>
        </el-tabs>
        <div class="btns-wrap">
          <v-table-set-btn
            v-if="activeName != 'unAppointment'"
            :columns="columns"
            :download="exportsExecutes"
            file-name="班主任带班信息"
            @colsChange="colsChange"
          >
          </v-table-set-btn>
          <v-btn
            v-if="activeName == 'unAppointment'"
            class="fn-ml10"
            type="add"
            txt="任命"
            @handleClick="openSaveDialog"
          ></v-btn>
          <span v-else class="fn-ml10">
            <v-btn
              type="edit"
              txt="修改任命"
              @handleClick="openSaveDialog"
            ></v-btn>
            <v-btn type="del" txt="取消任命" @handleClick="del"></v-btn>
          </span>
        </div>
      </div>
      <v-page v-if="activeName == 'unAppointment'">
        <basic-table
          :columns="columns"
          :call-server="callServer"
          @selectionChange="selectionChange"
          v-model="tableParams"
          ref="basicTable"
        >
        </basic-table>
      </v-page>
      <v-page v-else>
        <basic-table
          :columns="columns"
          :call-server="callServer1"
          @selectionChange="selectionChange"
          v-model="tableParams"
          ref="basicTable1"
        >
        </basic-table>
      </v-page>
      <v-dialog
        ref="saveDialog"
        width="840px"
        @handleClose="saveItem"
        title="任命班主任"
      >
        <fdy-table ref="fdyTable"></fdy-table>
      </v-dialog>
    </el-card>
  </div>
</template>

<script>
import basicTable from "_c/tables";
import fdyTable from "_c/tables/fdyTable";

import {
  getUnAppointList,
  getAppointList,
  appointBzr,
  disAppointBzr,
  changeAppointBzr,
  exportBzrClassList,
} from "@/api/bzrClass";
export default {
  components: {
    basicTable,
    fdyTable,
  },
  data() {
    const activeName = this.$route.query.activeName || "unAppointment";
    return {
      activeName: activeName,
      tableParams: {},
      multipleSelection: [],
      currentItem: {},
      fields: [
        {
          label: "",
          placeholder: "请选择年级",
          prop: "nj",
          type: "date",
          dType: "year",
          format: "yyyy",
          formate: "yyyy",
          span: 4,
        },
      ],
      showFields: [],
    };
  },
  computed: {
    columns: function () {
      const cols = [
        {
          label: "院系",
          prop: "xy",
        },
        {
          label: "专业",
          prop: "zy",
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
          label: "班级人数",
          prop: "classNum",
        },
        {
          label: "班主任",
          isHide: this.activeName == "unAppointment",
          prop: "xm",
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
  },
  methods: {
    callServer(pagination) {
      return getUnAppointList;
    },
    callServer1(pagination) {
      return getAppointList;
    },
    colsChange(showFields) {
      this.showFields = showFields;
    },
    exportsExecutes(fields, filename) {
      const headers = [];
      const columns = [];
      console.log(fields);
      fields.forEach((item, i) => {
        if (item.column && item.column != "") {
          columns.push(item.column);
          headers.push(item.header);
        }
      });
      return exportBzrClassList(
        {
          headers: headers,
          columns: columns,
          appointStatus: "1",
        },
        filename
      );
    },
    save() {
      const me = this;
      const roleids = this.ruleForm.resourceids;
      grantRole({
        userId: me.currentItem.userid,
        roleids: roleids.join(","),
      }).then((data) => {
        me.toast("操作成功", "success");
      });
    },
    cancel() {
      this.showRight = false;
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
      params.appointStatus = "1";
      exportBzrClassList(params);
    },
    openSaveDialog() {
      if (this.multipleSelection.length) {
        this.$refs.saveDialog.dialogVisible = true;
      } else {
        this.toast("请至少选择一个班级", "warning");
      }
    },
    saveItem() {
      const me = this;
      if (this.$refs.fdyTable.multipleSelection.length == 1) {
        this.$refs.saveDialog.posting = true;
        const infoIds = [];
        const bjids = [];
        const ids = [];
        for (const ml of this.$refs.fdyTable.multipleSelection) {
          infoIds.push(ml.infoid);
        }
        for (const bj of this.multipleSelection) {
          bjids.push(bj.bjid);
        }
        for (const bj of this.multipleSelection) {
          ids.push(bj.id);
        }
        if (this.activeName == "unAppointment") {
          appointBzr({
            bjids: bjids,
            infoId: infoIds.join(","),
          }).then((data) => {
            me.toast("操作成功", "success");
            this.$refs.saveDialog.posting = false;
            this.$refs.saveDialog.close();
            me.fecthData();
          });
        } else {
          changeAppointBzr({
            ids: ids,
            infoId: infoIds.join(","),
          }).then((data) => {
            me.toast("操作成功", "success");
            this.$refs.saveDialog.posting = false;
            this.$refs.saveDialog.close();
            me.fecthData1();
          });
        }
      } else {
        this.toast("请选择一名班主任", "warning");
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
    },
    del(item) {
      const me = this;
      const dels = [];
      const ids = [];
      if (this.multipleSelection.length) {
        for (const ml of this.multipleSelection) {
          dels.push(ml.bjmc);
          ids.push(ml.id);
        }
        this.alert("取消任命：" + dels.join(",") + "。", "确认要取消任命吗？", {
          type: "warning",
          request() {
            return disAppointBzr({
              ids: ids,
            });
          },
          success() {
            me.toast("取消成功", "success");
            me.fecthData1();
          },
        });
      } else {
        this.toast("请至少选择一项", "warning");
      }
    },
  },
};
</script>

<style lang="scss"></style>
