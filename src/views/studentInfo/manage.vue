<template>
  <div>
    <div class="tableFiltersWrap">
      <el-row class="txt-right">
        <el-col>
          <el-tabs v-model="queryAct" @tab-click="queryClick">
            <el-tab-pane
              v-for="(qr, index) in querys"
              :key="index"
              :label="qr.label"
              :name="qr.label"
            >
              <v-form :fields="qr.fields" :fieldsData="tableParams">
                <el-col :span="4" class="txt-left">
                  <el-button type="primary" @click="fecthData">查询</el-button>
                  <el-button type="default" @click="reloadData">清空</el-button>
                </el-col>
              </v-form>
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
    </div>
    <el-card shadow="never" class="card-header-tabs">
      <div slot="header" class="clearfix">
        <el-tabs v-model="activeName" @tab-click="tabClick">
          <el-tab-pane label="在校" name="1"></el-tab-pane>
          <el-tab-pane label="所有" name="2"></el-tab-pane>
        </el-tabs>
        <div class="btns-wrap">
          <v-table-set-btn
            file-name="学生名单"
            :download="exportsExcel"
            :columns="columns"
            @colsChange="colsChange"
          >
            <v-import-btn
              v-if="isEdit"
              @uploaded="fecthData"
              importid="importStdInfo"
              filename="学生基本信息导入模板"
            ></v-import-btn>
            <el-button v-if="isEdit" type="default" @click="initPass"
              >初始化密码</el-button
            >
            <el-button v-if="isEdit" type="default" @click="exportsForm"
              >导出登记表</el-button
            >
            <el-button type="default" v-if="isEdit" @click="exportsPhoto"
              >导出照片</el-button
            >
          </v-table-set-btn>

          <v-btn
            v-if="isEdit"
            class="fn-ml10"
            type="add"
            @handleClick="$router.push({ name: 'studentInfoSave' })"
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
  </div>
</template>

<script>
import {
  stuList,
  exportsExcel,
  initPass,
  exportsPhoto,
  exportsForm,
} from "@/api/stuInfo";
import { getXueyuanOptions } from "@/filters/options";
import basicTable from "_c/tables";
import minxin from "./minxin/";
import { getOptTxt, getCodeOptions } from "@/filters/options";

