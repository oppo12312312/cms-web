<template>
  <div class="check-in-table">
    <el-row>
      <el-col class="fn-mb15 tj-tag">
        <el-tag
          class="fn-mr15"
          v-show="xs.XY"
          v-for="(xs, index) in xyrs"
          :key="index"
          shadow="never"
          >{{ xs.XY }}：{{ xs.ZRS }}人</el-tag
        >
      </el-col>
    </el-row>
    <basic-table
      v-model="tableParams"
      @selectionChange="selectionChange"
      ref="basicTable"
      :call-server="callServer"
      :columns="columns"
    >
      <div slot="tableHeader" class="txt-right">
        <v-form :fields="fields1" :fieldsData="tableParams">
          <el-col :span="6" class="txt-left">
            <el-button type="primary" @click="fecthData()">查询</el-button>
          </el-col>
        </v-form>
        <v-table-set-btn
          file-name="院系入住统计"
          :download="exportsExecutes"
          :columns="columns"
          @colsChange="colsChange"
        ></v-table-set-btn>
      </div>
    </basic-table>
  </div>
</template>
<script>
import basicTable from "_c/tables";
import { assignXyStatics } from "@/projects/hbmu-suguan/api/sgRoomassign";
import {
  listStudents,
  exportStudents,
} from "@/projects/hbmu-suguan/api/sgStudentBed";
import { mapGetters, mapActions } from "vuex";

export default {
  props: {
    patchData: Object,
  },
  components: {
    basicTable,
  },
  data() {
    return {
      currentItem: {},
      tableParams: {
        aptId: this.patchData.aptId,
        aptLevel: this.patchData.aptLevel,
      },
      fields: [
        {
          label: "退宿时间：",
          prop: "bh",
          type: "date",
          placeholder: "请选择退宿时间",
          span: 12,
        },
        {
          label: "退宿原因：",
          prop: "checkoutReason",
          type: "select",
          placeholder: "请选择退宿原因",
          span: 12,
          options: this.tsyyOpts,
        },
        {
          label: "扣除押金：",
          prop: "remark",
          type: "text",
          span: 12,
        },
        {
          label: "扣除原因：",
          prop: "remark",
          type: "text",
          span: 12,
        },
      ],
      fields1: [
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
        // {
        //   label: "",
        //   span: 12,
        //   type: "xyzybj",
        //   layout: ["xy", "zy"],
        // },
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
          prop: "queryType",
          span: 4,
          type: "select",
          placeholder: "选择人员类型",
          options: [
            {
              label: "学生",
              value: "0",
            },
            {
              label: "其他人员",
              value: "1",
            },
          ],
        },
      ],
      showFields: [],
      xyrs: [],
    };
  },
  created() {
    this.getOpts(["tsyyOpts"]);
    assignXyStatics({
      aptId: this.patchData.aptId,
      aptLevel: this.patchData.aptLevel,
    }).then((data) => {
      this.xyrs = data.data;
    });
  },
  computed: {
    ...mapGetters(["tsyyOpts"]),
    columns: function () {
      const cols = [
        {
          label: "学号",
          prop: "xh",
        },
        {
          label: "姓名",
          prop: "xm",
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
          label: "民族",
          prop: "mz",
        },
        {
          label: "宿舍",
          prop: "fullname",
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
  },
  watch: {
    patchData: function () {
      this.init(this.patchData);
    },
  },
  methods: {
    ...mapActions(["getOpts"]),
    init() {
      this.initForm(this.patchData);
    },
    show() {
      this.$refs.saveDialog.dialogVisible = true;
    },
    callServer() {
      return listStudents;
    },
    selectionChange(val) {
      this.multipleSelection = val;
    },
    fecthData(keep) {
      this.$refs.basicTable.fecthData();
    },
    reloadData() {
      this.tableParams = {};
      this.$refs.basicTable.reload();
    },
    exportsExecutes(fields, filename) {
      return exportStudents(
        Object.assign(this.tableParams, {
          excelDtos: fields,
        }),
        filename
      );
    },
    colsChange(showFields) {
      this.showFields = showFields;
    },
  },
};
</script>
<style lang="scss">
.tj-tag {
  .el-tag {
    height: 48px;
    line-height: 48px;
    padding: 0 10px;
  }
}
</style>
