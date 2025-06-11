<template>
  <div>
    <div class="tableFiltersWrap">
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
    <v-page>
      <el-card shadow="never" class="card-header-tabs">
        <div slot="header" class="clearfix">
          <!-- <div class="txt-right fn-pr15">
              <v-btn type="add" @handleClick="openSaveDialog"></v-btn>
              <v-btn type="del" @handleClick="del"></v-btn>
          </div> -->
        </div>
        <div class="text item">
          <basic-table
            ref="basicTable"
            :columns="columns"
            :call-server="callServer"
            @selectionChange="selectionChange"
            v-model="tableParams"
          ></basic-table>
        </div>
        <v-dialog
          ref="saveDialog"
          width="600px"
          @handleClose="saveItem"
          :title="isEmptyObject(currentItem) ? '新增菜单' : '修改菜单'"
        >
          <save-menu-form
            ref="saveItemForm"
            :groups="menugroupOptions"
            :patch-data="currentItem"
          ></save-menu-form>
        </v-dialog>
      </el-card>
    </v-page>
  </div>
</template>

<script>
import {
  listResource,
  updateSysResource,
  addSysResource,
} from "@/api/sysResource";
import { getCodeOptions, getOptTxt } from "@/filters/options";
import basicTable from "_c/tables";
import saveMenuForm from "./components/saveMenuForm";

export default {
  components: {
    basicTable,
    saveMenuForm,
  },
  created() {
    getCodeOptions("menugroup", false, {
      label: "dmname",
      value: "dmcode",
    }).then((data) => {
      this.menugroupOptions = data;
    });
  },
  data() {
    return {
      menugroupOptions: [],
      tableParams: {
        name: "",
      },

      columns: [
        {
          label: "名称",
          prop: "name",
        },
        {
          label: "分组",
          render: (h, row) => {
            return (
              <div>
                {row.groupid
                  ? getOptTxt(this.menugroupOptions, row.groupid)
                  : "未分组"}
              </div>
            );
          },
        },
        {
          label: "是否有效",
          render: (h, row) => {
            return <div>{row.status == 1 ? "是" : "否"}</div>;
          },
        },
        {
          label: "是否推荐",
          render: (h, row) => {
            return <div>{row.isrecommend == 1 ? "是" : "否"}</div>;
          },
        },
        {
          label: "序号",
          prop: "orderno",
        },
        /*{ {
          label: "图标",
          render: (h, row) => {
            return  <el-image src={require(`@p/static/servicefont/${row.icon?row.icon:'A1'}.svg`)} class="item-svg_50"></el-image>;
          },
        }, }*/
        {
          label: "操作",
          fixed: "right",
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
      ],
      currentItem: {},
    };
  },
  computed: {
    fields() {
      return [
        {
          label: "",
          prop: "name",
          span: 4,
          type: "text",
          placeholder: "请输入名称",
        },
        {
          label: "",
          prop: "groupid",
          span: 4,
          type: "select",
          placeholder: "请选择分组",
          options: this.menugroupOptions,
        },
      ];
    },
  },
  methods: {
    callServer(pagination) {
      return listResource;
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
    openSaveDialog(item) {
      this.currentItem = item || {};
      this.$refs.saveDialog.dialogVisible = true;
    },
    saveItem() {
      const me = this;
      this.$refs.saveItemForm.validate((data) => {
        this.$refs.saveDialog.posting = true;
        if (this.$refs.saveItemForm.status) {
          updateSysResource(data)
            .then(() => {
              this.$refs.saveDialog.close();
              me.toast("修改成功", "success");
              me.fecthData();
            })
            .catch((err) => {
              this.$refs.saveDialog.posting = false;
            });
        } else {
          addSysResource(data)
            .then(() => {
              this.$refs.saveDialog.close();
              me.toast("添加成功", "success");
              me.fecthData();
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
        dels.push(item.name);
        ids.push(item.id);
      } else {
        if (this.multipleSelection.length) {
          for (const ml of this.multipleSelection) {
            dels.push(ml.name);
            ids.push(ml.id);
          }
        }
      }
      this.alert("删除菜单：" + dels.join(",") + "。", "确认要进行删除吗？", {
        type: "warning",
        request() {
          return updateSysResource({
            id: item.id,
            status: 0,
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
