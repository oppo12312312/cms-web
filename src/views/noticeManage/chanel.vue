<template>
  <v-page :has-left="true">
    <template #left>
      <el-card shadow="never">
        <div slot="header" class="clearfix">
          <span class="txt-bold">栏目树</span>
        </div>
        <channel-tree
          ref="channelTree"
          @getTree="getTree"
          @handleNodeClick="handleNodeClick"
        ></channel-tree>
      </el-card>
    </template>
    <el-card shadow="never">
      <div slot="header" class="clearfix">
        <span class="txt-bold">栏目信息</span>
      </div>
      <basic-table
        :columns="columns"
        :props-data="tableData"
        @selectionChange="selectionChange"
        ref="basicTable"
      >
        <div slot="tableHeader" class="txt-right">
          <v-btn type="del" @handleClick="del"></v-btn>
          <v-btn type="add" @handleClick="openSaveDialog"></v-btn>
        </div>
      </basic-table>
      <v-dialog
        ref="saveDialog"
        width="600px"
        @handleClose="saveItem"
        :title="!status ? '新增栏目' : '修改栏目'"
      >
        <save-channel-form
          ref="saveItemForm"
          :patch-data="currentItem"
          :tree-data="treeData"
        ></save-channel-form>
      </v-dialog>
    </el-card>
  </v-page>
</template>

<script>
import basicTable from "_c/tables/";
import channelTree from "./components/channelTree";
import saveChannelForm from "_c/forms/saveChannelForm";

import { channelAdd, channelDelete, channelEdit } from "@/api/channel";

export default {
  components: {
    basicTable,
    channelTree,
    saveChannelForm,
  },
  data() {
    return {
      status: true,
      tableData: [],
      treeData: [],
      currentItem: {},
      currentNode: {},
      multipleSelection: [],
      columns: [
        {
          label: "栏目名称",
          prop: "channelName",
        },
        {
          label: "操作",
          fixed: "right",
          width: "100px",
          render: (h, row) => {
            return (
              <div>
                <el-button
                  type="text"
                  onClick={() => this.openSaveDialog(row)}
                  size="middle"
                  class="txt-highlight"
                >
                  修改
                </el-button>
              </div>
            );
          },
        },
      ],
    };
  },
  methods: {
    handleNodeClick(node) {
      this.currentNode = node;
      this.tableData = node.children || [];
    },
    selectionChange(val) {
      this.multipleSelection = val;
    },
    getTree(data) {
      this.treeData = data;
      if (!this.currentNode.channelId) {
        this.tableData = data[0].children || [];
      }
    },
    openSaveDialog(item) {
      if (item) {
        this.currentItem = item;
        this.currentItem.parent = this.currentNode;
        this.status = true;
      } else {
        this.currentItem = {};
        this.currentItem.parent = this.currentNode;
        this.status = false;
      }
      this.$refs.saveDialog.dialogVisible = true;
    },
    saveItem() {
      const me = this;
      this.$refs.saveItemForm.validate((data) => {
        this.$refs.saveDialog.posting = true;
        if (this.status) {
          channelEdit(data)
            .then(() => {
              this.$refs.saveDialog.close();
              me.toast("修改成功", "success");
              this.$refs.channelTree.init();
            })
            .catch((err) => {
              this.$refs.saveDialog.posting = false;
            });
        } else {
          channelAdd(data)
            .then(() => {
              this.$refs.saveDialog.close();
              me.toast("添加成功", "success");
              this.$refs.channelTree.init();
            })
            .catch((err) => {
              this.$refs.saveDialog.posting = false;
            });
        }
      });
    },
    del(item) {
      const me = this;
      const dels = [];
      const ids = [];
      if (item) {
        dels.push(item.channelName);
        ids.push(item.channelId);
      } else {
        if (this.multipleSelection.length) {
          for (const ml of this.multipleSelection) {
            dels.push(ml.channelName);
            ids.push(ml.channelId);
          }
        } else {
          this.$message.warning("请选择一条栏目");
          return;
        }
      }
      this.alert("删除栏目：" + dels.join(",") + "。", "确认要进行删除吗？", {
        type: "warning",
        request() {
          return channelDelete(ids.join(","));
        },
        success() {
          me.toast("删除成功", "success");
          me.$refs.channelTree.init();
        },
      });
    },
  },
};
</script>
