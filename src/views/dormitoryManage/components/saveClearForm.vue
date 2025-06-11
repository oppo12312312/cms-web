<template>
  <v-form ref="ruleForm" :fields="fields" :fieldsData="ruleForm"></v-form>
</template>
<script>
import { tree } from "@/projects/hbmu-suguan/api/sgApt";
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
        aptId: "",
        aptName: "",
        aptLevel: "",
        studentScope: "graduate",
        checkoutReason: "",
      },
    };
  },
  created() {
    this.getOpts(["tsyyOpts"]);
  },
  computed: {
    ...mapGetters(["tsyyOpts"]),
    fields: function () {
      const me = this;
      return [
        {
          label: "宿舍范围：",
          prop: "aptId",
          type: "tree",
          placeholder: "请选择宿舍范围",
          nodeKey: "aptId",
          expandedKeys: ["node0"],
          defaultProps: {
            label: "aptName",
            value: "aptId",
            children: "children",
            isLeaf: "isLeaf",
          },
          loadNode: function (node, resolve) {
            // 一级节点处理
            if (node.level === 0) {
              tree({ aptId: "", aptLevel: "" }).then((leafs) => {
                const data = leafs.data;
                return resolve([
                  {
                    aptName: data[0].aptName,
                    aptId: "node0",
                    aptLevel: data[0].aptLevel,
                    isLeaf: false,
                  },
                ]);
              });
            }
            if (node.level >= 1) resolve([]);
            if (node.data) {
              tree({
                aptId: node.key == "node0" ? "" : node.key,
                aptLevel: node.data.aptLevel,
              }).then((leafs) => {
                const data = leafs.data;
                const arr = [];
                for (let i = 0; i < data.length; i++) {
                  arr.push({
                    aptName: data[i].aptName,
                    aptId: data[i].aptId,
                    aptLevel: data[i].aptLevel,
                    isLeaf: data[i].aptLevel == "room" ? true : false,
                  });
                }
                return resolve(arr);
              });
            }
          },
          handleClick: function (node) {
            me.ruleForm.aptName = node.aptName;
            me.ruleForm.aptLevel = node.aptLevel;
          },
        },
        {
          label: "学生范围：",
          prop: "studentScope",
          type: "radio",
          options: [
            {
              label: "毕业生",
              value: "graduate",
            },
            {
              label: "全部学生",
              value: "all",
            },
          ],
        },
        {
          label: "退宿原因：",
          prop: "checkoutReason",
          type: "select",
          placeholder: "请选择退宿原因",
          options: this.tsyyOpts,
        },
      ];
    },
  },
  watch: {
    patchData: function () {
      this.init(this.patchData);
    },
  },
  methods: {
    ...mapActions(["getOpts"]),
    init() {},
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
