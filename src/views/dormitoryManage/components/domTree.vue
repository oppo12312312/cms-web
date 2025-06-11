<template>
  <el-tree
    ref="tree"
    :show-checkbox="isOperate"
    highlight-current
    :load="loadNode"
    node-key="aptId"
    lazy
    :default-expanded-keys="['node0']"
    @node-click="handleNodeClick"
    :expand-on-click-node="false"
    :props="defaultProps"
    @check-change="handleCheckChange"
  >
  </el-tree>
</template>

<script>
import { tree } from "@/projects/hbmu-suguan/api/sgApt";
export default {
  props: {
    isOperate: { type: Boolean, default: false },
    isRadio: { type: Boolean, default: false },
  },
  data() {
    return {
      radioCheck: "",
      defaultProps: {
        label: "aptName",
        children: "children",
        isLeaf: "isLeaf",
      },
      checked: [],
    };
  },
  created() {},
  methods: {
    init() {},
    handleNodeClick(data, node) {
      data.parent = node.parent;
      this.currentNode = data;
      this.$emit("handleNodeClick", data);
    },
    handleCheckChange(data, checked, indeterminate) {
      const { roleid } = data;
      const index = this.checked.indexOf(roleid);
      if (index < 0 && this.checked.length && checked) {
        this.$message.warning("只能选中一个节点");
        this.$refs.tree.setChecked(data, false); // 取消当前节点的选中状态
        return;
      }
      if (!checked && index >= 0 && this.checked.length) {
        this.checked = [];
        return;
      }
      if (index < 0 && !this.checked.length && checked) {
        this.checked.push(roleid);
      }
    },
    getCheckedNodes() {
      return this.$refs.tree.getCheckedNodes();
    },
    getRadioCheckedNodes() {
      return this.$refs.tree.getNode({ roleid: this.radioCheck });
    },
    loadNode(node, resolve) {
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
              aptCode: data[i].aptCode,
              nextLevel: data[i].nextLevel,
              remark: data[i].remark,
              isLeaf: data[i].aptLevel == "room" ? true : false,
            });
          }
          return resolve(arr);
        });
      }
    },
    updateKeyChildren(key, level) {
      tree({
        aptId: key != "node0" ? key : "",
        aptLevel: level && level ? level : "top",
      }).then((leafs) => {
        const data = leafs.data;
        const arr = [];
        for (let i = 0; i < data.length; i++) {
          arr.push({
            aptName: data[i].aptName,
            aptId: data[i].aptId,
            aptLevel: data[i].aptLevel,
            aptCode: data[i].aptCode,
            remark: data[i].remark,
            nextLevel: data[i].nextLevel,
            isLeaf: data[i].aptLevel == "room" ? true : false,
          });
        }
        this.$refs.tree.updateKeyChildren(key ? key : "node0", arr);
      });
    },
    setCurrentKey(key) {
      this.$refs.tree.setCurrentKey(key);
    },
    getNode(key) {
      return this.$refs.tree.getNode(key);
    },
    remove(key) {
      this.$refs.tree.remove(this.$refs.tree.getNode(key));
    },
  },
};
</script>

<style lang="scss">
.el-tree-node {
}
</style>
