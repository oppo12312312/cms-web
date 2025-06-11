<template>
  <div>
    <el-row class="txt-right">
      <el-col>
        <v-form :fields="fields" :fieldsData="tableParams">
          <el-col :span="4" class="txt-left">
            <el-button type="primary" @click="fecthData(true)">查询</el-button>
            <el-button type="default" @click="fecthData(false, true)"
              >清空</el-button
            >
          </el-col>
        </v-form>
      </el-col>
    </el-row>
    <el-table
      v-loading="loading"
      ref="multipleTable"
      :height="380"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 99%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column
        prop="orderNumber"
        label="订单号"
        width="220"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="merchantName"
        label="商户名称"
        width="120"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="userNickname"
        label="用户昵称"
        width="120"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="creationTime"
        label="下单时间"
        width="165"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="deliveryAddress"
        label="地址"
        show-overflow-tooltip
      ></el-table-column>
    </el-table>
    <el-pagination
      style="margin-top: 8px"
      :hide-on-single-page="total < 2"
      background
      :current-page="pagination.pageIndex"
      layout="prev,pager,next,jumper,sizes"
      :total="total"
      row-key="orderNumber"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    ></el-pagination>
  </div>
</template>
<script>
import { searchDfhOrders } from "#/api/dispatchSchedules";

export default {
  components: {},
  props: {
    patchData: Object,
  },
  data() {
    return {
      tableParams: {},
      tableData: [],
      multipleSelection: [],
      selectedOrder: [],
      pagination: {
        pageIndex: 1,
        pageSize: 10,
      },
      total: 0,
      loading: false,
      th: window.innerHeight - 320,
    };
  },
  created() {
    this.fecthData();
  },
  computed: {
    fields() {
      return [
        {
          label: "",
          prop: "merName",
          type: "text",
          span: 4,
          placeholder: "请输入供应商",
        },
        {
          label: "",
          prop: "realName",
          type: "text",
          span: 4,
          placeholder: "请输入顾客姓名",
        },
        {
          label: "",
          prop: "userAddress",
          type: "text",
          span: 4,
          placeholder: "请输入地址",
        },
        {
          label: "",
          prop: "date",
          type: "daterange",
          span: 6,
          formate: "yyyy-MM-dd",
          sPlaceholder: "开始时间",
          ePlaceholder: "结束时间",
        },
      ];
    },
  },
  methods: {
    fecthData(isInit = false, clear = false) {
      this.$refs.multipleTable?.clearSelection();
      const params = {};
      if (isInit || clear) {
        this.pagination.pageIndex = 1;
      }
      if (clear) {
        this.tableParams = {};
      }
      if (this.tableParams.merName) {
        params.merName = this.tableParams.merName;
      }
      if (this.tableParams.realName) {
        params.realName = this.tableParams.realName;
      }
      if (this.tableParams.deliveryAddress) {
        params.deliveryAddress = this.tableParams.deliveryAddress;
      }
      if (
        this.tableParams.date &&
        this.tableParams.date.length &&
        this.tableParams.date.length == 2
      ) {
        params.beginTimeStr = this.tableParams.date[0];
        params.endTimeStr = this.tableParams.date[1];
      }
      searchDfhOrders(Object.assign({}, this.pagination, params)).then(
        (res) => {
          this.tableData = res.data;
          this.total = res.flag;
          this.$nextTick(() => {
            this.tableData
              .filter(
                (d) =>
                  this.multipleSelection.findIndex(
                    (s) => s.orderNumber == d.orderNumber
                  ) > -1
              )
              .forEach((row) => {
                this.$refs.multipleTable.toggleRowSelection(row);
              });
            this.$forceUpdate();
            this.isSwitch = false;
            setTimeout(() => {
              this.loading = false;
            });
          });
        }
      );
    },
    handleCurrentChange(val) {
      this.loading = true;
      this.pagination.pageIndex = val;
      this.fecthData();
    },
    handleSizeChange(val) {
      this.loading = true;
      this.pagination.pageSize = val;
      this.pagination.pageIndex = 1;
      this.fecthData();
    },
    handleSelectionChange(val) {
      if (this.loading) {
        return;
      }
      this.tableData
        .filter(
          (d) => val.findIndex((v) => v.orderNumber == d.orderNumber) > -1
        )
        .forEach((o) => {
          if (
            this.multipleSelection.findIndex(
              (s) => s.orderNumber == o.orderNumber
            ) == -1
          ) {
            this.multipleSelection.push(o);
          }
        });
      this.multipleSelection = this.multipleSelection.filter(
        (s) =>
          this.tableData
            .filter(
              (d) => val.findIndex((v) => v.orderNumber == d.orderNumber) == -1
            )
            .findIndex((d) => d.orderNumber == s.orderNumber) == -1
      );
    },
  },
};
</script>
<style lang="scss"></style>
