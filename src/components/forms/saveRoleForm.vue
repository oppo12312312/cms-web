<template>
  <v-form
    label-width="140"
    ref="ruleForm"
    :fields="fields"
    :fieldsData="ruleForm"
  ></v-form>
</template>
<script>
import formMinxin from "./minxins/formMinxin.js";

export default {
  mixins: [formMinxin],
  props: {
    patchData: Object,
  },
  data() {
    return {
      ruleForm: {
        roleid: "",
        name: "",
        roledesc: "",
        roleorder: "",
      },
      fields: [
        {
          label: "角色名：",
          placeholder: "请输入角色名",
          prop: "name",
          type: "text",
          rule: [
            {
              required: true,
              message: "请输入角色名",
              trigger: "blur",
            },
          ],
        },
        //  {
        //     label: "描述：",
        //     placeholder: "请输入描述",
        //     prop: "roledesc",
        //     type: "textarea",
        //   },
        {
          label: "序号：",
          placeholder: "请输入序号",
          prop: "roleorder",
          type: "text",
        },
      ],
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
};
</script>
<style lang="scss"></style>
