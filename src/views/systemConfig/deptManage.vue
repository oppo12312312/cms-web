<template>
  <div>
    <div class="tableFiltersWrap">
      <el-row v-if="activeType == '0'" class="txt-right">
        <el-col>
          <v-form :fields="fields" :fieldsData="tableParams">
            <el-col :span="4" class="txt-left">
              <el-button type="primary" @click="fecthData">查询</el-button>
              <el-button type="default" @click="reloadData">清空</el-button>
            </el-col>
          </v-form>
        </el-col>
      </el-row>
      <el-row v-else-if="activeType == '1'" class="txt-right">
        <el-col>
          <v-form :fields="fields1" :fieldsData="tableParams">
            <el-col :span="4">
              <v-xyzybj-select
                :layout="['xy']"
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
      <el-row v-else class="txt-right">
        <el-col>
          <v-form :fields="fields2" :fieldsData="tableParams">
            <el-col :span="8">
              <v-xyzybj-select
                :layout="['xy', 'zy']"
                v-model="tableParams"
              ></v-xyzybj-select>
            </el-col>
            <el-col :span="4" class="txt-left">
              <el-button type="primary" @click="fecthData2">查询</el-button>
              <el-button type="default" @click="reloadData2">清空</el-button>
            </el-col>
          </v-form>
        </el-col>
      </el-row>
    </div>
    <el-card shadow="never" class="card-header-tabs">
      <div slot="header" class="clearfix">
        <el-tabs :active-name="tableParams.type" @tab-click="handleTabClick">
          <el-tab-pane label="单位" name="0"></el-tab-pane>
          <el-tab-pane label="专业" name="1"></el-tab-pane>
          <el-tab-pane label="班级" name="2"></el-tab-pane>
        </el-tabs>
        <div class="btns-wrap">
          <v-btn
            v-if="activeType == '0'"
            type="add"
            txt="新增"
            @handleClick="openDwDialog"
          ></v-btn>
          <v-btn
            v-else-if="activeType == '1'"
            type="add"
            txt="新增"
            @handleClick="openZyDialog"
          ></v-btn>
          <v-btn
            v-else
            type="add"
            txt="新增"
            @handleClick="openBjDialog"
          ></v-btn>
          <v-btn type="del" txt="删除" @handleClick="del"></v-btn>
        </div>
      </div>
      <v-page v-if="activeType == '0'">
        <basic-table
          :columns="columns"
          :call-server="callServer"
          @selectionChange="selectionChange"
          v-model="tableParams"
          ref="basicTable"
        ></basic-table>
      </v-page>
      <v-page v-else-if="activeType == '1'">
        <basic-table
          :columns="columns"
          :call-server="callServer1"
          @selectionChange="selectionChange"
          v-model="tableParams"
          ref="basicTable1"
        >
          <!-- <el-row slot="tableHeader" class="txt-right">
            <el-col :span="18">
              <v-form :fields="fields1" :fieldsData="tableParams">
                <el-col :span="4">
                  <v-xyzybj-select
                    :layout="['xy']"
                    v-model="tableParams"
                  ></v-xyzybj-select>
                </el-col>
                <el-col :span="4" class="txt-left">
                  <el-button type="primary" @click="fecthData1">查询</el-button>
                </el-col>
              </v-form>
            </el-col>
            <el-col :span="6">
              <v-btn type="add" txt="新增" @handleClick="openZyDialog"></v-btn>
              <v-btn type="del" txt="删除" @handleClick="del"></v-btn>
            </el-col>
          </el-row>-->
        </basic-table>
      </v-page>
      <v-page v-else>
        <basic-table
          :columns="columns"
          :call-server="callServer2"
          @selectionChange="selectionChange"
          v-model="tableParams"
          ref="basicTable2"
        >
          <!-- <el-row slot="tableHeader" class="txt-right">
            <el-col :span="18">
              <v-form :fields="fields2" :fieldsData="tableParams">
                <el-col :span="8">
                  <v-xyzybj-select
                    :layout="['xy','zy']"
                    v-model="tableParams"
                  ></v-xyzybj-select>
                </el-col>
                <el-col :span="4" class="txt-left">
                  <el-button type="primary" @click="fecthData2">查询</el-button>
                </el-col>
              </v-form>
            </el-col>
            <el-col :span="6">
              <v-btn type="add" txt="新增" @handleClick="openBjDialog"></v-btn>
              <v-btn type="del" txt="删除" @handleClick="del"></v-btn>
            </el-col>
          </el-row>-->
        </basic-table>
      </v-page>
      <v-dialog
        ref="dwDialog"
        @handleClose="saveDwItem"
        width="640px"
        :title="isEmptyObject(currentItem) ? '新增单位' : '修改单位'"
      >
        <save-dept-form
          :patch-data="currentItem"
          ref="saveDwForm"
          @keyUpSubmit="saveDwItem"
        ></save-dept-form>
      </v-dialog>
      <v-dialog
        ref="zyDialog"
        @handleClose="saveZyItem"
        width="640px"
        :title="isEmptyObject(currentItem) ? '新增专业' : '修改专业'"
      >
        <save-major-form
          :patch-data="currentItem"
          ref="saveZyForm"
          @keyUpSubmit="saveZyItem"
        ></save-major-form>
      </v-dialog>
      <v-dialog
        ref="bjDialog"
        @handleClose="saveBjItem"
        width="640px"
        :title="isEmptyObject(currentItem) ? '新增班级' : '修改班级'"
      >
        <save-class-form
          :patch-data="currentItem"
          ref="saveBjForm"
          @keyUpSubmit="saveBjItem"
        ></save-class-form>
      </v-dialog>
    </el-card>
  </div>
