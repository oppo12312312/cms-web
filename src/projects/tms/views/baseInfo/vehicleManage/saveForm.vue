<template>
  <v-form
    label-width="140"
    ref="ruleForm"
    :fields="fields"
    :fieldsData="ruleForm"
  >
  </v-form>
</template>
<script>
import formMinxin from "_c/forms/minxins/formMinxin.js";
import moment from "moment";
import { pageList } from "#/api/tmsDriver";
import { pageList as storeList } from "#/api/tmsStore";

export default {
  mixins: [formMinxin],
  props: {
    patchData: Object,
    isAdd: Boolean,
    modelType: Array,
    modelTypeOne: Array,
    modelTypeThree: Array,
    vehicleStatus: Array,
  },
  data() {
    return {
      ruleForm: {
        vehicleId: "",
        plateNo: "",
        modelTypeOne: "",
        modelType: "",
        modelTypeThree: "",
        carLength: "",
        carWidth: "",
        carHeight: "",
        vehicleStatus: "",
        storeIds: [],
        payload: "",
        availablePeriod: null,
        driverIds: [],
        remark: "",
        photoId: "",
      },
      driverList: [],
      storeList: [],
    };
  },
  created() {
    this.initForm(this.patchData);
    if (
      this.patchData.availablePeriodBegin &&
      this.patchData.availablePeriodEnd
    ) {
      this.ruleForm.availablePeriod = [
        new Date(
          moment().format("yyyy-MM-DD") +
            " " +
            this.patchData.availablePeriodBegin +
            ":00"
        ),
        new Date(
          moment().format("yyyy-MM-DD") +
            " " +
            this.patchData.availablePeriodEnd +
            ":00"
        ),
      ];
    }
    if (this.patchData.drivers && this.patchData.drivers.length) {
      this.ruleForm.driverIds = this.patchData.drivers.map((p) => p.code);
    }
    pageList({ pageIndex: 1, pageSize: 1000 }).then((res) => {
      this.driverList = res.data.map((d) => ({
        label: d.driverName,
        value: d.driverId + "",
      }));
    });
    if (this.patchData.stores && this.patchData.stores.length) {
      this.ruleForm.storeIds = this.patchData.stores.map((p) => p.code);
    }
    storeList({ pageIndex: 1, pageSize: 1000 }).then((res) => {
      this.storeList = res.data.map((d) => ({
        label: d.storeName,
        value: d.storeId,
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
          placeholder: "请输入车牌号",
          prop: "plateNo",
          type: "text",
          disabled: !this.isAdd,
          maxlength: "100",
          rule: [{ required: true, message: "请输入车牌号", trigger: "blur" }],
        },
        {
          label: "车辆类型：",
          placeholder: "请选择车辆类型",
          prop: "modelTypeOne",
          type: "select",
          span: 12,
          rule: [
            { required: true, message: "请选择车辆类型", trigger: "blur" },
          ],
          options: this.modelTypeOne,
        },
        {
          labelWidth: "0",
          prop: "modelType",
          type: "select",
          span: 6,
          rule: [
            { required: true, message: "请选择车辆类型", trigger: "blur" },
          ],
          options: this.modelType,
        },
        {
          labelWidth: "0",
          prop: "modelTypeThree",
          type: "select",
          span: 6,
          rule: [
            { required: true, message: "请选择车辆类型", trigger: "blur" },
          ],
          options: this.modelTypeThree,
        },
        {
          label: "箱内尺寸(米)：",
          placeholder: "厢内长",
          prop: "carLength",
          type: "number",
          span: 12,
          // rule: [ { required: true, message: "请输入厢内长", trigger: "blur", } ],
        },
        {
          labelWidth: "0",
          placeholder: "厢内宽",
          prop: "carWidth",
          type: "number",
          span: 6,
          // rule: [ { required: true, message: "请输入厢内宽", trigger: "blur", } ],
        },
        {
          labelWidth: "0",
          placeholder: "厢内高",
          prop: "carHeight",
          type: "number",
          span: 6,
          // rule: [ { required: true, message: "请输入厢内高", trigger: "blur", } ],
        },
        {
          label: "状态：",
          placeholder: "请选择状态",
          prop: "vehicleStatus",
          type: "select",
          rule: [{ required: true, message: "请选择状态", trigger: "blur" }],
          options: this.vehicleStatus,
        },
        {
          label: "可载重量：",
          placeholder: "请输入可载重量",
          prop: "payload",
          type: "text",
          rule: [
            { required: true, message: "请输入可载重量", trigger: "blur" },
          ],
        },
        {
          label: "可用时段：",
          placeholder: "请选择可用时段",
          prop: "availablePeriod",
          type: "timerange",
          rule: [
            { required: true, message: "请选择可用时段", trigger: "blur" },
          ],
        },
        {
          label: "分配司机：",
          placeholder: "请选择司机",
          prop: "driverIds",
          type: "select",
          multiple: true,
          options: this.driverList,
        },
        {
          label: "仓库：",
          placeholder: "请选择仓库",
          prop: "storeIds",
          type: "select",
          multiple: true,
          options: this.storeList,
        },
        {
          label: "备注：",
          placeholder: "请输入备注",
          prop: "remark",
          type: "textarea",
        },
        // {
        //   label: '车辆图片：',
        //   prop: 'photoId',
        //   type: 'files',
        //   fileType: 'image',
        //   size: 20,
        //   limit: 1,
        //   fileTypes: ['png', 'jpg', 'jpeg', 'bmp'],
        //   placeholder: '大小不超过20MB'
        // }
      ];
    },
  },
};
</script>
<style lang="scss"></style>
