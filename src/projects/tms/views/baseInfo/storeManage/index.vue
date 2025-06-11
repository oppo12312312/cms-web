<template>
  <div>
    <div class="tableFiltersWrap">
      <el-row class="txt-right">
        <el-col>
          <v-form :fields="fields" :fieldsData="tableParams">
            <el-col :span="4" class="txt-left">
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
          <div class="txt-right">
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
      <v-dialog
        ref="saveDialog"
        width="775px"
        @handleClose="saveItem"
        :title="isEmptyObject(currentItem) ? '新增司机' : '修改司机'"
      >
        <save-form
          ref="saveItemForm"
          :patch-data="currentItem"
          :storeType="storeType"
          :isAdd="isEmptyObject(currentItem)"
        ></save-form>
      </v-dialog>
    </v-page>
  </div>
</template>

<script>
import { pageList, add, edit, remove, view } from "#/api/tmsStore";
import basicTable from "_c/tables";
import saveForm from "./saveForm";
import { getCommonOptions } from "@/api/common";
// import { codeToText } from 'element-china-area-data';

export default {
  components: {
    basicTable,
    saveForm,
  },
  data() {
    return {
      tableParams: {},
      multipleSelection: [],
      currentItem: {},
      height: window.innerHeight - 320,
      storeType: [],
    };
  },
  created() {
    window.addEventListener("resize", this.handleResize);
    getCommonOptions("store_type").then((res) => {
      this.storeType = res.data.map((d) => ({
        label: d.dmname,
        value: d.dmcode,
      }));
    });
  },
  destroyed() {
    window.removeEventListener("resize", this.handleResize);
  },
  computed: {
    tableParamsCopy() {
      const params = {};
      if (this.tableParams.storeName) {
        params.storeName = this.tableParams.storeName;
      }
      if (this.tableParams.address) {
        params.address = this.tableParams.address;
      }
      return params;
    },
    fields() {
      return [
        {
          label: "",
          prop: "storeName",
          type: "text",
          span: 4,
          placeholder: "请输入仓库名称",
        },
        {
          label: "",
          prop: "address",
          type: "text",
          span: 4,
          placeholder: "请输入仓库地址",
        },
      ];
    },
    columns() {
      return [
        {
          label: "仓库ID",
          prop: "storeId",
          width: 120,
        },
        {
          label: "仓库名称",
          prop: "storeName",
          width: 120,
        },
        {
          label: "地址",
          prop: "address",
        },
        {
          label: "配送优先级",
          prop: "deliveryPriority",
          width: 120,
        },
        {
          label: "平时准时率",
          prop: "avgZsl",
        },
        {
          label: "创建时间",
          prop: "createTime",
          width: 170,
        },
        {
          label: "操作",
          fixed: "right",
          width: 105,
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
      ];
    },
  },
  methods: {
    handleResize() {
      this.height = window.innerHeight - 320;
    },
    callServer() {
      return pageList;
    },
    fecthData() {
      this.$refs.basicTable.fecthData();
    },
    reloadData() {
      this.tableParams = {};
      this.$refs.basicTable.reload();
    },
    openSaveDialog(item) {
      if (item && item.storeId) {
        view({ storeId: item.storeId }).then((res) => {
          this.currentItem = item || {};
          this.$refs.saveDialog.dialogVisible = true;
        });
      } else {
        this.currentItem = item || {};
        this.$refs.saveDialog.dialogVisible = true;
      }
    },
    saveItem() {
      this.$refs.saveItemForm.validate((data) => {
        if (data.deliverys.findIndex((d) => !d.delivery) > -1) {
          return this.toast("请完善配送地址", "warning");
        }
        this.$refs.saveDialog.posting = true;
        const params = Object.assign({}, data);
        params.deliveryDate = params.psrq.toString();
        // params.deliverys = data.deliverys.map(d => ({
        //   address: d.address,
        //   deliveryProvince: codeToText[d.delivery[0]],
        //   deliveryProvinceCode: d.delivery[0] + '0000',
        //   deliveryCity: codeToText[d.delivery[1]],
        //   deliveryCityCode: d.delivery[1]+ '00',
        //   deliveryArea: codeToText[d.delivery[2]],
        //   deliveryAreaCode: d.delivery[2],
        // }));
        delete params.psrq;
        if (this.$refs.saveItemForm.status) {
          edit(params)
            .then(() => {
              this.$refs.saveDialog.close();
              this.toast("修改成功", "success");
              this.fecthData();
            })
            .catch(() => {
              this.$refs.saveDialog.posting = false;
            });
        } else {
          add(params)
            .then(() => {
              this.$refs.saveDialog.close();
              this.toast("添加成功", "success");
              this.fecthData();
            })
            .catch(() => {
              this.$refs.saveDialog.posting = false;
            });
        }
      });
    },
    selectionChange(val) {
      this.multipleSelection = val;
    },
    del(item) {
      if (!item && !this.multipleSelection.length) {
        return this.toast("请选择至少一条数据", "warning");
      }
      this.alert(
        "确定删除司机：<br />" +
          (item
            ? item.driverName
            : this.multipleSelection.map((i) => i.driverName).join("")),
        "删除司机",
        {
          type: "warning",
          request: () => {
            return remove({
              driverIds: item
                ? item.driverId
                : this.multipleSelection.map((i) => i.driverId).join(","),
            });
          },
          success: () => {
            this.toast("删除成功", "success");
            this.fecthData();
          },
        }
      );
    },
  },
};
</script>

<style lang="scss">
.bhed {
  height: 40px;
  display: flex;
  align-items: center;
}
</style>
