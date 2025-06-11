<template>
  <v-dialog
    width="720px"
    ref="saveDialog"
    @handleClose="saveItem"
    :title="getTitle(tsType)"
  >
    <basic-table
      class="check-in-table fn-mb15"
      v-model="tableParams"
      v-if="tsType == 'overall'"
      ref="basicTable"
      :muti="false"
      :call-server="callServer"
      :columns="columns1"
    ></basic-table>
    <student-info
      :patch-data="patchData"
      v-else-if="tsType == 'single'"
    ></student-info>
    <basic-table
      v-else-if="tsType == 'many'"
      :muti="false"
      :props-data="patchData.selected"
      :columns="columns"
    ></basic-table>
    <el-card shadow="never">
      <div slot="header" class="clearfix">
        <span>退宿操作</span>
      </div>
      <v-form
        ref="ruleForm"
        class="fn-mt15"
        :fields="fields"
        :fieldsData="ruleForm"
      ></v-form>
    </el-card>
  </v-dialog>
</template>
<script>
import studentInfo from "./studentInfo";
import {
  checkout,
  checkoutByBeds,
} from "@/projects/hbmu-suguan/api/sgRoomassign";
import { mapGetters, mapActions } from "vuex";
import basicTable from "_c/tables";
import { listBeds } from "@/projects/hbmu-suguan/api/sgStudentRoom";

export default {
  name: "checkOutForm",
  props: {
    patchData: Object,
  },
  components: {
    studentInfo,
    basicTable,
  },
  watch: {
    patchData: function () {
      this.init();
    },
  },
  data() {
    return {
      tableParams: {},
      ruleForm: {
        aptId: "",
        aptLevel: "",
        checkoutReason: "",
        checkoutTime: "",
        deduction: 0,
        deductionReason: "",
        remark: "",
      },
      columns1: [
        {
          label: "床号",
          prop: "bedCode",
          empty: "空床",
        },
        {
          label: "学号",
          prop: "xh",
          empty: "空床",
        },
        {
          label: "姓名",
          prop: "xm",
          empty: "空床",
        },
        {
          label: "性别",
          prop: "xb",
          empty: "空床",
        },
        {
          label: "院系",
          prop: "xy",
          empty: "空床",
        },
        {
          label: "班级",
          prop: "bjmc",
          empty: "空床",
        },
      ],
      columns: [
        {
          label: "宿舍",
          prop: "fullname",
          width: "160px",
        },
        {
          label: "学号",
          prop: "xh",
        },
        {
          label: "姓名",
          prop: "xm",
        },
        {
          label: "性别",
          prop: "xb",
        },
        {
          label: "院系",
          prop: "xy",
        },
        {
          label: "班级",
          prop: "bjmc",
        },
      ],
    };
  },
  created() {
    this.getOpts(["tsyyOpts"]);
    this.init();
  },
  computed: {
    ...mapGetters(["tsyyOpts"]),
    tsType: function () {
      return this.patchData.tsType;
    },
    fields: function () {
      return [
        {
          label: "退宿时间：",
          prop: "checkoutTime",
          type: "date",
          placeholder: "请选择退宿时间",
          span: 12,
          rule: [
            { required: true, message: `请选择退宿时间`, trigger: "change" },
          ],
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
          prop: "deduction",
          type: "text",
          span: 12,
        },
        {
          label: "扣除原因：",
          prop: "deductionReason",
          type: "text",
          span: 12,
        },
      ];
    },
  },
  methods: {
    callServer() {
      return listBeds;
    },
    init() {
      this.reset();
      if (this.tsType == "overall") {
        this.ruleForm.aptId = this.patchData.aptId;
        this.ruleForm.aptLevel = this.patchData.aptLevel;
        this.tableParams.roomId = this.patchData.aptId;
      } else if (this.tsType == "single") {
        this.ruleForm.bedIds = [this.patchData.bedId];
      } else if (this.tsType == "many") {
        const arr = [];
        for (let i = 0; i < this.patchData.selected.length; i++) {
          arr.push(this.patchData.selected[i].bedId);
        }
        this.ruleForm.bedIds = arr;
      }
    },
    getTitle(type) {
      switch (type) {
        case "overall":
          return "整房退宿";
        case "many":
          return "批量退宿";
        default:
          return "退宿";
      }
    },
    ...mapActions(["getOpts"]),
    show() {
      this.$refs.saveDialog.dialogVisible = true;
    },
    reset() {
      for (const key in this.ruleForm) {
        this.ruleForm[key] = "";
      }
    },
    saveItem() {
      const me = this;
      this.$refs.ruleForm.validate().then((valid) => {
        if (valid) {
          this.$refs.saveDialog.posting = true;
          if (this.tsType == "overall") {
            checkout(this.ruleForm)
              .then(() => {
                this.$refs.saveDialog.close();
                me.toast("操作成功", "success");
                me.$emit("closed");
              })
              .catch((err) => {
                this.$refs.saveDialog.posting = false;
              });
          } else {
            checkoutByBeds(this.ruleForm)
              .then(() => {
                this.$refs.saveDialog.close();
                me.toast("操作成功", "success");
                me.$emit("closed");
              })
              .catch((err) => {
                this.$refs.saveDialog.posting = false;
              });
          }
        }
      });
    },
  },
};
</script>
<style lang="scss">
.check-in-table {
  .pagination-wrapper {
    display: none;
  }
}
</style>
