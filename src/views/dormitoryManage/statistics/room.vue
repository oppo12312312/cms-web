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
              :file-name="`${lang_college}住宿情况统计`"
              :download="exportsExecutes"
              :columns="columns"
              :params="tableParams"
              :fields="fields"
              @colsChange="colsChange"
              :easy-export="true"
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
      </el-card>
    </v-page>
  </div>
</template>

<script>
import {
  xytjTotalList,
  exportXytjTotal,
} from "@/projects/hbmu-suguan/api/statistical";
import { mapGetters, mapActions } from "vuex";
import basicTable from "_c/tables";
import { tree } from "@/projects/hbmu-suguan/api/sgApt";

export default {
  components: {
    basicTable,
  },
  created() {
    this.callServer();
  },
  data() {
    return {
      tableParams: {},
      showFields: [],
      currentItem: {},
      tableData: [],
    };
  },
  computed: {
    ...mapGetters(["xbOpts"]),
    columns: function () {
      const cols = [
        {
          label: this.lang_college,
          prop: "xy",
        },
        {
          label: "班级",
          prop: "bjmc",
          isHide: this.tableParams.tjlx == "bj" ? false : true,
        },
        {
          label: "年级",
          prop: "nj",
          isHide: this.tableParams.tjlx == "nj" ? false : true,
        },
        {
          label: "学生类别",
          prop: "xslb",
          isHide: this.tableParams.tjlx == "xslb" ? false : true,
        },
        {
          label: "全部",
          children: [
            {
              label: "总人数",
              prop: "zrs",
              empty: "0",
            },
            {
              label: "已住人数",
              prop: "yzrs",
              empty: "0",
            },
            {
              label: "未住人数",
              prop: "wzrs",
              empty: "0",
            },
          ],
        },
        {
          label: "男",
          children: [
            {
              label: "总人数",
              prop: "manZrs",
              empty: "0",
            },
            {
              label: "已住人数",
              prop: "manYzrs",
              empty: "0",
            },
            {
              label: "未住人数",
              prop: "manWzrs",
              empty: "0",
            },
          ],
        },
        {
          label: "女",
          children: [
            {
              label: "总人数",
              prop: "womanZrs",
              empty: "0",
            },
            {
              label: "已住人数",
              prop: "womanYzrs",
              empty: "0",
            },
            {
              label: "未住人数",
              prop: "womanWzrs",
              empty: "0",
            },
          ],
        },
      ];
      switch (this.tableParams.tjlx) {
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
    fields() {
      return [
        {
          label: "",
          span: 6,
          prop: "tjlx",
          type: "select",
          placeholder: "统计类型",
          options: [
            {
              label: "按院系统计",
              value: "xy",
            },
            {
              label: "按班级统计",
              value: "bj",
            },
            {
              label: "按年级统计",
              value: "nj",
            },
            {
              label: "按学生类别统计",
              value: "xslb",
            },
          ],
        },
      ];
    },
  },
  methods: {
    exportsExecutes(fields, filename) {
      return exportXytjTotal(this.tableParams, filename);
    },
    colsChange(showFields) {
      this.showFields = showFields;
    },
    callServer(pagination) {
      xytjTotalList(this.tableParams).then((data) => {
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
  },
};
</script>
