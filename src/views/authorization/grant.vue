<template>
  <v-page>
    <el-tabs v-model="activeName" @tab-click="tabClick">
      <el-tab-pane label="按角色授权" name="byRole"></el-tab-pane>
      <el-tab-pane label="按用户授权" name="byUser"></el-tab-pane>
    </el-tabs>
    <div class="container" style="display: flex" v-if="activeName == 'byRole'">
      <el-card shadow="never" class="role-card">
        <div slot="header">
          <span class="txt-bold">角色列表</span>
        </div>
        <role-tree
          ref="roleTree"
          @initTree="handleNodeClick"
          @handleNodeClick="handleNodeClick"
        ></role-tree>
      </el-card>
      <el-card shadow="never" class="content">
        <div slot="header">
          <span class="txt-bold">已分配用户</span>
        </div>
        <v-form :fields="fields" :fieldsData="tableParams">
          <el-col :span="3">
            <el-button type="primary" @click="fecthData">查询</el-button>
          </el-col>
        </v-form>
        <div class="txt-right" v-if="currentNode.roletype != 'qt'">
          <v-btn type="del" size="small" @handleClick="del"></v-btn>
          <v-btn type="add" size="small" @handleClick="openSaveDialog"></v-btn>
        </div>
        <basic-table
          v-if="currentNode.roleid"
          :columns="columns"
          :call-server="callServer"
          @selectionChange="selectionChange"
          ref="basicTable"
          v-model="tableParams"
        >
        </basic-table>
        <div v-else class="txt-center">请选择角色</div>
      </el-card>
      <v-dialog
        ref="saveDialog"
        width="840px"
        @handleClose="saveItem"
        title="新增用户"
      >
        <save-role-user-form
          ref="saveItemForm"
          :patch-data="currentNode"
        ></save-role-user-form>
      </v-dialog>
    </div>
    <div class="container" v-else>
      <el-card shadow="never" class="content">
        <div slot="header">
          <span class="txt-bold">请选择用户</span>
        </div>
        <v-form :fields="fields" :fieldsData="tableParams">
          <el-col :span="4">
            <el-button type="primary" @click="fecthData1">查询</el-button>
          </el-col>
        </v-form>
        <basic-table
          :columns="columns1"
          :call-server="callServer1"
          @selectionChange="selectionChange"
          v-model="tableParams"
          :muti="false"
          ref="basicTable1"
        >
        </basic-table>
      </el-card>
      <el-card shadow="never" class="role-card">
        <div slot="header" class="card-header">
          <span class="txt-bold">已分配角色</span>
          <el-button type="primary" size="small" class="btn" @click="save"
            >保存</el-button
          >
        </div>
        <el-tree
          v-loading="loading"
          :data="treeData"
          show-checkbox
          :expand-on-click-node="false"
          node-key="roleid"
          default-expand-all
          @check-change="getAllecked"
          ref="resTree"
          :props="defaultProps"
        >
        </el-tree>
      </el-card>
    </div>
  </v-page>
</template>

<script>
import basicTable from "_c/tables";
import saveRoleUserForm from "_c/forms/saveRoleUserForm";
import roleTree from "./components/roleTree";
import {
  roleGrantedUserList,
  roleUserList,
  deleteRoleUsers,
} from "@/api/roleManage";
import { userList, preGrantRole, grantRole } from "@/api/userManage";
import { getDeptsListOptions, getOptTxt } from "@/filters/options";

