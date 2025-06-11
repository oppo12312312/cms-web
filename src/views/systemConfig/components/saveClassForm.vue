<template>
  <v-form ref="ruleForm" :fields="fields" :fieldsData="ruleForm"></v-form>
</template>
<script>
import formMinxin from "_c/forms/minxins/formMinxin.js";
import { getXueyuan, getMajors, getClasses } from "@/api/common";
import { getXueyuanOptions, getMajorsOptions } from "@/filters/options";

export default {
  mixins: [formMinxin],
  props: {
    patchData: Object,
  },
  data() {
    return {
      ruleForm: {
        bh: "",
        bjmc: "",
        bjid: "",
        byny: "",
        nj: "",
        xyId: "",
        zyId: "",
        remark: "",
      },
      xyOpts: [],
      majorOpts: [],
    };
  },
  created() {
    getXueyuanOptions().then((data) => {
      this.xyOpts = data;
    });
    getMajorsOptions().then((data) => {
      this.majorOpts = data;
    });
  },
  computed: {
    fields() {
      return [
        {
          label: "班号：",
          placeholder: "请输入班号",
          span: 12,
          prop: "bh",
          type: "text",
          rule: [
            {
              required: true,
              message: "请输入班号",
              trigger: "blur",
            },
          ],
        },
        {
          label: "班级名称：",
          placeholder: "请输入班级名称",
          span: 12,
          prop: "bjmc",
          type: "text",
          rule: [
            {
              required: true,
              message: "请输入班级名称",
              trigger: "blur",
            },
          ],
        },
        {
          label: this.lang_college + "：",
          placeholder: `请选择${this.lang_college}`,
          span: 12,
          prop: "xyId",
          type: "select",
          options: this.xyOpts,
          rule: [
            {
              required: true,
              message: `请选择${this.lang_college}名称`,
              trigger: "change",
            },
          ],
        },
        {
          label: "年级：",
          placeholder: "请选择年级",
          span: 12,
          prop: "nj",
          type: "date",
          dType: "year",
          format: "yyyy",
          formate: "yyyy",
          disabledDate: {
            type: "before",
            time: Date.now() - 8.64e7,
          },
        },
        {
          label: "专业：",
          placeholder: "请选择专业",
          span: 12,
          prop: "zyId",
          type: "select",
          options: this.majorOpts,
          rule: [
            {
              required: true,
              message: "请选择专业名称",
              trigger: "change",
            },
          ],
        },
        {
          label: "毕业年月：",
          placeholder: "请选择毕业年月",
          span: 12,
          prop: "byny",
          type: "date",
          dType: "month",
          format: "yyyy-MM",
          formate: "yyyyMM",
          rule: [
            {
              required: true,
              message: "请选择毕业年月",
              trigger: "change",
            },
          ],
        },
        {
          label: "备注：",
          placeholder: "请输入备注",
          prop: "remark",
          type: "textarea",
        },
      ];
    },
  },
  watch: {
    patchData: {
      handler() {
        this.initForm(this.patchData);
      },
      immediate: true,
      deep: true,
    },
    "ruleForm.xyId": function (val, oval) {
      const me = this;
      if (this.isEmptyObject(this.patchData)) {
        //新增
        this.$set(this.ruleForm, "zyId", "");
        getMajorsOptions(this.ruleForm.xyId).then((data) => {
          me.fields[4].options = data;
        });
      } else {
        if (oval && oval != "") {
          this.$set(this.ruleForm, "zyId", "");
          getMajorsOptions(this.ruleForm.xyId).then((data) => {
            me.fields[4].options = data;
          });
        }
      }
    },
  },
};
</script>
<style lang="scss"></style>
