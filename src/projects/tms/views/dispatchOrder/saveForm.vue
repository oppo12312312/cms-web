<template>
  <v-form
    label-width="100"
    ref="ruleForm"
    :fields="fields"
    :fieldsData="ruleForm"
  >
    <template #rwid>{{ patchData.taskId || "-" }}</template>
    <template #psdd>{{ patchData.deliveryOrderNo }}</template>
    <template #yhdd>{{ patchData.orderNo }}</template>
  </v-form>
</template>
<script>
import formMinxin from "_c/forms/minxins/formMinxin.js";

export default {
  mixins: [formMinxin],
  props: {
    patchData: Object,
  },
  data() {
    return {
      ruleForm: {
        id: "",
        deliveryFee: "",
        deliveryRemark: "",
      },
    };
  },
  created() {
    this.initForm(this.patchData);
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
          label: "任务ID：",
          type: "slot",
          slot: "rwid",
        },
        {
          label: "配送订单：",
          type: "slot",
          slot: "psdd",
        },
        {
          label: "用户订单：",
          type: "slot",
          slot: "yhdd",
        },
        {
          label: "配送费用：",
          placeholder: "请输入配送费用",
          prop: "deliveryFee",
          type: "number",
          rule: [
            { required: true, message: "请输入配送费用", trigger: "blur" },
          ],
        },
        {
          label: "配送备注：",
          placeholder: "请输入配送备注",
          prop: "deliveryRemark",
          type: "textarea",
        },
      ];
    },
  },
};
</script>
<style lang="scss"></style>
