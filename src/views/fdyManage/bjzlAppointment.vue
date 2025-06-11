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
            file-name="班级助理带班信息"
            @colsChange="colsChange"
          >
          </v-table-set-btn>
          <v-btn
            v-if="activeName == 'unAppointment'"
            class="fn-ml10"
            type="add"
            txt="任命"
            @handleClick="appointBjzlSave"
          ></v-btn>
          <span v-else class="fn-ml10">
            <v-btn
              type="edit"
              txt="修改任命"
              @handleClick="appointBjzlSave"
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
    </el-card>
  </div>
</template>

<script>
import basicTable from "_c/tables";
import fdyTable from "_c/tables/fdyTable";

import {
  getUnAppointList,
  getAppointList,
  appointBjzl,
  disAppointBjzl,
  changeAppointBjzl,
  bjzlDetail,
  exportBjzlClassList,
} from "@/api/bjzlClass";
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
      bjzlXh: "",
      username: "",
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
          label: "班级助理学号",
          prop: "username",
          render: (h, row) => {
            return (
              <input
                type="text"
                class="w100 table-input small"
                placeholder="学号"
                value={row.username}
                onBlur={(e) => this.getBjzl(e, row)}
              ></input>
            );
          },
        },
        {
          label: "班级助理姓名",
          prop: "xm",
          render: (h, row) => {
            return (
              <input
                type="text"
                class="w100 table-input small is-disabled"
                value={row.xm}
                disabled
              ></input>
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
      return exportBjzlClassList(
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
      exportBjzlClassList(params);
    },
    getBjzl(e, row) {
      row.username = e.target.value;
      const val = e.target.value;
      const me = this;
      if (val) {
        const obj = {
          xh: val,
          bjid: row.bjid,
        };
        bjzlDetail(obj)
          .then((data) => {
            row.xm = data.data.xm || "";
          })
          .catch((err) => {
            me.toast(err, "warning");
            row.username = "";
          });
      }
    },
    selectionChange(val) {
      this.multipleSelection = val;
    },
    appointBjzlSave() {
      const me = this;
      if (this.multipleSelection.length) {
        //this.$refs.saveDialog.dialogVisible = true;
        const bjzlList = [];
        for (const ml of this.multipleSelection) {
          const obj = {
            bjid: ml.bjid,
            id: ml.id || "",
            username: ml.username,
          };
          bjzlList.push(obj);
        }
        if (this.activeName == "unAppointment") {
          appointBjzl(bjzlList).then((data) => {
            me.toast("操作成功", "success");
            me.fecthData();
          });
        } else {
          changeAppointBjzl(bjzlList).then((data) => {
            me.toast("操作成功", "success");
            me.fecthData1();
          });
        }
      } else {
        this.toast("请至少选择一个班级", "warning");
      }
    },
    tabClick(tab) {
      this.activeName = tab.name;
      /* switch(this.activeName){
        case 'appointment':

      } */
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
            return disAppointBjzl(ids);
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

<style lang="scss">
.table-input {
  -webkit-appearance: none;
  background-color: #ffffff;
  background-image: none;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  box-sizing: border-box;
  color: #606266;
  display: inline-block;
  font-size: inherit;
  height: 40px;
  line-height: 40px;
  outline: none;
  padding: 0 15px;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  width: 100%;
  &.small {
    height: 32px;
    line-height: 32px;
  }
  &.is-disabled {
    background-color: #f5f7fa;
    border-color: #dfe4ed;
    color: #c0c4cc;
    cursor: not-allowed;
  }
}
</style>
