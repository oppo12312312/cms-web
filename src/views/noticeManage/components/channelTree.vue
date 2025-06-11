<template>
  <el-tree
    v-loading="loading"
    ref="tree"
    :data="treeData"
    :show-checkbox="isOperate"
    highlight-current
    node-key="channelId"
    default-expand-all
    @node-click="handleNodeClick"
    :expand-on-click-node="false"
    :props="defaultProps"
  >
  </el-tree>
</template>

<script>
import { channelTreeList } from "@/api/channel";
export default {
  props: {
    isOperate: { type: Boolean, default: false },
    isDisplay: String,
  },
  data() {
    return {
      loading: true,
      treeData: [],
      defaultProps: {
        label: "channelName",
      },
      currentNode: {},
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.loading = true;
      channelTreeList({ channelId: 0 }).then((data) => {
        this.treeData = this.toTree(data.data);
        this.loading = false;
        this.$emit("getTree", this.treeData);
        this.$nextTick(() => {
          if (this.currentNode.channelId) {
            this.$emit(
              "handleNodeClick",
              this.$refs.tree.getNode(this.currentNode.channelId).data
            );
          }
        });
      });
    },
    toTree(node) {
      node.forEach(function (it) {
        delete it.children;
      });
      const map = {};
      node.forEach(function (it) {
        map[it.channelId] = it;
      });

      const val = [];
      node.forEach(function (it) {
        const parent = map[it.parentId];
        if (parent) {
          (parent.children || (parent.children = [])).push(it);
        } else {
          val.push(it);
        }
      });
      return val;
    },
    handleNodeClick(node) {
      this.currentNode = node;
      this.$emit("handleNodeClick", node);
    },
  },
};
</script>

<style lang="scss">
.el-tree-node {
}
</style>
