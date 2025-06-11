<template>
  <v-form ref="ruleForm" :fields="fields" :fieldsData="ruleForm"></v-form>
</template>
<script>
import formMinxin from "_c/forms/minxins/formMinxin.js";

export default {
  mixins: [formMinxin],
  props: {
    patchData: Object,
    treeData: Array,
  },
  data() {
    return {
      ruleForm: {
        channelId: "",
        channelName: "",
        parentId: this.patchData.parentId || "0",
        priority: "",
        isDisplay: "1",
      },
      fields: [
        {
          label: "栏目名称：",
          placeholder: "请输入栏目名称",
          prop: "channelName",
          type: "text",
          rule: [
            {
              required: true,
              message: "请输入栏目名称",
              trigger: "blur",
            },
          ],
        },
        {
          label: "上级栏目：",
          placeholder: "请选择上级栏目",
          prop: "parentId",
          type: "tree",
          treeLabel: "0",
          treeValue: "栏目根节点",
          defaultProps: {
            label: "channelName",
            value: "channelId",
          },
          treeData: this.treeData,
        },
        {
          label: "排列顺序：",
          placeholder: "请输入排列顺序",
          prop: "priority",
          type: "text",
          rule: [
            {
              required: false,
              validator: this.validatorZzs,
              message: `请输入正确排序号`,
              trigger: "blur",
            },
          ],
        },
        {
          label: "是否显示：",
          prop: "isDisplay",
          type: "radio",
          options: [
            { label: "是", value: "1" },
            { label: "否", value: "0" },
          ],
        },
      ],
    };
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
      if (!this.patchData.parentId && this.patchData.parent) {
        this.ruleForm.parentId = this.patchData.parent.channelId || "0";
      }
      for (const m of this.fields) {
        if (m.type == "tree") {
          this.$set(
            this.fields[1],
            "treeValue",
            this.patchData.parent.channelId || "0"
          );
          this.$set(
            this.fields[1],
            "treeLabel",
            this.patchData.parent.channelName || "栏目根节点"
          );
          /* if (this.patchData.parent) {
            this.$set(this.fields[1], "treeValue", this.patchData.parent.channelId || '0');
            this.$set(this.fields[1], "treeLabel", this.patchData.parent.channelName || '栏目根节点');
          } else {
            this.$set(this.fields[1], "treeValue", '0');
            this.$set(this.fields[1], "treeLabel", '栏目根节点');
          } */
        }
      }
    },
  },
};
</script>
<style lang="scss"></style>
