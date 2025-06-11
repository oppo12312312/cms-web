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
            :muti="false"
            ref="basicTable"
            :columns="columns"
            :props-data="tableData"
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
      </el-card>
    </v-page>
  </div>
</template>

<script>
import {
  apttjTotalList,
  exportApttjTotal,
} from "@/projects/hbmu-suguan/api/statistical";
import { mapGetters, mapActions } from "vuex";
import basicTable from "_c/tables";
import studentInfo from "../components/studentInfo.vue";
import { tree } from "@/projects/hbmu-suguan/api/sgApt";
import { campusOptions } from "@/projects/hbmu-suguan/filters/options";

export default {
  components: {
    basicTable,
    studentInfo,
  },
  created() {
    this.getOpts(["xbOpts"]);
    campusOptions(true).then((data) => {
      this.campusOpts = data;
    });
    this.callServer();
  },
  data() {
    return {
      tableParams: {},
      showFields: [],
      currentItem: {},
      tableData: [],
      campusOpts: [],
      zoneOpts: [],
    };
  },
  computed: {
    ...mapGetters(["xbOpts"]),
    columns: function () {
      const cols = [
        {
          label: "校区",
          prop: "campusName",
        },
        {
          label: "公寓区",
          prop: "zoneName",
        },
        {
          label: "楼栋",
          prop: "apartmentName",
        },
        {
          label: "房间数",
          prop: "roomTotal",
        },
        {
          label: "床位数",
          prop: "bedTotal",
        },
        {
          label: "已住人数",
          prop: "yzTotal",
          empty: "0",
        },
        {
          label: "空床数",
          prop: "wzTotal",
          empty: "0",
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
          prop: "campusId",
          span: 4,
          type: "select",
          placeholder: "请选择校区",
          options: this.campusOpts,
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
          prop: "zonetId",
          type: "select",
          placeholder: "请选择公寓区",
          span: 4,
          options: this.zoneOpts,
        },
      ];
    },
  },
  watch: {
    "tableParams.campusId": function (nVal, oVal) {
      if (nVal != oVal) {
        tree({
          aptId: nVal,
          aptLevel: "campus",
        }).then((data) => {
          const arr = [];
          for (let i = 0; i < data.data.length; i++) {
            arr.push({
              label: data.data[i].aptName,
              value: data.data[i].aptId,
            });
          }
          this.$set(this, "zoneOpts", arr);
        });
      }
    },
  },
  methods: {
    ...mapActions(["getOpts"]),
    exportsExecutes(fields, filename) {
      return exportApttjTotal(
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
      apttjTotalList(this.tableParams).then((data) => {
        this.tableData = data.data;
      });
    },
    fecthData() {
      this.callServer();
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
