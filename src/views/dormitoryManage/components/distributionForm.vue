<template>
  <v-dialog width="720px" ref="saveDialog" @handleClose="saveItem" title="调整">
    <student-info :patch-data="patchData"></student-info>
    <v-form ref="saveItemForm" :fields="fields" :fieldsData="ruleForm"></v-form>
  </v-dialog>
</template>
<script>
import studentInfo from "./studentInfo";
import { tree } from "@/projects/hbmu-suguan/api/sgApt";
import { changeBed } from "@/projects/hbmu-suguan/api/sgRoomassign";

export default {
  props: {
    patchData: Object,
  },
  components: {
    studentInfo,
  },
  data() {
    return {
      ruleForm: {
        infoId: "",
        roomId: "",
        changeTime: "",
        assignid: "",
      },
    };
  },
  created() {
    this.init();
  },
  computed: {
    fields: function () {
      return [
        {
          label: "调整房间：",
          prop: "roomId",
          type: "tree",
          placeholder: "请选择调整房间",
          span: 12,
          nodeKey: "aptId",
          expandedKeys: ["node0"],
          defaultProps: {
            label: "aptName",
            value: "aptId",
            children: "children",
            isLeaf: "isLeaf",
            chooseLeaf: true,
            msg: "请选择房间",
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
        },
        {
          label: "调整时间：",
          prop: "changeTime",
          type: "date",
          placeholder: "请选择退宿时间",
          span: 12,
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
    init() {
      this.ruleForm.infoId = this.patchData.infoId;
      this.ruleForm.assignid = this.patchData.assignId;
    },
    show() {
      this.$refs.saveDialog.dialogVisible = true;
    },
    saveItem() {
      const me = this;
      this.$refs.saveItemForm.validate().then((valid) => {
        if (valid) {
          this.$refs.saveDialog.posting = true;
          changeBed(this.ruleForm)
            .then(() => {
              this.$refs.saveDialog.close();
              me.toast("调整成功", "success");
            })
            .catch((err) => {
              this.$refs.saveDialog.posting = false;
            });
        }
      });
    },
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
