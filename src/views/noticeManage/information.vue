<template>
  <v-page :has-left="true">
    <template #left>
      <el-card shadow="never">
        <div slot="header" class="clearfix">
          <span class="txt-bold">栏目树</span>
        </div>
        <channel-tree
          ref="channelTree"
          isDisplay="1"
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
        :call-server="callServer"
        @selectionChange="selectionChange"
        v-model="tableParams"
        ref="basicTable"
      >
        <el-row
          v-if="currentNode.channelId && currentNode.channelId != '0'"
          slot="tableHeader"
          class="txt-right"
        >
          <el-col :span="12">
            <v-form :fields="fields" :fieldsData="tableParams">
              <el-col :sm="12" :md="4">
                <el-button type="primary" @click="fecthData">查询</el-button>
              </el-col>
            </v-form>
          </el-col>
          <el-col :span="12">
            <v-btn type="del" @handleClick="del"></v-btn>
            <v-btn type="add" @handleClick="openSaveDialog"></v-btn>
          </el-col>
        </el-row>
      </basic-table>
      <v-dialog
        ref="saveDialog"
        width="720px"
        @handleClose="saveItem"
        :title="isEmptyObject(currentItem) ? '新增信息' : '修改信息'"
      >
        <save-content-form
          ref="saveItemForm"
          :patch-data="currentItem"
          :tree-data="treeData"
        ></save-content-form>
      </v-dialog>
    </el-card>
  </v-page>
</template>

<script>
import basicTable from "_c/tables/";
import channelTree from "./components/channelTree";
import saveContentForm from "_c/forms/saveContentForm";

import {
  contentAdd,
  contentDelete,
  contentEdit,
  contentListMng,
} from "@/api/information";

export default {
  components: {
    basicTable,
    channelTree,
    saveContentForm,
  },
  data() {
    return {
      tableParams: {
        channelId: "0",
      },
      tableData: [],
      treeData: [],
      currentItem: {},
      currentNode: {},
      multipleSelection: [],
      columns: [
        {
          label: "标题",
          prop: "title",
        },
        // {
        //   label: "开放时间",
        //   render: (h, row) => {
        //     return (
        //       <span>
        //         {row.kssj}-{row.jssj}
        //       </span>
        //     );
        //   },
        // },
        {
          label: "是否对外",
          width: "150px",
          render: (h, row) => {
            return <span>{row.isRecommend == "0" ? "否" : "是"}</span>;
          },
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
      fields: [
        {
          label: "",
          placeholder: "请输入标题",
          prop: "title",
          type: "text",
          span: 8,
          change: this.fecthData,
        },
      ],
    };
  },
  methods: {
    callServer() {
      return contentListMng;
    },
    fecthData() {
      this.$refs.basicTable.fecthData();
    },
    handleNodeClick(node) {
      this.currentNode = node;
      this.tableParams.channelId = node.channelId;
      this.fecthData();
    },
    selectionChange(val) {
      this.multipleSelection = val;
    },
    getTree(data) {
      this.treeData = data;
    },
    openSaveDialog(item) {
      if (item) {
        this.currentItem = item;
      } else {
        this.currentItem = {};
      }
      this.currentItem.node = this.currentNode;
      this.$refs.saveDialog.dialogVisible = true;
    },
    saveItem() {
      const me = this;
      this.$refs.saveItemForm.validate((data) => {
        this.$refs.saveDialog.posting = true;
        if (data.contentId) {
          contentEdit(data)
            .then(() => {
              this.$refs.saveDialog.close();
              me.toast("修改成功", "success");
              this.fecthData();
            })
            .catch((err) => {
              this.$refs.saveDialog.posting = false;
            });
        } else {
          contentAdd(data)
            .then(() => {
              this.$refs.saveDialog.close();
              me.toast("添加成功", "success");
              this.fecthData();
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
        dels.push(item.title);
        ids.push(item.contentId);
      } else {
        if (this.multipleSelection.length) {
          for (const ml of this.multipleSelection) {
            dels.push(ml.title);
            ids.push(ml.contentId);
          }
        } else {
          this.$message.warning("请选择一条信息");
          return;
        }
      }
      this.alert("删除信息：" + dels.join(",") + "。", "确认要进行删除吗？", {
        type: "warning",
        request() {
          return contentDelete(ids.join(","));
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
