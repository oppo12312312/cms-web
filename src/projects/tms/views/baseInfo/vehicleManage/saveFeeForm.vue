<template>
  <v-form
    label-width="140"
    ref="ruleForm"
    :fields="fields"
    :fieldsData="ruleForm"
  >
    <template #cph>{{ patchData.plateNo || "-" }}</template>
  </v-form>
</template>
<script>
import formMinxin from "_c/forms/minxins/formMinxin.js";
import { getCommonOptions } from "@/api/common";

export default {
  mixins: [formMinxin],
  props: {
    patchData: Object,
  },
  data() {
    return {
      feeType: [],
      feeCountType: [],
      ruleForm: {
        plateNo: "",
        feeType: "",
        feeCountType: "",
        countFee: "",
        attachmentId: "",
      },
    };
  },
  created() {
    this.initForm(this.patchData);
    getCommonOptions("fee_type").then((res) => {
      this.feeType = res.data.map((d) => ({
        label: d.dmname,
        value: d.dmcode,
      }));
    });
    getCommonOptions("fee_count_type").then((res) => {
      this.feeCountType = res.data.map((d) => ({
        label: d.dmname,
        value: d.dmcode,
      }));
    });
  },
  watch: {
    patchData: function () {
      this.initForm(this.patchData);
    },
  },
  computed: {
    fields: function () {
      return [
        {
          label: "车牌号：",
          type: "slot",
          slot: "cph",
        },
        {
          label: "费用类型：",
          placeholder: "请选择费用类型",
          prop: "feeType",
          type: "select",
          rule: [
            { required: true, message: "请选择费用类型", trigger: "blur" },
          ],
          options: this.feeType,
        },
        {
          label: "费用计算类型：",
          placeholder: "请选择费用计算类型",
          prop: "feeCountType",
          type: "select",
          rule: [
            { required: true, message: "请选择费用计算类型", trigger: "blur" },
          ],
          options: this.feeCountType,
        },
        {
          label: "费用计算：",
          placeholder: "请输入费用计算",
          prop: "countFee",
          type: "number",
          append:
            this.ruleForm.feeCountType == "1"
              ? "元/公里"
              : this.ruleForm.feeCountType == "2"
              ? "元/次"
              : "",
          rule: [
            { required: true, message: "请输入费用计算", trigger: "blur" },
          ],
        },
        {
          label: "附件：",
          prop: "attachmentId",
          type: "files",
          fileType: "file",
          size: 10,
          limit: 5,
          placeholder: "大小不超过10MB，不超过5个附件",
        },
      ];
    },
  },
};
</script>
<style lang="scss"></style>
