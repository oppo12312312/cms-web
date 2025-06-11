<template>
  <div>
    <div v-if="mode == 1" class="tableFiltersWrap">
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
    <v-page v-if="mode == 1">
      <el-card shadow="never" class="card-header-tabs">
        <div slot="header" class="clearfix">
          <div class="txt-right">
            <v-btn
              type="add"
              @handleClick="
                mode = 2;
                scheduleId = '';
              "
              txt="新增排线"
            ></v-btn>
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
          >
            <template #psdd>adsada</template>
          </basic-table>
        </div>
      </el-card>
    </v-page>
    <new-schedule
      @back="
        mode = 1;
        fecthData();
      "
      v-if="mode == 2"
      @goDetail="openSaveDialog"
    ></new-schedule>
    <schedule
      @back="
        mode = 1;
        fecthData();
      "
      @gopx="mode = 2"
      v-if="mode == 3"
      :id="scheduleId"
    ></schedule>
  </div>
</template>

<script>
import { pageList, cancelDispatch, shipment, depart } from "#/api/dispatchSchedules";
import basicTable from "_c/tables";
import order from "./order";
import newSchedule from "./newSchedule";
import schedule from "./schedule";

export default {
  components: {
    basicTable,
    order,
    newSchedule,
    schedule,
  },
  data() {
    return {
      tableParams: {},
      multipleSelection: [],
      currentItem: {},
      height: window.innerHeight - 320,
      mode: 1,
      scheduleId: "",
    };
  },
  created() {
    window.addEventListener("resize", this.handleResize);
  },
  destroyed() {
    window.removeEventListener("resize", this.handleResize);
  },
  computed: {
    tableParamsCopy() {
      const params = {};
      if (this.tableParams.driverName) {
        params.driverName = this.tableParams.driverName;
      }
      return params;
    },
    fields() {
      return [
        {
          label: "",
          prop: "driverName",
          type: "text",
          span: 4,
          placeholder: "请输入司机姓名",
        },
      ];
    },
    columns() {
      const sy = window.innerWidth > 1600 ? (window.innerWidth - 1600) / 6 : 0;
      return [
        {
          label: "线路",
          prop: "",
          width: 180 + sy,
          render: (h, row) => {
            return (
              <div>
                <div class="ps-info-m">{row.scheduleId}</div>
                <div class="ps-info">仓库：{row.beginStore || "-"}</div>
                <div class="ps-info">打印配送单</div>
              </div>
            );
          },
        },
        {
          label: "配送订单",
          width: 240 + sy,
          render: (h, row) => {
            return (
              <div>
                <order data={row.list}></order>
              </div>
            );
          },
        },
        {
          label: "司机",
          prop: "createTime",
          width: 200 + sy,
          render: (h, row) => {
            return (
              <div>
                <div class="ps-info-m">{row.driverTypeName || "-"}配送</div>
                <div class="ps-info-m">
                  {row.driverName || "-"} <span class="fg">|</span> {row.plateNo || "-"}
                </div>
                <div class="ps-info">{row.phone || "-"}</div>
              </div>
            );
          },
        },
        {
          label: "配送信息",
          prop: "createTime",
          width: 200 + sy,
          render: (h, row) => {
            return (
              <div>
                <div class="ps-info-m">配送订单数：{row.totalOrders || "-"}</div>
                <div class="ps-info">总配送总金额：{row.totalDeliveryCost || "-"}</div>
              </div>
            );
          },
        },
        {
          label: "阶段",
          prop: "statusName",
          width: 80 + sy,
          // render: (h, row) => {
          //   return (
          //     <div>
          //       <el-tag v-show={row.status == 7} size="mini" type="warning">待配送</el-tag>
          //       <el-tag v-show={row.status == 11} size="mini" type="danger">待签收</el-tag>
          //       <el-tag v-show={row.status == 4} size="mini">待收货</el-tag>
          //       <el-tag v-show={row.status == 6} size="mini" type="success">已完成</el-tag>
          //     </div>
          //   );
          // },
        },
        {
          label: "时间",
          prop: "createTime",
          width: 200 + sy,
          render: (h, row) => {
            return (
              <div>
                <div class="ps-info-m">
                  <span style="color: orange">接</span>：{row.receiveTime || "-"}
                </div>
                <div class="ps-info">
                  <span style="color: purple">发</span>：{row.sendTime || "-"}
                </div>
                <div class="ps-info">
                  <span style="color: blue">达</span>：{row.deliveryTime || "-"}
                </div>
                <div class="ps-info">
                  <span style="color: orangeRed">签</span>：{row.signedTime || "-"}
                </div>
                <div class="ps-info">
                  <span style="color: green">完</span>：{row.completedTime || "-"}
                </div>
              </div>
            );
          },
        },
        {
          label: "操作",
          fixed: "right",
          width: 105,
          render: (h, row) => {
            return (
              <div class="btn-ccc">
                <el-button
                  type="text"
                  onClick={() => this.shipment(row)}
                  size="middle"
                  class="txt-highlight"
                >
                  出库
                </el-button>
                <el-button
                  type="text"
                  onClick={() => this.depart(row)}
                  size="middle"
                  class="txt-highlight"
                >
                  发车
                </el-button>
                <el-button
                  type="text"
                  onClick={() => this.openSaveDialog(row)}
                  size="middle"
                  class="txt-highlight"
                >
                  查看
                </el-button>
                <el-button
                  type="text"
                  onClick={() => this.del(row)}
                  size="middle"
                  class="txt-highlight"
                  disabled={row.statusName !== "待配送"}
                >
                  撤销
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
      this.$nextTick(() => {
        this.$refs.basicTable.fecthData();
      });
    },
    reloadData() {
      this.tableParams = {};
      this.$refs.basicTable.reload();
    },
    openSaveDialog(item) {
      this.scheduleId = item.scheduleId;
      this.mode = 3;
    },
    selectionChange(val) {
      this.multipleSelection = val;
    },
    del(item) {
      this.alert("确定撤销路线：<br />" + item.scheduleId, "撤销路线", {
        type: "warning",
        request: () => {
          return cancelDispatch({
            scheduleId: item.scheduleId,
          });
        },
        success: () => {
          this.toast("撤销成功", "success");
          this.fecthData();
        },
      });
    },
    shipment(item) {
      if (!item && !this.multipleSelection.length) {
        return this.toast("请选择至少一条数据", "warning");
      }
      this.alert(
        "确定出库：<br />" +
          (item
            ? item.scheduleId
            : this.multipleSelection.map((i) => i.scheduleId).join("")),
        "出库",
        {
          type: "warning",
          request: () => {
            return shipment({
              scheduleId: item
                ? item.scheduleId
                : this.multipleSelection.map((i) => i.scheduleId).join(","),
            });
          },
          success: () => {
            this.toast("出库成功", "success");
            this.fecthData();
          },
        }
      );
    },
    depart(item) {
      if (!item && !this.multipleSelection.length) {
        return this.toast("请选择至少一条数据", "warning");
      }
      this.alert(
        "确定发车：<br />" +
          (item
            ? item.scheduleId
            : this.multipleSelection.map((i) => i.scheduleId).join("")),
        "发车",
        {
          type: "warning",
          request: () => {
            return depart({
              scheduleId: item
                ? item.scheduleId
                : this.multipleSelection.map((i) => i.scheduleId).join(","),
            });
          },
          success: () => {
            this.toast("发车成功", "success");
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
.ps-info-m {
}
.ps-info {
  margin-top: 2px;
}
.fg {
  color: #aaa;
}
.btn-ccc {
  display: flex;
  flex-wrap: wrap;
  .el-button {
    margin-left: 0 !important;
    margin-right: 8px;
  }
}
</style>