</template>

<script>
import basicTable from "_c/tables/";
import saveDeptForm from "./components/saveDeptForm";
import saveMajorForm from "./components/saveMajorForm";
import saveClassForm from "./components/saveClassForm";

import {
  dwList,
  zyList,
  bjList,
  saveDept,
  saveMajor,
  saveClass,
  delDept,
  delMajor,
  delClass,
} from "@/api/deptManage";
import {
  getOptTxt,
  getXueyuanOptions,
  getMajorsOptions,
} from "@/filters/options";

export default {
  components: {
    basicTable,
    saveDeptForm,
    saveMajorForm,
    saveClassForm,
  },
  data() {
    return {
      activeType: "0",
      xyOptions: [],
      zyOptions: [],
      multipleSelection: [],
      tableData: [],
      tableParams: {
        isvalid: "1",
        isjxdw: "",
      },
      fields: [
        {
          label: "",
          placeholder: "请输入单位名称",
          prop: "deptname",
          type: "text",
          span: 4,
        },
        {
          label: "",
          placeholder: "请输入单位代码",
          prop: "deptcode",
          type: "text",
          span: 4,
        },
        {
          label: "",
          placeholder: "是否使用",
          span: 4,
          prop: "isvalid",
          type: "select",
          options: [
            { label: "使用", value: "1" },
            { label: "未使用", value: "0" },
          ],
        },
        {
          label: "",
          placeholder: "是否教学单位",
          span: 4,
          prop: "isjxdw",
          type: "select",
          options: [
            { label: "教学单位", value: "1" },
            { label: "非教学单位", value: "0" },
          ],
        },
      ],
      fields1: [
        {
          label: "",
          placeholder: "请输入专业名称",
          prop: "zy",
          type: "text",
          span: 4,
        },
        {
          label: "",
          placeholder: "请输入专业号",
          prop: "zyh",
          type: "text",
          span: 4,
        },
      ],
      fields2: [
        {
          label: "",
          placeholder: "请输入班号",
          prop: "bh",
          type: "text",
          span: 4,
        },
        {
          label: "",
          placeholder: "请输入班级名称",
          prop: "bjmc",
          type: "text",
          span: 4,
        },
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
      currentItem: {},
    };
  },
  computed: {
    columns() {
      if (this.activeType == "0") {
        return [
          {
            label: "单位代码",
            prop: "deptcode",
          },
          {
            label: "单位名称",
            prop: "deptname",
          },
          {
            label: "单位类型",
            prop: "depttype",
          },
          {
            label: "是否使用",
            render: (h, row) => {
              switch (row.isvalid) {
                case "1":
                  return <span class="txt-success">是</span>;
                  break;
                case "0":
                  return <span class="txt-danger">否</span>;
                  break;
              }
            },
          },
          {
            label: "是否教学单位",
            render: (h, row) => {
              switch (row.isjxdw) {
                case "1":
                  return <span class="txt-success">是</span>;
                  break;
                case "0":
                  return <span class="txt-danger">否</span>;
                  break;
              }
            },
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
                    onClick={() => this.openDwDialog(row)}
                    size="middle"
                    class="txt-highlight"
                  >
                    修改
                  </el-button>
                </div>
              );
            },
          },
        ];
      } else if (this.activeType == "1") {
        return [
          {
            label: "专业号",
            prop: "zyh",
          },
          {
            label: "专业",
            prop: "zy",
          },
          {
            label: this.lang_college,
            render: (h, row) => {
              return <span>{getOptTxt(this.xyOptions, row.xyId)}</span>;
            },
          },
          {
            label: "学科门类",
            prop: "xkml",
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
                    onClick={() => this.openZyDialog(row)}
                    size="middle"
                    class="txt-highlight"
                  >
                    修改
                  </el-button>
                </div>
              );
            },
          },
        ];
      } else {
        return [
          {
            label: "班号",
            prop: "bh",
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
            label: "专业",
            render: (h, row) => {
              return <span>{getOptTxt(this.zyOptions, row.zyId)}</span>;
            },
          },
          {
            label: this.lang_college,
            render: (h, row) => {
              return <span>{getOptTxt(this.xyOptions, row.xyId)}</span>;
            },
          },
          {
            label: "毕业年月",
            prop: "byny",
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
                    onClick={() => this.openBjDialog(row)}
                    size="middle"
                    class="txt-highlight"
                  >
                    修改
                  </el-button>
                </div>
              );
            },
          },
        ];
      }
    },
  },
  created() {
    getXueyuanOptions().then((data) => {
      this.xyOptions = data;
    });
  },
  methods: {
    callServer(pagination) {
      return dwList;
    },
    callServer1(pagination) {
      return zyList;
    },
    callServer2(pagination) {
      getMajorsOptions().then((data) => {
        this.zyOptions = data;
      });
      return bjList;
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
    fecthData2() {
      if (this.$refs.basicTable2) {
        this.$refs.basicTable2.fecthData();
      }
    },
    reloadData2() {
      if (this.$refs.basicTable2) {
        this.tableParams = {};
        this.$refs.basicTable2.reload();
      }
    },
    selectionChange(val) {
      this.multipleSelection = val;
    },
    handleTabClick(tab) {
      this.activeType = tab.name;
    },
    openDwDialog(item) {
      if (item) {
        this.currentItem = item;
        this.$refs.dwDialog.dialogVisible = true;
      } else {
        this.currentItem = {};
        this.$refs.dwDialog.dialogVisible = true;
      }
    },
    openZyDialog(item) {
      if (item) {
        this.currentItem = item;
        this.$refs.zyDialog.dialogVisible = true;
      } else {
        this.currentItem = {};
        this.$refs.zyDialog.dialogVisible = true;
      }
    },
    openBjDialog(item) {
      if (item) {
        this.currentItem = item;
        this.$refs.bjDialog.dialogVisible = true;
      } else {
        this.currentItem = {};
        this.$refs.bjDialog.dialogVisible = true;
      }
    },
    del() {
      if (this.multipleSelection.length) {
        const me = this;
        const ids = [];
        switch (this.activeType) {
          case "1":
            for (let i = 0; i < this.multipleSelection.length; i++) {
              ids.push(this.multipleSelection[i].zyId);
            }
            me.alert("确定移除选中项？", "移除", {
              type: "error",
              request() {
                return delMajor(ids);
              },
              success() {
                me.toast("移除成功", "success");
                me.fecthData1(true);
              },
            });
            break;
          case "2":
            for (let i = 0; i < this.multipleSelection.length; i++) {
              ids.push(this.multipleSelection[i].bjid);
            }
            me.alert("确定移除选中项？", "移除", {
              type: "error",
              request() {
                return delClass(ids);
              },
              success() {
                me.toast("移除成功", "success");
                me.fecthData2(true);
              },
            });
            break;
          default:
            for (let i = 0; i < this.multipleSelection.length; i++) {
              ids.push(this.multipleSelection[i].deptid);
            }
            me.alert("确定移除选中项？", "移除", {
              type: "error",
              request() {
                return delDept(ids);
              },
              success() {
                me.toast("移除成功", "success");
                me.fecthData(true);
              },
            });
            break;
        }
      } else {
        this.toast("请先选择至少一项", "warning");
      }
    },
    saveDwItem() {
      const me = this;
      this.$refs.saveDwForm.validate((data) => {
        this.$refs.dwDialog.posting = true;
        saveDept(data)
          .then(() => {
            this.$refs.dwDialog.close();
            me.toast("提交成功", "success");
            me.fecthData();
          })
          .catch((err) => {
            this.$refs.dwDialog.posting = false;
          });
      });
    },
    saveZyItem() {
      const me = this;
      this.$refs.saveZyForm.validate((data) => {
        this.$refs.zyDialog.posting = true;
        saveMajor(data)
          .then(() => {
            this.$refs.zyDialog.close();
            me.toast("提交成功", "success");
            me.fecthData1();
          })
          .catch((err) => {
            this.$refs.zyDialog.posting = false;
          });
      });
    },
    saveBjItem() {
      const me = this;
      this.$refs.saveBjForm.validate((data) => {
        this.$refs.bjDialog.posting = true;
        saveClass(data)
          .then(() => {
            this.$refs.bjDialog.close();
            me.toast("提交成功", "success");
            me.fecthData2();
          })
          .catch((err) => {
            this.$refs.bjDialog.posting = false;
          });
      });
    },
  },
  watch: {
    activeType: function (val) {
      this.tableParams = {};
      if (val == "0") {
        this.tableParams = {
          isvalid: "1",
          isjxdw: "",
        };
      }
    },
  },
};
</script>
