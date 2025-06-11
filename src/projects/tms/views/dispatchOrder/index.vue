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
        <el-tabs v-model="activeName" @tab-click="$refs.basicTable.reload()">
          <el-tab-pane label="全部" name="0"></el-tab-pane>
          <el-tab-pane label="待配送" name="7"></el-tab-pane>
          <el-tab-pane label="待收货" name="4"></el-tab-pane>
          <el-tab-pane label="已收货" name="5"></el-tab-pane>
        </el-tabs>
        <div class="text item">
          <basic-table
            ref="basicTable"
            :columns="columns"
            :call-server="callServer"
            :before-show="beforeShow"
            @selectionChange="selectionChange"
            :height="height"
            v-model="tableParamsCopy"
          ></basic-table>
        </div>
      </el-card>
      <v-dialog ref="saveDialog" width="600px" @handleClose="saveItem" title="修改费用">
        <save-form ref="saveItemForm" :patch-data="currentItem"></save-form>
      </v-dialog>
    </v-page>
  </div>
</template>

<script>
import { dispatchOrder, updateFee } from "#/api/dispatchOrder";
import basicTable from "_c/tables";
import saveForm from "./saveForm";

export default {
  components: {
    basicTable,
    saveForm,
  },
  data() {
    return {
      tableParams: { supplierName: "" },
      multipleSelection: [],
      currentItem: {},
      height: window.innerHeight - 320,
      activeName: "0",
    };
  },
  created() {
    window.addEventListener("resize", this.handleResize);
  },
  destroyed() {
    window.removeEventListener("resize", this.handleResize);
  },
  computed: {
    tableParamsCopy: {
      get() {
        const params = {
          pageIndex: 0,
          pageSize: 0,
          searchCount: false,
          startTimeStr: "",
          status: this.activeName,
          supplierName: this.tableParams.supplierName,
          tab: "",
        };
        return params;
      },
      set(val) {
        console.log("tableParamsCopy updated:", val);
      },
    },
    fields() {
      return [
        {
          label: "",
          prop: "supplierName",
          type: "text",
          span: 4,
          placeholder: "请输入供应商名称",
        },
      ];
    },
    columns() {
      return [
        {
          label: "供应商",
          prop: "supplierName",
          render: (h, row) => {
            return (
              <div>
                <div class="ps-info-m">{row.supplierName}</div>
                <div class="ps-info">配送仓：{row.deliveryStore}</div>
              </div>
            );
          },
        },
        {
          label: "用户订单",
          prop: "orderNo",
          render: (h, row) => {
            return (
              <div>
                <div class="ps-info-m">{row.orderNo}</div>
                <div class="ps-info">地址：{row.orderAddress || "-"}</div>
              </div>
            );
          },
        },
        {
          label: "配送订单",
          prop: "deliveryOrderNo",
          render: (h, row) => {
            return (
              <div>
                <div class="ps-info-m">仓库司机配送</div>
                <div class="ps-info">{row.deliveryOrderNo}</div>
              </div>
            );
          },
        },
        {
          label: "司机",
          width: 170,
          render: (h, row) => {
            return (
              <div>
                <div class="ps-info-m">
                  {row.driverName} <span class="fg">|</span> {row.plateNo || "-"}
                </div>
                <div class="ps-info">{row.phone}</div>
              </div>
            );
          },
        },
        {
          label: "送货时间",
          prop: "startTime",
          width: 170,
          render: (h, row) => {
            return (
              <div>
                <div class="ps-info-m">{row.startTime || "-"}</div>
                <div class="ps-info">{row.endTime || "-"}</div>
              </div>
            );
          },
        },
        {
          label: "客户/联系人",
          prop: "customerName",
          render: (h, row) => {
            return (
              <div>
                <div class="ps-info-m">
                  {row.customerName} <span class="fg">|</span> {row.contactName}
                </div>
                <div class="ps-info">{row.status || "1"}</div>
              </div>
            );
          },
        },
        {
          label: "操作",
          fixed: "right",
          width: 115,
          render: (h, row) => {
            return (
              <div>
                <el-button type="text" size="middle" class="txt-highlight">
                  详情
                </el-button>
                <el-button
                  type="text"
                  onClick={() => this.openSaveDialog(row)}
                  size="middle"
                  class="txt-highlight"
                >
                  修改费用
                </el-button>
              </div>
            );
          },
        },
      ];
    },
  },
  methods: {
    beforeShow(data) {
      console.log("beforeShow", data);
      return data;
    },
    handleResize() {
      this.height = window.innerHeight - 320;
    },
    callServer() {
      return dispatchOrder;
    },
    fecthData() {
      this.$refs.basicTable.fecthData();
    },
    reloadData() {
      this.tableParams = {};
      this.$refs.basicTable.reload();
    },
    openSaveDialog(item) {
      this.currentItem = item || {};
      this.$refs.saveDialog.dialogVisible = true;
    },
    saveItem() {
      this.$refs.saveItemForm.validate((data) => {
        this.$refs.saveDialog.posting = true;
        updateFee(data)
          .then(() => {
            this.$refs.saveDialog.close();
            this.toast("修改成功", "success");
            this.fecthData();
          })
          .catch(() => {
            this.$refs.saveDialog.posting = false;
          });
      });
    },
    selectionChange(val) {
      this.multipleSelection = val;
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
.ps-info {
  margin-top: 2px;
}
.fg {
  color: #aaa;
}
</style>
