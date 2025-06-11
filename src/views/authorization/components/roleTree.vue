<template>
  <el-tree
    ref="tree"
    :data="treeData"
    :show-checkbox="isOperate"
    highlight-current
    node-key="roleid"
    default-expand-all
    @node-click="handleNodeClick"
    :expand-on-click-node="false"
    :props="defaultProps"
    @check-change="handleCheckChange"
  >
    <template slot-scope="{ node, data }">
      <div v-if="isRadio">
        <el-radio
          v-if="!data.children"
          v-model="radioCheck"
          :label="data.roleid"
          >{{ data.name }}</el-radio
        >
        <span v-else>{{ data.name }}</span>
      </div>
      <div v-else>
        {{ data.name }}
      </div>
    </template>
  </el-tree>
</template>

<script>
import { roleList } from "@/api/roleManage";
export default {
  props: {
    isOperate: { type: Boolean, default: false },
    isRadio: { type: Boolean, default: false },
  },
  data() {
    return {
      radioCheck: "",
      treeData: [
        {
          name: "校级角色",
          id: "xx",
          children: [],
        },
        {
          name: `${this.lang_college}级角色`,
          id: "dept",
          children: [],
        },
        {
          name: "其他",
          id: "qt",
          children: [],
        },
      ],
      defaultProps: {
        label: "name",
      },
      checked: [],
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      roleList({ pageSize: 200, roleType: "xx" }).then((data) => {
        const xxs = [];
        const depts = [];
        const qts = [];
        for (let i = 0; i < data.data.length; i++) {
          if (data.data[i].roletype == "xx") {
            xxs.push(data.data[i]);
          } else if (data.data[i].roletype == "dept") {
            depts.push(data.data[i]);
          } else {
            qts.push(data.data[i]);
          }
        }
        this.treeData[0].children = xxs;
        this.treeData[1].children = depts;
        this.treeData[2].children = qts;
        this.$emit("initTree", this.treeData[0]);
      });
    },
    handleNodeClick(node) {
      this.currentNode = node;
      this.$emit("handleNodeClick", node);
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
  },
};
</script>

<style lang="scss">
.el-tree-node {
}
</style>
