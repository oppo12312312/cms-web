<template>
  <v-page :has-left="true">
    <template #left>
      <el-card shadow="never">
        <div slot="header" class="clearfix">
          <span class="txt-bold">代码树</span>
        </div>
        <dictionary-tree
          ref="codeTree"
          @getTree="getTree"
          @handleNodeClick="handleNodeClick"
          :props-node="currentid"
        ></dictionary-tree>
      </el-card>
    </template>
    <el-card shadow="never">
      <div slot="header" class="clearfix">
        <span class="txt-bold">代码信息</span>
      </div>
      <basic-table
        :columns="columns"
        :props-data="tableData"
        @selectionChange="selectionChange"
        v-model="tableParams"
        ref="basicTable"
      >
        <el-row slot="tableHeader" class="txt-right">
          <el-col :span="16">
            <v-form :fields="fields" :fieldsData="tableParams">
              <el-col :span="4" class="txt-left">
                <el-button type="primary" @click="fecthData">查询</el-button>
              </el-col>
            </v-form>
          </el-col>
          <el-col :span="8">
            <v-btn type="add" txt="新增" @handleClick="saveDialog"></v-btn>
            <v-btn type="del" txt="删除" @handleClick="delCodeItem"></v-btn>
          </el-col>
        </el-row>
      </basic-table>
      <v-dialog
        ref="saveDialog"
        @handleClose="saveCodeItem"
        width="640px"
        :title="status == 'add' ? '新增代码' : '修改代码'"
      >
        <save-dmcode-form
          :patch-data="currentItem"
          ref="saveCodeForm"
          @keyUpSubmit="saveCodeItem"
        ></save-dmcode-form>
      </v-dialog>
    </el-card>
  </v-page>
</template>

<script>
import basicTable from "_c/tables/";
import dictionaryTree from "./components/dictionaryTree";
import saveDmcodeForm from "_c/forms/saveDmcodeForm";
import {
  codeTreeList,
  addCode,
  editCode,
  delCode,
  codeSearch,
} from "@/api/code";

export default {
  components: {
    basicTable,
    dictionaryTree,
    saveDmcodeForm,
  },
  data() {
    return {
      loading: true,
      currentItem: {},
      multipleSelection: [],
      defaultProps: {
        children: "children",
        label: "dmname",
        isLeaf: "isleaf",
      },
      columns: [
        {
          label: "字典代码",
          prop: "dmcode",
        },
        {
          label: "代码名称",
          prop: "dmname",
        },
        {
          label: "转换代码",
          prop: "trancode",
        },
        {
          label: "上级代码",
          prop: "parentname",
        },
        {
          label: "备注",
          prop: "remark",
        },
        {
          label: "是否有效",
          render: (h, row) => {
            switch (row.isvalid) {
              case "1":
                return <span class="txt-success">是</span>;
              case "0":
                return <span class="txt-danger">否</span>;
            }
          },
        },
        {
          label: "序号",
          prop: "orderno",
        },

        {
          label: "操作",
          fixed: "right",
          width: "80px",
          render: (h, row) => {
            return (
              <div>
                <el-button
                  type="text"
                  onClick={() => this.saveDialog(row)}
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
      tableData: [],
      tableParams: {},
      fields: [
        {
          label: "",
          placeholder: "输入代码名称",
          prop: "dmname",
          type: "text",
          span: 8,
        },
      ],
      currentid: this.$route.meta.submodel,
      currentNode: {},
      status: "add",
    };
  },
  watch: {
    $route: function (to, from) {
      this.$nextTick(() => {
        this.$refs.codeTree.treeData = [
          {
            dmname: this.$route.meta.title,
            dmid: this.$route.meta.submodel,
            dmcode: this.$route.meta.submodel,
            children: [],
          },
        ];
      });
    },
  },
  methods: {
    init() {
      this.loading = true;
      this.loading = false;
    },
    handleNodeClick(node) {
      console.log(node);
      this.currentNode = node.data;
      this.tableData = node?.data?.children || [];
      this.currentid = node?.key;
    },
    getTree(data) {
      this.treeData = data;
      if (!this.currentNode.dmid) {
        this.tableData = data[0].children || [];
      }
    },
    selectionChange(val) {
      this.multipleSelection = val;
    },
    fecthData() {
      const params = {
        dmid: this.currentid,
        dmname: this.tableParams.dmname,
      };
      codeSearch(params).then((data) => {
        this.tableData = data.data;
      });
    },
    saveDialog(item) {
      if (item) {
        this.currentItem = item;
        //this.currentItem.parent = this.currentNode;
        this.status = "edit";
      } else {
        this.currentItem = {
          parentid: this.currentid,
        };
        this.status = "add";
      }
      this.$refs.saveDialog.dialogVisible = true;
    },
    saveCodeItem() {
      const me = this;
      this.$refs.saveCodeForm.validate((data) => {
        this.$refs.saveDialog.posting = true;
        if (this.status == "edit") {
          editCode(data)
            .then(() => {
              me.$refs.saveDialog.close();
              me.toast("修改成功", "success");
              me.$refs.codeTree.uploaded(me.currentid);
            })
            .catch((err) => {
              me.$refs.saveDialog.posting = false;
            });
        } else {
          addCode(data)
            .then(() => {
              me.$refs.saveDialog.close();
              me.toast("添加成功", "success");
              me.$refs.codeTree.uploaded(me.currentid);
            })
            .catch((err) => {
              me.$refs.saveDialog.posting = false;
            });
        }
      });
    },
    delCodeItem() {
      if (this.multipleSelection.length) {
        const me = this;
        const ids = [];
        for (let i = 0; i < this.multipleSelection.length; i++) {
          ids.push(this.multipleSelection[i].dmid);
        }
        me.alert("确定删除选中代码？", "删除", {
          type: "error",
          request() {
            return delCode({ ids: ids });
          },
          success() {
            me.toast("删除成功", "success");
            me.$refs.codeTree.uploaded(me.currentid);
          },
        });
      } else {
        this.toast("请先选择至少一项", "warning");
      }
    },
  },
};
</script>
