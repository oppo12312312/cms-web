<template>
  <v-form
    label-width="140"
    ref="ruleForm"
    :fields="fields"
    :fieldsData="ruleForm"
    v-loading="loading"
  >
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
      loading: false,
      ruleForm: {
        roleid: "",
        name: "",
        code: "",
      },
      deptOpts: [],
    };
  },
  created() {
    this.initForm(this.patchData);
  },
  watch: {
    patchData: function () {},
  },
  computed: {
    fields: function () {
      return [
        {
          label: "角色代码：",
          placeholder: "请输入角色代码",
          prop: "code",
          type: "text",
          maxlength: "32",
          rule: [
            {
              required: true,
              message: "请输入角色代码",
              trigger: "blur",
            },
          ],
        },
        {
          label: "角色名称：",
          placeholder: "请输入角色名称",
          prop: "name",
          type: "text",
          maxlength: "32",
          rule: [
            {
              required: true,
              message: "请输入角色名称",
              trigger: "blur",
            },
          ],
        },
      ];
    },
  },
};
</script>
<style lang="scss"></style>
