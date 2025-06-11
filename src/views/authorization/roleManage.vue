<template>
  <div>
    <div v-show="mode == 1" class="tableFiltersWrap">
      <el-row class="txt-right">
        <el-col>
          <v-form :fields="fields" :fieldsData="tableParams">
            <el-col :span="6" class="txt-left">
              <el-button type="primary" @click="fecthData">查询</el-button>
              <el-button type="default" @click="reloadData">清空</el-button>
            </el-col>
          </v-form>
        </el-col>
      </el-row>
    </div>
    <v-page v-show="mode == 1">
      <el-card shadow="never" class="card-header-tabs">
        <div slot="header" class="clearfix">
          <div class="txt-right fn-pr15">
            <v-btn type="add" @handleClick="openSaveDialog"></v-btn>
            <v-btn type="del" @handleClick="del"></v-btn>
          </div>
        </div>
        <div class="text item">
          <basic-table
            ref="basicTable"
            :columns="columns"
            :call-server="callServer"
            @selectionChange="selectionChange"
            :height="height"
            v-model="tableParamsCopy"
          ></basic-table>
        </div>
      </el-card>
    </v-page>

    <grant @back="mode = 1" v-if="mode == 2" :info="currentItem"></grant>

    <v-dialog
      ref="saveDialog"
      width="600px"
      @handleClose="saveItem"
      :title="isEmptyObject(currentItem) ? '新增角色' : '修改角色'"
    >
      <save-role-form ref="saveItemForm" :patch-data="currentItem"></save-role-form>
    </v-dialog>
    <v-dialog ref="qxglDialog" width="600px" @handleClose="saveQxgl" title="权限管理">
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
      ></el-tree>
    </v-dialog>
  </div>
</template>

<script>
import {
  delSysRole,
  listRole,
  addSysRole,
  updateSysRole,
  changeStatus,
} from "@/api/sysRole";
import basicTable from "_c/tables";
import saveRoleForm from "./components/saveRoleForm";
import grant from "./components/grant";
import { roleGrantDetail, saveGrant } from "@/api/roleManage";

