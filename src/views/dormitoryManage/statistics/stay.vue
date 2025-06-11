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
    <v-page>
      <el-card shadow="never" class="card-header-tabs">
        <div slot="header" class="clearfix">
          <div class="txt-right fn-pr15">
            <v-table-set-btn
              file-name="宿位调整记录"
              :download="exportsExecutes"
              :columns="columns"
              :params="tableParams"
              :fields="fields"
              @colsChange="colsChange"
            >
            </v-table-set-btn>
          </div>
        </div>
        <div class="text item">
          <basic-table
            ref="basicTable"
            :columns="columns"
            :call-server="callServer"
            @selectionChange="selectionChange"
            v-model="tableParams"
            :muti="false"
          ></basic-table>
        </div>
        <v-dialog
          :show-footer="false"
          width="720px"
          ref="stuDialog"
          title="学生详情"
        >
          <student-info
            ref="studentInfo"
            :patch-data="currentItem"
          ></student-info>
        </v-dialog>
      </el-card>
    </v-page>
  </div>
</template>

<script>
import {
  studentAssignTjList,
  exportStudentAssignTjList,
} from "@/projects/hbmu-suguan/api/statistical";
import { mapGetters, mapActions } from "vuex";
import basicTable from "_c/tables";
import studentInfo from "../components/studentInfo.vue";
import { tree } from "@/projects/hbmu-suguan/api/sgApt";

export default {
  components: {
    basicTable,
    studentInfo,
  },
  created() {
    this.getOpts(["xbOpts", "mzOpts"]);
  },
  data() {
    return {
      tableParams: {},
      showFields: [],
      currentItem: {},
    };
  },
  computed: {
    ...mapGetters(["xbOpts", "mzOpts"]),
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
                onClick={() => this.openStuDialog(row)}
                size="middle"
                class="txt-highlight"
              >
                {row.xm}
              </el-button>
            );
          },
        },
        {
          label: "性别",
          prop: "xb",
        },
        {
          label: "空床数",
          prop: "wzTotal",
          empty: "0",
        },
        {
          label: "标准房",
          prop: "bedTotal",
          empty: "0",
        },
        {
          label: this.lang_college,
          prop: "xy",
        },
        {
          label: "年级",
          prop: "nj",
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
          label: "学制",
          prop: "xz",
        },
        {
          label: "联系方式",
          prop: "lxfs",
        },
        {
          label: "宿舍",
          prop: "fullName",
          width: "160px",
        },
        {
          label: "辅导员",
          prop: "fdy",
        },
        {
          label: "辅导员电话",
          prop: "fdydh",
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
    fields() {
      const me = this;
      return [
        {
          label: "",
          prop: "xh",
          span: 4,
          type: "text",
          placeholder: "请输入学号",
        },
        {
          label: "",
          prop: "xm",
          span: 4,
          type: "text",
          placeholder: "请输入姓名",
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
          prop: "mz",
          span: 4,
          type: "select",
          placeholder: "请选择民族",
          options: this.mzOpts,
        },
        {
          label: "",
          span: 8,
          type: "xyzybj",
          layout: ["xy", "bj"],
        },
        {
          label: "",
          placeholder: "请选择年级",
          prop: "nj",
          span: 4,
          type: "date",
          dType: "year",
          format: "yyyy",
          formate: "yyyy",
        },
        {
          label: "",
          prop: "aptId",
          type: "tree",
          placeholder: "请选择宿舍位置",
          span: 4,
          nodeKey: "aptId",
          expandedKeys: ["node0"],
          defaultProps: {
            label: "aptName",
            value: "aptId",
            children: "children",
            isLeaf: "isLeaf",
          },
          loadNode: function (node, resolve) {
            // 一级节点处理
            if (node.level === 0) {
              tree({ aptId: "", aptLevel: "" }).then((leafs) => {
                const data = leafs.data;
                return resolve([
                  {
                    aptName: data[0].aptName,
                    aptId: "node0",
                    aptLevel: data[0].aptLevel,
                    isLeaf: false,
                  },
                ]);
              });
            }
            if (node.level >= 1) resolve([]);
            if (node.data) {
              tree({
                aptId: node.key == "node0" ? "" : node.key,
                aptLevel: node.data.aptLevel,
              }).then((leafs) => {
                const data = leafs.data;
                const arr = [];
                for (let i = 0; i < data.length; i++) {
                  arr.push({
                    aptName: data[i].aptName,
                    aptId: data[i].aptId,
                    aptLevel: data[i].aptLevel,
                    isLeaf: data[i].aptLevel == "room" ? true : false,
                  });
                }
                return resolve(arr);
              });
            }
          },
          handleClick: function (node) {
            me.tableParams.aptLevel = node.aptLevel;
          },
        },
        {
          label: "",
          prop: "fullname",
          span: 4,
          type: "text",
          placeholder: "请输入宿舍",
        },
      ];
    },
  },
  methods: {
    ...mapActions(["getOpts"]),
    exportsExecutes(fields, filename) {
      return exportStudentAssignTjList(
        Object.assign(this.tableParams, {
          excelDtos: fields,
        }),
        filename
      );
    },
    colsChange(showFields) {
      this.showFields = showFields;
    },
    callServer(pagination) {
      return studentAssignTjList;
    },
    fecthData() {
      this.$refs.basicTable.fecthData();
    },
    reloadData() {
      this.tableParams = {};
      this.$refs.basicTable.reload();
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
    openSaveDialog(item) {
      this.currentItem = item || {};
      this.$refs.saveDialog.dialogVisible = true;
    },
    openStuDialog(item) {
      this.currentItem = item || {};
      this.$refs.stuDialog.dialogVisible = true;
    },
  },
};
</script>
