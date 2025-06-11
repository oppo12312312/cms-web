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
      <el-card
        shadow="never"
        class="card-header-tabs"
        style="position: relative"
      >
        <el-tabs v-model="activeName" @tab-click="$refs.basicTable.reload()">
          <el-tab-pane label="全部" name="99"></el-tab-pane>
          <el-tab-pane label="待配送" name="0"></el-tab-pane>
          <el-tab-pane label="待收货" name="1"></el-tab-pane>
          <el-tab-pane label="已收货" name="2"></el-tab-pane>
        </el-tabs>
        <div style="position: absolute; top: 9px; right: 16px; display: flex">
          <el-button type="primary" size="small">核销订单</el-button>
          <v-export-btn2
            :download="exportList"
            :columns="columns"
            fileName="配送任务列表"
            type="default"
            size="small"
          ></v-export-btn2>
        </div>
        <div class="text item">
          <basic-table
            ref="basicTable"
            :columns="columns"
            :call-server="callServer"
            @selectionChange="selectionChange"
            :before-show="beforeShow"
            :height="height"
            v-model="tableParamsCopy"
          ></basic-table>
        </div>
      </el-card>
    </v-page>
  </div>
</template>

<script>
import {
  dispatchTask,
  exportList,
  searchPSOrders,
  updatePSOrderStatus,
} from "#/api/deliveryTasks";
import basicTable from "_c/tables";
import { codeTreeList } from "@/api/code";
import { get } from "sortablejs";

export default {
  components: {
    basicTable,
  },
  data() {
    return {
      tableParams: {},
      multipleSelection: [],
      currentItem: {},
      height: window.innerHeight - 320,
      activeName: "99",
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
          tab: parseInt(this.activeName),
          orderNumber: this.tableParams.orderNumber || "",
          userNickname: this.tableParams.userNickname || "",
          pageIndex: 1,
          pageSize: 10,
          searchCount: false,
        };

        if (this.tableParams.deliveryMethod) {
          params.deliveryMethod = this.tableParams.deliveryMethod;
        }

        return params;
      },
      set(newValue) {
        // Handle updates from v-model binding
        // 这里可以根据需要处理来自v-model的更新
        console.log("tableParamsCopy updated:", newValue);
      },
    },
    fields() {
      return [
        {
          label: "",
          prop: "orderNumber",
          type: "text",
          span: 4,
          placeholder: "请输入订单号",
        },
        {
          label: "",
          prop: "userNickname",
          type: "text",
          span: 4,
          placeholder: "请输入客户名称",
        },
        {
          label: "",
          prop: "deliveryMethod",
          type: "select",
          span: 4,
          placeholder: "请选择配送方式",
          options: [
            { label: "仓库司机配送", value: "1" },
            { label: "第三方配送", value: "2" },
          ],
        },
      ];
    },
    columns() {
      const tagType = {
        13: "warning",
        14: "success",
        15: "info",
      };
      const baseColumns = [
        // {
        //   label: "配送订单编号",
        //   prop: "platformOrderNumber",
        // },
        {
          label: "客户信息",
          prop: "userNickname",
          render: (h, row) => {
            return (
              <div>
                <div class="ps-info-m">{row.userNickname || "-"}</div>
                <div class="ps-info">{row.deliveryAddress || "-"}</div>
              </div>
            );
          },
        },
        {
          label: "用户订单",
          prop: "orderNumber",
          render: (h, row) => {
            return (
              <div>
                <div class="ps-info-m">仓库司机配送</div>
                <div class="ps-info">{row.orderNumber}</div>
              </div>
            );
          },
        },
        {
          label: "订单金额",
          prop: "totalCost",
          render: (h, row) => {
            return (
              <div>
                <div class="ps-info-m">订单总额：{row.totalCost}</div>
                <div class="ps-info">实际支付：{row.actualPaymentAmount}</div>
              </div>
            );
          },
        },
        {
          label: "司机",
          prop: "deliveryDriver",
          render: (h, row) => {
            return (
              <div>
                <div class="ps-info-m">{row.deliveryDriver || "-"}</div>
              </div>
            );
          },
        },
        {
          label: "送货时间",
          prop: "deliveryTime",
          width: 170,
          render: (h, row) => {
            return (
              <div>
                <div class="ps-info-m">{row.deliveryTime || "-"}</div>
                <div class="ps-info">{row.signForTime || "-"}</div>
              </div>
            );
          },
        },
        {
          label: "订单状态",
          width: 170,
          prop: "orderStatus",
          render: (h, row) => {
            return (
              <div>
                <el-tag
                  v-show={row.orderStatus == "13"}
                  size="mini"
                  type={tagType[row.orderStatus] || "info"}
                >
                  {row.orderStatusName}
                </el-tag>
              </div>
            );
          },
        },
      ];

      // 操作列配置
      const actionName = {
        13: "出库",
        12: "发车",
      };
      const actionColumn = {
        label: "操作",
        fixed: "right",
        width: 135,
        render: (h, row) => {
          const buttons = [];

          // 非全部状态显示配送按钮
          if (actionName[row.orderStatus]) {
            buttons.push(
              <el-button
                type="text"
                size="middle"
                class="txt-highlight"
                onClick={() => this.handleDelivery(row)}
              >
                {actionName[row.orderStatus]}
              </el-button>
            );
          }

          // 所有状态都显示详情和打印按钮
          buttons.push(
            <el-button type="text" size="middle" class="txt-highlight">
              详情
            </el-button>,
            <el-button type="text" size="middle" class="txt-highlight">
              打印
            </el-button>
          );

          return <div>{buttons}</div>;
        },
      };

      return [...baseColumns, actionColumn];
    },
  },
  methods: {
    handleResize() {
      this.height = window.innerHeight - 320;
    },
    callServer() {
      return searchPSOrders;
    },
    beforeShow(data) {
      console.log("beforeShow", data);
      return data;
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
        if (this.$refs.saveItemForm.status) {
          edit(data)
            .then(() => {
              this.$refs.saveDialog.close();
              this.toast("修改成功", "success");
              this.fecthData();
            })
            .catch(() => {
              this.$refs.saveDialog.posting = false;
            });
        } else {
          add(data)
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
    exportList(columns, filename) {
      exportList({ ...this.tableParams, excelDtos: columns }, filename);
    },
    // 处理配送操作
    handleDelivery(row) {
      this.alert(`确定要开始配送订单：${row.orderNumber} 吗？`, "确认配送", {
        type: "warning",
        request: () => {
          return updatePSOrderStatus({ orderNo: row.orderNumber });
        },
        success: () => {
          this.toast("配送状态更新成功", "success");
          this.fecthData();
        },
      });
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
.ps-info-m {
}
.ps-info {
  margin-top: 2px;
}
.fg {
  color: #aaa;
}
</style>