export default {
  components: {
    basicTable,
    saveRoleForm,
    grant,
  },
  created() {
    window.addEventListener("resize", this.handleResize);
  },
  destroyed() {
    window.removeEventListener("resize", this.handleResize);
  },
  data() {
    return {
      tableParams: {},
      multipleSelection: [],
      currentItem: {},
      resources: [],
      defaultProps: {
        label: "name",
      },
      mode: 1,
      height: window.innerHeight - 312,
    };
  },
  computed: {
    tableParamsCopy() {
      const params = {};
      if (this.tableParams.createXm) {
        params.createXm = this.tableParams.createXm;
      }
      if (this.tableParams.name) {
        params.name = this.tableParams.name;
      }
      if (this.tableParams.createTime && this.tableParams.createTime.length == 2) {
        params.beginTime = this.tableParams.createTime[0];
        params.endTime = this.tableParams.createTime[1];
      }
      return params;
    },
    fields() {
      return [
        {
          label: "",
          prop: "name",
          span: 4,
          type: "text",
          placeholder: "请输入角色名称",
        },
        {
          label: "",
          prop: "createTime",
          span: 8,
          type: "daterange",
          sPlaceholder: "创建开始时间",
          ePlaceholder: "创建结束时间",
        },
        {
          label: "",
          prop: "createXm",
          span: 4,
          type: "text",
          placeholder: "请输入创建人",
        },
      ];
    },
    columns() {
      return [
        {
          label: "角色代码",
          prop: "code",
        },
        {
          label: "角色名称",
          prop: "name",
        },
        {
          label: "用户状态",
          prop: "lxr",
          render: (h, row) => {
            return (
              <div>
                <el-switch
                  value={row.isvalid}
                  active-value={1}
                  inactive-value={0}
                  on-change={(e) => {
                    this.changeStatus(row);
                    {
                      /* row.roleorder = !row.roleorder; */
                    }
                  }}
                ></el-switch>
              </div>
            );
          },
        },
        {
          label: "创建时间",
          prop: "createTime",
        },
        {
          label: "创建人",
          prop: "createXm",
        },
        {
          label: "操作",
          fixed: "right",
          width: 235,
          render: (h, row) => {
            return (
              <div>
                <el-button
                  type="text"
                  onClick={() => this.goFpyy(row)}
                  size="middle"
                  class="txt-highlight"
                >
                  分配用户
                </el-button>
                <el-button
                  type="text"
                  onClick={() => this.openQxglDialog(row)}
                  size="middle"
                  class="txt-highlight"
                >
                  权限管理
                </el-button>
                <el-button
                  type="text"
                  onClick={() => this.openSaveDialog(row)}
                  size="middle"
                  class="txt-highlight"
                >
                  修改
                </el-button>
                <el-button
                  type="text"
                  onClick={() => this.del(row)}
                  size="middle"
                  class="txt-highlight"
                >
                  删除
                </el-button>
              </div>
            );
          },
        },
      ];
    },
  },
  methods: {
    handleResize() {
      this.height = window.innerHeight - 312;
    },
    callServer() {
      return listRole;
    },
    fecthData() {
      this.$refs.basicTable.fecthData();
    },
    reloadData() {
      this.tableParams = {};
      this.$refs.basicTable.reload();
    },
    selectionChange(val) {
      this.multipleSelection = val;
    },
    handleNodeClick(node) {
      if (node.children) {
        this.currentNode = node;
        this.fecthData(node.id);
      }
    },
    changeStatus(row) {
      changeStatus({ id: row.roleid, status: row.isvalid == 0 ? 1 : 0 }).then((res) => {
        this.toast("更改状态成功", "success");
        row.isvalid = row.isvalid == 0 ? 1 : 0;
      });
    },
    goFpyy(item) {
      this.currentItem = item || {};
      this.mode = 2;
    },
    openSaveDialog(item) {
      this.currentItem = item || {};
      this.$refs.saveDialog.dialogVisible = true;
    },
    saveItem() {
      this.$refs.saveItemForm.validate((data) => {
        this.$refs.saveDialog.posting = true;
        if (this.$refs.saveItemForm.status) {
          updateSysRole(data)
            .then(() => {
              this.$refs.saveDialog.close();
              this.toast("修改成功", "success");
              this.fecthData();
            })
            .catch((err) => {
              this.$refs.saveDialog.posting = false;
            });
        } else {
          addSysRole(data)
            .then(() => {
              this.$refs.saveDialog.close();
              this.toast("添加成功", "success");
              this.fecthData();
            })
            .catch((err) => {
              this.$refs.saveDialog.posting = false;
            });
        }
      });
    },
    del(item) {
      if (!item && !this.multipleSelection.length) {
        return this.toast("请选择至少一条数据", "warning");
      }
      this.alert(
        "删除角色：" +
          (item ? item.name : this.multipleSelection.map((i) => i.name).join(",")) +
          "。",
        "确认要进行删除吗？",
        {
          type: "warning",
          request: () => {
            return delSysRole({
              ids: item
                ? item.roleid
                : this.multipleSelection.map((i) => i.roleid).join(","),
            });
          },
          success: () => {
            this.toast("删除成功", "success");
            this.fecthData();
          },
        }
      );
    },
    openQxglDialog(item) {
      this.currentItem = item || {};
      roleGrantDetail({ roleid: item.roleid, subsystem: "taskManager" }).then((res) => {
        this.$refs.qxglDialog.dialogVisible = true;
        this.resources = res.data.resources;
        console.log(res);
        const { arr, arrChild } = this.getAllCheckresources(
          this.getAllresources(res.data.resources)
        );
        this.$nextTick(() => {
          this.$refs.resTree.setCheckedKeys([...arrChild, ...arr]);
        });
      });
    },
    saveQxgl() {
      const resourceids = this.$refs.resTree
        .getHalfCheckedKeys()
        .concat(this.$refs.resTree.getCheckedKeys());
      saveGrant({
        resourceids: resourceids.join(","),
        roleid: this.currentItem.roleid,
      }).then((res) => {
        this.$refs.qxglDialog.close();
        this.toast("赋权成功", "success");
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
    getAllecked(a, b, c) {
      const resourceids = this.$refs.resTree
        .getHalfCheckedKeys()
        .concat(this.$refs.resTree.getCheckedKeys());
      this.$set(this.ruleForm, "resourceids", resourceids);
    },
    clickBox() {
      return false;
    },
  },
};
</script>
