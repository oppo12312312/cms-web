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
import { pageList } from "#/api/tmsVehicle";
import { pageList as storeList } from "#/api/tmsStore";

export default {
  mixins: [formMinxin],
  props: {
    patchData: Object,
    isAdd: Boolean,
    driverType: Array,
    idType: Array,
  },
  data() {
    return {
      ruleForm: {
        driverId: "",
        driverName: "",
        phone: "",
        driverType: "",
        storeIds: [],
        plateNos: [],
        idType: "",
        idNo: "",
        remark: "",
      },
      plateList: [],
      storeList: [],
    };
  },
  created() {
    this.initForm(this.patchData);
    if (this.patchData.plateNos && this.patchData.plateNos.length) {
      this.ruleForm.plateNos = this.patchData.plateNos.map((p) => p.name);
    }
    pageList({ pageIndex: 1, pageSize: 1000 }).then((res) => {
      this.plateList = res.data.map((d) => ({
        label: d.plateNo,
        value: d.plateNo,
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
          label: "司机姓名：",
          placeholder: "请输入司机姓名",
          prop: "driverName",
          type: "text",
          maxlength: "100",
          rule: [
            { required: true, message: "请输入司机姓名", trigger: "blur" },
          ],
        },
        {
          label: "手机号码：",
          placeholder: "请输入手机号码",
          prop: "phone",
          type: "text",
          rule: [
            { required: true, message: "请输入手机号码", trigger: "blur" },
          ],
        },
        {
          label: "司机类型：",
          placeholder: "请选择司机类型",
          prop: "driverType",
          type: "select",
          rule: [
            { required: true, message: "请选择司机类型", trigger: "blur" },
          ],
          options: this.driverType,
        },
        {
          label: "证件类型：",
          placeholder: "请选择证件类型",
          prop: "idType",
          type: "select",
          options: this.idType,
        },
        {
          label: "证件号：",
          placeholder: "请输入证件号",
          prop: "idNo",
          type: "text",
          rule: [{ required: true, message: "请输入证件号", trigger: "blur" }],
        },
        {
          label: "仓库：",
          placeholder: "请选择仓库",
          prop: "storeIds",
          type: "select",
          multiple: true,
          rule: [{ required: true, message: "请选择仓库", trigger: "blur" }],
          options: this.storeList,
        },
        {
          label: "车牌号：",
          placeholder: "请选择车牌号",
          prop: "plateNos",
          type: "select",
          multiple: true,
          rule: [{ required: true, message: "请选择车牌号", trigger: "blur" }],
          options: this.plateList,
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
