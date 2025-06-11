<template>
  <v-form
    label-width="140"
    ref="ruleForm"
    :fields="fields"
    :fieldsData="ruleForm"
  >
    <template #deliverys>
      <div
        v-for="(d, i) in ruleForm.deliverys"
        :key="i"
        style="display: flex; margin-bottom: 8px"
      >
        <div style="flex: 0 0 auto; width: 340px">
          <el-cascader
            clearable
            :options="regionData"
            ref="cascaderAddr"
            :props="cateProps"
            v-model="d.delivery"
          ></el-cascader>
        </div>
        <!-- <div style="flex: 1 1 auto;">
          <el-input v-model="d.address" placeholder="请输入详细地址" clearable maxlength="20" show-word-limit></el-input>
        </div> -->
        <div style="flex: 0 0 auto; width: 90px; margin-left: 8px">
          <el-button
            @click="ruleForm.deliverys.push({})"
            type="primary"
            icon="el-icon-plus"
            circle
          ></el-button>
          <el-button
            @click="ruleForm.deliverys.splice(i, 1)"
            type="danger"
            icon="el-icon-delete"
            circle
            v-if="ruleForm.deliverys.length > 1"
          ></el-button>
        </div>
      </div>
    </template>
  </v-form>
</template>
<script>
import formMinxin from "_c/forms/minxins/formMinxin.js";
import { regionData } from "element-china-area-data";
import { getArea } from "@/api/common";

export default {
  mixins: [formMinxin],
  props: {
    patchData: Object,
    isAdd: Boolean,
    storeType: Array,
  },
  data() {
    return {
      ruleForm: {
        storeId: "",
        storeName: "",
        address: "",
        storeType: "",
        psrq: [],
        deliveryPriority: "",
        deliverys: [],
      },
      delivery: null,
      regionData,
      cateProps: {
        value: "value",
        label: "label",
        children: "children",
      },
    };
  },
  created() {
    getArea("420000");
    this.initForm(this.patchData);
    if (this.ruleForm.deliverys.length == 0) {
      this.ruleForm.deliverys.push({
        delivery: ["420000", "420100", "420102"],
      });
    } else {
      console.log(this.ruleForm.deliverys);
      this.ruleForm.deliverys.forEach((d) => {
        d.delivery = [
          d.deliveryProvinceCode,
          d.deliveryCityCode,
          d.deliveryAreaCode,
        ];
      });
    }
    if (this.patchData.deliveryDate) {
      this.ruleForm.psrq = this.patchData.deliveryDate.split(",");
    }
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
          label: "仓库名称：",
          placeholder: "请输入仓库名称",
          prop: "storeName",
          type: "text",
          maxlength: "100",
          rule: [
            { required: true, message: "请输入仓库名称", trigger: "blur" },
          ],
          span: 13,
        },
        {
          label: "仓库地址：",
          placeholder: "请输入仓库地址（经纬度）",
          prop: "address",
          type: "text",
          maxlength: "100",
          rule: [
            { required: true, message: "请输入仓库地址", trigger: "blur" },
          ],
          span: 13,
        },
        {
          label: "仓库类型：",
          placeholder: "请选择仓库类型",
          prop: "storeType",
          type: "select",
          rule: [
            { required: true, message: "请选择仓库类型", trigger: "blur" },
          ],
          options: this.storeType,
          span: 13,
        },
        {
          label: "配送日期：",
          placeholder: "请选择配送日期",
          prop: "psrq",
          type: "select",
          rule: [
            { required: true, message: "请选择配送日期", trigger: "blur" },
          ],
          multiple: true,
          options: [
            { label: "星期一", value: "星期一" },
            { label: "星期二", value: "星期二" },
            { label: "星期三", value: "星期三" },
            { label: "星期四", value: "星期四" },
            { label: "星期五", value: "星期五" },
            { label: "星期六", value: "星期六" },
            { label: "星期日", value: "星期日" },
          ],
        },
        {
          label: "配送优先级：",
          placeholder: "请选择配送优先级",
          prop: "deliveryPriority",
          type: "select",
          rule: [
            { required: true, message: "请选择配送优先级", trigger: "blur" },
          ],
          options: [
            { label: "高", value: "高" },
            { label: "中", value: "中" },
            { label: "低", value: "低" },
          ],
          span: 13,
        },
        {
          label: "配送区域：",
          type: "slot",
          slot: "deliverys",
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
};
</script>
<style lang="scss"></style>
