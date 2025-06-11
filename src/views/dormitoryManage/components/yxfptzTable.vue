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
        <v-dialog ref="clearDialog" @handleClose="save" title="保存">
          <v-form
            ref="ruleForm"
            v-if="clearForm"
            :fields="fields1"
            :fieldsData="ruleForm"
          >
          </v-form>
        </v-dialog>
      </el-card>
    </v-page>
  </div>
</template>

<script>
import {
  batchDetailList,
  exportBatchDetaiList,
  rangeAdjustSave,
  rangeAdjustClear,
} from "@/projects/hbmu-suguan/api/sgPreRange";
import { mapGetters, mapActions } from "vuex";
import basicTable from "_c/tables";
import studentInfo from "../components/studentInfo.vue";
import { tree } from "@/projects/hbmu-suguan/api/sgApt";
import minxin from "../minxins/minxin";

export default {
  components: {
    basicTable,
    studentInfo,
  },
  mixins: [minxin],
  props: {
    patchData: Object,
  },
  created() {
    this.getOpts(["xbOpts", "tsyyOpts"]);
  },
  data() {
    return {
      tableParams: {},
      showFields: [],
      currentItem: {},
      ruleForm: {
        xyId: "",
        bjid: "",
      },
      clearForm: false,
    };
  },
  computed: {
    ...mapGetters(["xbOpts"]),
    columns: function () {
      const cols = [
        {
          label: "床位",
          prop: "fullname",
          width: "160px",
        },
        {
          label: "床位性别",
          prop: "roomSex",
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
          label: `学生${this.lang_college}`,
          prop: "stdXy",
        },
        {
          label: "学生班级",
          prop: "stdBj",
        },
        {
          label: `${this.lang_college}范围`,
          prop: "xy",
        },
        {
          label: "班级范围",
          prop: "bjmc",
        },
        {
          label: "操作",
          fixed: "right",
          width: "120px",
          render: (h, row) => {
            if (!row.xh) {
              return (
                <div>
                  <el-button
                    type="text"
                    onClick={() => this.clear(row)}
                    size="middle"
                    class="txt-highlight"
                  >
                    清空
                  </el-button>
                  <el-button
                    type="text"
                    onClick={() => this.openClearDialog(row)}
                    size="middle"
                    class="txt-highlight"
                  >
                    保存
                  </el-button>
                </div>
              );
            }
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
          prop: "roomSex",
          span: 4,
          type: "select",
          placeholder: "请选择性别",
          options: this.xbOpts,
        },
        {
          label: "",
          span: 8,
          type: "xyzybj",
          layout: ["xy", "bj"],
          xyHolder: `请选择${this.lang_college}范围`,
          bjHolder: "请选择班级范围",
        },
        {
          label: "",
          prop: "aptId",
          type: "tree",
          placeholder: "请选择宿舍范围",
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
          prop: "wholeRoom",
          span: 4,
          type: "select",
          placeholder: "床位状态",
          options: this.fullStatusOpts,
        },
      ];
    },
    fields1() {
      const me = this;
      return [
        {
          label: `${this.lang_college}范围：`,
          type: "xyzybj",
          layout: ["xy"],
          xyId: this.currentItem.xyId,
          xyHolder: `请选择${this.lang_college}范围`,
          gutter: 0,
        },
        {
          label: "班级范围：",
          type: "xyzybj",
          layout: ["bj"],
          xyId: this.currentItem.xyId,
          bjid: this.currentItem.bjid,
          xyHolder: "请选择班级范围",
          gutter: 0,
        },
      ];
    },
  },
  methods: {
    ...mapActions(["getOpts"]),
    exportsExecutes(fields, filename) {
      return exportBatchDetaiList(
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
      return batchDetailList;
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
    openClearDialog(item) {
      this.currentItem = item;
      this.$refs.clearDialog.dialogVisible = true;
      this.clearForm = true;
    },
    clear(item) {
      const me = this;
      this.alert("确认清空床位的预分配信息？", "清空", {
        type: "warning",
        request() {
          return rangeAdjustClear({
            beds: [item.bedId],
            settingId: me.patchData.settingId,
          });
        },
        success() {
          me.toast("您选择的范围清空成功", "success");
          me.fecthData();
        },
      });
    },
    save(item) {
      const me = this;
      this.alert("确认进行分配吗？", "确认", {
        type: "warning",
        request() {
          return rangeAdjustSave({
            beds: [me.currentItem.bedId],
            xyId: me.ruleForm.xyId ? me.ruleForm.xyId : me.currentItem.xyId,
            bjid: me.ruleForm.bjid ? me.ruleForm.bjid : me.currentItem.bjid,
            settingId: me.patchData.settingId,
          });
        },
        success() {
          me.toast("分配成功", "success");
          me.$refs.clearDialog.close();
          me.fecthData();
        },
      });
    },
  },
};
</script>