export default {
  mixins: [minxin],
  components: {
    basicTable,
  },
  data() {
    const activeName = this.$route.query.activeName || "1";
    return {
      activeName: activeName,
      tableParams: {
        sfzx: activeName,
        // truename: "",
        // username: "",
        // deptname: "",
      },
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
                onClick={() =>
                  this.$router.push({
                    name: "stuDetail",
                    query: {
                      studentId: row.studentId,
                    },
                  })
                }
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
                  onClick={() =>
                    this.$router.push({
                      name: "studentInfoSave",
                      query: {
                        studentId: row.studentId,
                      },
                    })
                  }
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
    querys: function () {
      const me = this;
      return [
        {
          label: "学生信息查询",
          fields: [
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
          ],
        },
        {
          label: "联系方式反查",
          fields: [
            {
              label: "",
              prop: "lxdh",
              span: 4,
              type: "text",
              placeholder: "输入手机号",
            },
            {
              label: "",
              prop: "qqh",
              span: 4,
              type: "text",
              placeholder: "输入QQ号",
            },
            {
              label: "",
              prop: "wxh",
              span: 4,
              type: "text",
              placeholder: "输入微信号",
            },
            {
              label: "",
              prop: "email",
              span: 4,
              type: "text",
              placeholder: "输入邮箱",
            },
          ],
        },
        {
          label: "家庭信息反查",
          fields: [
            {
              label: "",
              prop: "fmxm",
              span: 4,
              type: "text",
              placeholder: "输入父母姓名",
            },
            {
              label: "",
              prop: "fmlxfs",
              span: 4,
              type: "text",
              placeholder: "输入父母联系方式",
            },
            {
              label: "",
              prop: "tsxslx",
              span: 4,
              type: "select",
              placeholder: "选择特殊学生类型",
              multiple: true,
              options: this.tsxslxOpts,
              change() {
                for (let i = 0; i < me.tsxslxOpts.length; i++) {
                  delete me.tableParams[me.tsxslxOpts[i].value];
                }
                for (let i = 0; i < me.tableParams.tsxslx.length; i++) {
                  me.tableParams[me.tableParams.tsxslx[i]] = "是";
                }
              },
            },
          ],
        },
        {
          label: "住宿信息反查",
          fields: [
            {
              label: "",
              prop: "xndz",
              span: 4,
              type: "text",
              placeholder: "输入宿舍地址",
            },
          ],
        },
        {
          label: "违纪情况反查",
          fields: [
            {
              label: "",
              prop: "cflx",
              span: 4,
              type: "select",
              placeholder: "请选择处分类型",
              options: this.cflxOpts,
            },
            {
              label: "",
              prop: "cfwh",
              span: 4,
              type: "text",
              placeholder: "输入处分文号",
            },
            {
              label: "",
              prop: "cfyy",
              span: 4,
              type: "text",
              placeholder: "输入处分原因",
            },
          ],
        },
        {
          label: "获奖助补优反查",
          fields: [
            {
              label: "",
              prop: "jzxmmc",
              span: 4,
              type: "text",
              placeholder: "输入项目名称",
            },
            {
              label: "",
              prop: "jzxn",
              span: 4,
              type: "date",
              dType: "year",
              format: "yyyy",
              formate: "yyyy",
              placeholder: "选择学年",
            },
            {
              label: "",
              prop: "jzpc",
              span: 4,
              type: "text",
              placeholder: "输入批次名称",
            },
          ],
        },
        {
          label: "勤工信息反查",
          fields: [
            {
              label: "",
              prop: "qgdw",
              span: 4,
              type: "select",
              placeholder: "请选择勤工单位",
              options: this.cflxOpts,
            },
            {
              label: "",
              prop: "qggw",
              span: 4,
              type: "select",
              placeholder: "请选择勤工岗位",
              options: this.cflxOpts,
            },
            {
              label: "",
              prop: "gwzt",
              span: 4,
              type: "select",
              placeholder: "请选择勤工状态",
              options: this.cflxOpts,
            },
          ],
        },
        {
          label: "家庭经济情况反查",
          fields: [
            {
              label: "",
              prop: "kndj",
              span: 4,
              type: "select",
              placeholder: "请选择困难等级",
              options: this.cflxOpts,
            },
            {
              label: "",
              prop: "jtknxn",
              span: 4,
              type: "date",
              dType: "year",
              format: "yyyy",
              formate: "yyyy",
              placeholder: "选择困难学年",
            },
          ],
        },
      ];
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
      return stuList;
    },
    fecthData() {
      if (this.$refs.basicTable) {
        this.$refs.basicTable.fecthData();
      }
    },
    exportsPhoto() {
      return exportsPhoto(Object.assign(this.tableParams), "学生照片");
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
      return exportsExcel(
        Object.assign(this.tableParams, {
          excelDtos: fields,
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
    initPass() {
      const me = this;
      const dels = [];
      const ids = [];
      if (this.multipleSelection.length) {
        for (const ml of this.multipleSelection) {
          dels.push(ml.xm);
          ids.push(ml.studentId);
        }
      } else {
        me.toast("请先选择至少一项", "warning");
        return false;
      }
      this.alert(
        "初始化密码：" + dels.join(",") + "。",
        "确认要进行密码初始化吗？",
        {
          type: "warning",
          request() {
            return initPass({ studentIds: ids });
          },
          success() {
            me.toast("初始化成功", "success");
            me.fecthData();
          },
        }
      );
    },
  },
};
</script>