export default {
  components: {
    basicTable,
    saveRoleUserForm,
    roleTree,
  },
  data() {
    const activeName = this.$route.query.activeName || "byRole";
    return {
      activeName: activeName,
      defaultProps: {
        label: "name",
      },
      tableParams: {},
      multipleSelection: [],
      treeData: [
        {
          name: "校级角色",
          roleid: "xx",
          children: [],
        },
        {
          name: `${this.lang_college}级角色`,
          roleid: "dept",
          children: [],
        },
        {
          name: "其他",
          roleid: "qt",
          children: [],
          disabled: true,
        },
      ],
      showRight: false,
      columns: [
        {
          label: "用户名",
          prop: "username",
        },
        {
          label: "姓名",
          prop: "truename",
        },
        {
          label: "所在部门",
          prop: "deptname",
        },
        {
          label: "操作",
          fixed: "right",
          render: (h, row) => {
            return (
              <div>
                <el-button
                  type="text"
                  size="middle"
                  class={
                    this.currentNode.roletype != "qt"
                      ? "txt-highlight"
                      : "txt-highlight displayNone"
                  }
                  onClick={() => this.del(row)}
                >
                  删除
                </el-button>
              </div>
            );
          },
        },
      ],
      columns1: [
        {
          label: "用户名",
          prop: "username",
        },
        {
          label: "姓名",
          prop: "truename",
        },
        {
          label: "所在部门",
          prop: "deptname",
        },
        {
          label: "操作",
          fixed: "left",
          width: "80",
          render: (h, row) => {
            return (
              <div>
                <el-button
                  type="text"
                  size="middle"
                  class="txt-highlight"
                  onClick={() => this.showPerms(row)}
                >
                  选择
                </el-button>
              </div>
            );
          },
        },
      ],
      currentItem: {},
      currentNode: {},
      ruleForm: {},
      resources: [],
      loading: false,
      deptsListOptions: [],
    };
  },
  created() {
    getDeptsListOptions().then((data) => {
      this.deptsListOptions = data;
    });
  },
  computed: {
    fields() {
      return [
        {
          label: "",
          prop: "truename",
          span: 5,
          type: "text",
          placeholder: "请输入姓名",
        },
        {
          label: "",
          prop: "username",
          span: 5,
          type: "text",
          placeholder: "请输入用户名",
        },
        {
          label: "",
          prop: "deptid",
          span: 5,
          type: "select",
          placeholder: "请选择部门",
          options: this.deptsListOptions,
        },
        {
          label: "",
          prop: "usertype",
          span: 5,
          type: "select",
          placeholder: "请选择角色类型",
          options: [
            { label: "学生", value: "0" },
            { label: "教工", value: "1" },
            { label: "其它", value: "9" },
          ],
        },
      ];
    },
  },
  methods: {
    callServer(pagination) {
      return roleUserList;
    },
    callServer1(pagination) {
      return userList;
    },
    getAllecked(a, b, c) {
      const resourceids = this.$refs.resTree
        .getHalfCheckedKeys()
        .concat(this.$refs.resTree.getCheckedKeys());
      this.$set(this.ruleForm, "resourceids", resourceids);
    },
    showPerms(item) {
      this.showRight = true;
      if (this.currentItem.userid && item.userid == this.currentItem.userid) {
        return;
      } else {
        this.currentItem = item;
        this.loading = true;
        preGrantRole(item.userid).then((data) => {
          const xxs = [];
          const depts = [];
          const qts = [];
          for (let i = 0; i < data.data.length; i++) {
            if (data.data[i].roletype == "xx") {
              xxs.push(data.data[i]);
            } else if (data.data[i].roletype == "dept") {
              depts.push(data.data[i]);
            } else {
              data.data[i].disabled = true;
              qts.push(data.data[i]);
            }
          }
          this.treeData[0].children = xxs;
          this.treeData[1].children = depts;
          this.treeData[2].children = qts;
          this.resources = this.getAllresources(data.data);
          const { arr, arrChild } = this.getAllCheckresources(this.resources);
          this.$nextTick(() => {
            this.$refs.resTree.setCheckedKeys(arrChild);
          });
          this.loading = false;
        });
      }
    },
    save() {
      const me = this;
      const roleids = this.ruleForm.resourceids;
      grantRole({
        userId: me.currentItem.userid,
        roleids: roleids.join(","),
      }).then((data) => {
        me.toast("操作成功", "success");
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
        if (res.checkstatus == "true") {
          arr.push(res.roleid);
          if (!res.children) {
            arrChild.push(res.roleid);
          }
        }
      }
      return {
        arr: arr,
        arrChild: arrChild,
      };
    },
    fecthData() {
      if (this.$refs.basicTable) {
        this.$refs.basicTable.fecthData();
      }
    },
    fecthData1() {
      if (this.$refs.basicTable1) {
        this.$refs.basicTable1.fecthData();
      }
    },
    handleNodeClick(node) {
      if (!node.children) {
        this.currentNode = node;
        this.$set(this.tableParams, "roleid", node.roleid);
        this.fecthData();
      }
    },
    selectionChange(val) {
      this.multipleSelection = val;
    },
    openSaveDialog(item) {
      this.$refs.saveDialog.dialogVisible = true;
    },
    saveItem() {
      const me = this;
      if (this.$refs.saveItemForm.multipleSelection.length) {
        this.$refs.saveDialog.posting = true;
        const ids = [];
        for (const ml of this.$refs.saveItemForm.multipleSelection) {
          ids.push(ml.userid);
        }
        roleGrantedUserList({
          roleid: me.currentNode.roleid,
          userids: ids.join(","),
        }).then((data) => {
          me.toast("操作成功", "success");
          this.$refs.saveDialog.posting = false;
          this.$refs.saveDialog.close();
          me.fecthData();
        });
      } else {
        this.toast("请选择用户", "warning");
      }
    },
    tabClick(tab) {
      this.activeName = tab.name;
      this.tableParams = {};
      this.$router.replace({
        name: this.$route.name,
        query: { activeName: tab.name },
      });
    },
    del(item) {
      const me = this;
      const dels = [];
      const ids = [];
      if (item) {
        dels.push(item.truename);
        ids.push(item.userid);
      } else {
        if (this.multipleSelection.length) {
          for (const ml of this.multipleSelection) {
            dels.push(ml.truename);
            ids.push(ml.userid);
          }
        }
      }
      this.alert("删除用户：" + dels.join(",") + "。", "确认要进行删除吗？", {
        type: "warning",
        request() {
          return deleteRoleUsers({
            roleid: me.currentNode.roleid,
            userids: ids.join(","),
          });
        },
        success() {
          me.toast("删除成功", "success");
          me.fecthData();
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  justify-content: space-between;

  .role-card {
    width: 280px;

    .card-header {
      position: relative;

      .btn {
        position: absolute;
        top: -6px;
        right: 0;
      }
    }
  }

  .content {
    flex: 1;
  }
}
</style>
