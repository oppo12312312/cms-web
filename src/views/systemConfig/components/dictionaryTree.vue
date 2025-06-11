<template>
  <el-tree
    v-loading="loading"
    ref="tree"
    :data="treeData"
    :show-checkbox="isOperate"
    highlight-current
    node-key="dmid"
    :load="loadNode"
    lazy
    @node-click="handleNodeClick"
    :props="defaultProps"
  ></el-tree>
</template>

<script>
import { codeTreeList } from "@/api/code";
export default {
  props: {
    propsNode: {
      type: String,
      default: "",
    },
    isOperate: { type: Boolean, default: false },
  },
  data() {
    return {
      loading: true,
      defaultProps: {
        label: "dmname",
        children: "children",
        isLeaf: "isleaf",
      },
      treeData: [
        {
          dmname: this.$route.meta.title,
          dmid: this.$route.meta.submodel,
          dmcode: this.$route.meta.submodel,
          children: [],
        },
      ],
      currentNode: {},
      rootNode: {},
      rootResolve: null,
    };
  },
  created() {
    //console.log(this.$route)
  },
  methods: {
    uploaded(parentid) {
      const me = this;
      codeTreeList(
        { parentid: parentid || this.$route.meta.submodel, pageSize: 1000 },
        this.$route.meta.submodel
      ).then((leafs) => {
        me.currentNode.children = leafs.data;
        this.$emit("getTree", me.currentNode);
        this.$nextTick(() => {
          me.handleNodeClick(me.currentNode);
          me.resetNode(me.currentNode);
        });
      });
    },
    loadNode(node, resolve) {
      // 一级节点处理
      if (node.level === 0) {
        this.rootNode = node;
        this.rootResolve = resolve;
        this.rootNode.childNodes = [];
        this.loading = false;
        return resolve([
          {
            dmname: this.$route.meta.title,
            dmid: this.$route.meta.submodel,
            dmcode: this.$route.meta.submodel,
            //children: leafs.data,
            isLeaf: false,
          },
        ]);
        //});
      }
      if (node.level >= 1) resolve([]);
      codeTreeList(
        { parentid: node.key, pageSize: 1000 },
        this.$route.meta.submodel
      ).then((leafs) => {
        const data = leafs.data;
        if (data.length) {
          for (let i = 0; i < data.length; i++) {
            data[i].isleaf = data[i].isleaf == "false" ? false : true;
          }
        }
        node.data.children = data;
        this.handleNodeClick(this.currentNode);
        return resolve(leafs.data);
      });
      this.loading = false;
    },
    handleNodeClick(node) {
      this.currentNode = node;
      this.$emit("handleNodeClick", this.$refs.tree.getNode(node));
    },
    resetNode(dmid) {
      const node = this.$refs.tree.getNode(dmid); // 通过节点dmid找到对应树节点对象
      node.loaded = false;
      node.expand(); // 主动调用展开节点方法，重新查询该节点下的所有子节点
    },
  },
};
</script>
