<template>
  <v-page :has-left="true">
    <template #left>
      <el-card shadow="never">
        <div slot="header" class="clearfix">
          <span class="txt-bold">角色列表</span>
        </div>
        <div>
          <role-tree @handleNodeClick="handleNodeClick"></role-tree>
        </div>
      </el-card>
    </template>
    <el-card shadow="never">
      <div slot="header" class="clearfix" style="position: relative">
        <span class="txt-bold">角色权限</span>
        <v-btn
          type="edit"
          :txt="isEdit ? '保存' : '编辑'"
          style="position: absolute; right: -10px; top: -10px"
          @handleClick="saveRoleAuthorization"
        ></v-btn>
      </div>
      <div v-loading="loading" :class="{ 'disabled-tree': !isEdit }">
        <el-tree
          :data="resources"
          show-checkbox
          :expand-on-click-node="false"
          node-key="id"
          default-expand-all
          @check-change="getAllecked"
          @check="clickBox"
          ref="resTree"
          :props="defaultProps"
        >
          <div style="height: 100%" slot-scope="{ node, data }">
            <el-popover
              :open-delay="10"
              placement="right"
              title="已分配该权限的角色"
              trigger="hover"
              @show="showInfo(node)"
            >
              <div style="line-height: 28px" slot="reference">
                {{ node.label }}
              </div>
              <ul v-loading="listLoading" style="min-height: 60px">
                <li v-for="(sr, index) in node.showRoles" :key="index">
                  {{ sr.label + "：" }}
                  <span
                    v-show="sr.children.length"
                    v-for="(sc, index1) in sr.children"
                    :key="index1"
                  >
                    {{ index1 > 0 ? "、" + sc.name : sc.name }}
                  </span>
                  <span v-show="!sr.children.length">暂时没有分配角色</span>
                </li>
              </ul>
            </el-popover>
          </div>
        </el-tree>
      </div>
      <v-dialog
        ref="saveDialog"
        width="600px"
        @handleClose="saveItem"
        :title="isEmptyObject(currentItem) ? '新增角色' : '修改角色'"
      >
        <save-role-form></save-role-form>
      </v-dialog>
    </el-card>
  </v-page>
</template>

<script>
import roleTree from "./components/roleTree";
import roles from "./components/roles";
import basicTable from "_c/tables";
import {
  roleList,
  roleGrantDetail,
  saveGrant,
  roleAdd,
  roleEdit,
  roleGrantedUserList,
  roleDelete,
  setResource,
  findByResource,
} from "@/api/roleManage";

export default {
  components: {
    basicTable,
    roleTree,
    roles,
  },
  data() {
    return {
      isEdit: false,
      loading: false,
      listLoading: false,
      defaultProps: {
        label: "name",
      },
      treeData: [],
      resources: [],
      columns: [
        {
          label: "角色名",
          prop: "name",
        },
        {
          label: "描述",
          prop: "description",
        },
        {
          label: "排序",
          prop: "orderno",
        },
        {
          label: "操作",
          fixed: "right",
          render: (h, row) => {
            return (
              <div>
                <el-button
                  type="text"
                  onClick={() => this.detailActivity(row)}
                  size="middle"
                  class="txt-highlight"
                >
                  修改
                </el-button>
                <el-button
                  type="text"
                  onClick={() => this.detailActivity(row)}
                  size="middle"
                  class="txt-highlight"
                >
                  删除
                </el-button>
              </div>
            );
          },
        },
      ],
      currentItem: {},
      ruleForm: {},
    };
  },
  methods: {
    getResources(roleid, subsystem) {
      this.loading = true;
      roleGrantDetail({
        roleid: roleid,
        subsystem: subsystem,
      }).then((data) => {
        this.resources = data.data.resources;
        const { arr, arrChild } = this.getAllCheckresources(
          this.getAllresources(data.data.resources)
        );
        this.$refs.resTree.setCheckedKeys(arrChild);
        this.loading = false;
      });
    },
    getAllresources(resources) {
      let arr = [];
      for (const res of resources) {
        if (res.children) {
          arr = arr.concat(this.getAllresources(res.children));
        }
        arr.push(res);
      }
      return arr;
    },
    getAllCheckresources(resources) {
      const arr = [];
      const arrChild = [];
      for (const res of resources) {
        if (res.checkstatus == "check") {
          arr.push(res.id);
          if (res.pid != "0" || !res.children) {
            arrChild.push(res.id);
          }
        }
      }
      return {
        arr: arr,
        arrChild: arrChild,
      };
    },
    clickBox() {
      return false;
    },
    handleNodeClick(node) {
      if (!node.children) {
        this.currentNode = node;
        this.getResources(node.roleid, node.subsystem);
      }
    },
    showInfo(node) {
      this.listLoading = true;
      const showRoles = [
        {
          label: "校级角色",
          type: "xx",
          children: [],
        },
        {
          label: `${this.lang_college}级角色`,
          type: "dept",
          children: [],
        },
        {
          label: "其他",
          type: "qt",
          children: [],
        },
      ];
      if (node.showRoles) {
        this.listLoading = false;
      } else {
        findByResource({ resourceid: node.data.id }).then((data) => {
          for (const key in data.data.roles) {
            for (let i = 0; i < data.data.roles[key].length; i++) {
              if (data.data.roles[key][i].roletype == "xx") {
                showRoles[0].children.push(data.data.roles[key][i]);
              } else if (data.data.roles[key][i].roletype == "dept") {
                showRoles[1].children.push(data.data.roles[key][i]);
              } else {
                showRoles[2].children.push(data.data.roles[key][i]);
              }
            }
          }
          node.showRoles = showRoles;
          this.listLoading = false;
        });
      }
    },
    openSaveDialog(item) {
      this.currentItem = item || {};
      this.$refs.saveDialog.dialogVisible = true;
    },
    saveItem() {},
    getAllecked(a, b, c) {
      const resourceids = this.$refs.resTree
        .getHalfCheckedKeys()
        .concat(this.$refs.resTree.getCheckedKeys());
      this.$set(this.ruleForm, "resourceids", resourceids);
    },
    saveRoleAuthorization() {
      const resourceids = this.$refs.resTree
        .getHalfCheckedKeys()
        .concat(this.$refs.resTree.getCheckedKeys());
      if (this.isEdit) {
        saveGrant({
          resourceids: resourceids.join(","),
          roleid: this.currentNode.roleid,
        });
        this.isEdit = false;
      } else {
        this.isEdit = true;
      }
    },
  },
};
</script>

<style lang="scss">
.disabled-tree {
  .el-checkbox {
    cursor: not-allowed;
    position: relative;
    pointer-events: none;
    &::before {
      content: "";
      position: absolute;
      cursor: not-allowed;
      background: transparent;
      width: 100%;
      height: 100%;
    }
  }
  .el-checkbox__inner {
    background-color: #edf2fc;
    border-color: #dcdfe6;
    cursor: not-allowed;
    position: relative;
    pointer-events: none;

    &::after {
      cursor: not-allowed;
      border-color: #c0c4cc;
    }
  }
  .el-checkbox__input {
    &.is-checked {
      .el-checkbox__inner {
        background-color: #f2f6fc;
        border-color: #dcdfe6;
      }
    }
  }
}
</style>
