<template>
  <v-form ref="ruleForm" :fields="fields" :fieldsData="ruleForm"></v-form>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import formMinxin from "_c/forms/minxins/formMinxin.js";

export default {
  mixins: [formMinxin],
  props: {
    patchData: Object,
  },
  data() {
    return {
      ruleForm: {
        settingId: "",
        settingName: "",
        nj: "",
        startTime: "",
        endTime: "",
        openStatus: "是",
        remark: "",
        xy: "",
        xyId: "",
      },
    };
  },
  computed: {
    fields: function () {
      const me = this;
      return [
        {
          label: "批次名称：",
          prop: "settingName",
          type: "text",
          rule: [
            {
              required: true,
              message: `请输入批次名称`,
              trigger: "blur",
            },
          ],
        },
        // {
        //   label: "选房类型：",
        //   prop: "studentScope",
        //   type: "radio",
        //   options: [
        //     {
        //       label: "学生自助",
        //       value: "graduate",
        //     },
        //     {
        //       label: "管理员分配",
        //       value: "all",
        //     },
        //   ],
        // },
        {
          label: "年级：",
          placeholder: "请选择年级",
          prop: "nj",
          type: "date",
          dType: "year",
          format: "yyyy",
          formate: "yyyy",
          rule: [
            {
              required: true,
              message: "请选择出生日期",
              trigger: "blur",
            },
          ],
        },
        {
          label: "开始时间：",
          placeholder: "请选择开始时间",
          prop: "startTime",
          type: "date",
          dType: "date",
          format: "yyyy-MM-dd",
          formate: "yyyy-MM-dd HH:mm:ss",
          rule: [
            {
              required: true,
              message: "请选择开始时间",
              trigger: "blur",
            },
          ],
        },
        {
          label: "结束时间：",
          placeholder: "请选择结束时间",
          prop: "endTime",
          type: "date",
          dType: "date",
          format: "yyyy-MM-dd",
          formate: "yyyy-MM-dd HH:mm:ss",
          rule: [
            {
              required: true,
              message: "请选择结束时间",
              trigger: "blur",
            },
          ],
        },
        {
          label: "是否开放：",
          prop: "openStatus",
          type: "radio",
          options: [
            {
              label: "是",
              value: "是",
            },
            {
              label: "否",
              value: "否",
            },
          ],
        },
        {
          label: this.lang_college + "：",
          layout: ["xy"],
          type: "xyzybj",
          xyId: this.ruleForm.xyId,
          gutter: 0,
        },
        {
          label: "备注：",
          prop: "remark",
          type: "text",
        },
      ];
    },
  },
  created() {
    this.init();
  },
  watch: {
    patchData: function () {
      this.init();
    },
  },
  methods: {
    init() {
      this.initForm(this.patchData);
    },
  },
};
</script>
<style lang="scss">
.set-form {
  .el-checkbox {
    margin-right: 5px;
  }
}
</style>
