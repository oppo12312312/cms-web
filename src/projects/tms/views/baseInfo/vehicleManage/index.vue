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
        width="680px"
        @handleClose="saveItem"
        :title="isEmptyObject(currentItem) ? '新增车辆' : '修改车辆'"
      >
        <save-form
          ref="saveItemForm"
          :patch-data="currentItem"
          :modelTypeThree="modelTypeThree"
          :modelTypeOne="modelTypeOne"
          :modelType="modelType"
          :vehicleStatus="vehicleStatus"
          :isAdd="isEmptyObject(currentItem)"
        ></save-form>
      </v-dialog>
      <v-dialog
        ref="saveDialog2"
        width="580px"
        @handleClose="saveItem2"
        title="设置费用"
      >
        <saveFeeForm
          ref="saveItemForm2"
          :patch-data="currentItem"
          :isAdd="isEmptyObject(currentItem)"
        ></saveFeeForm>
      </v-dialog>
    </v-page>
  </div>
</template>

<script>
import {
  pageList,
  add,
  edit,
  remove,
  view,
  saveFee,
  viewFee,
} from "#/api/tmsVehicle";
import basicTable from "_c/tables";
import saveForm from "./saveForm";
import saveFeeForm from "./saveFeeForm";
import files from "_c/forms/components/files";
import moment from "moment";
import { getCommonOptions } from "@/api/common";

export default {
  components: {
    basicTable,
    saveForm,
    files,
    saveFeeForm,
  },
  data() {
    return {
      tableParams: {},
      multipleSelection: [],
      currentItem: {},
      height: window.innerHeight - 320,
      modelType: [],
      modelTypeOne: [],
      modelTypeThree: [],
      vehicleStatus: [],
    };
  },
  created() {
    window.addEventListener("resize", this.handleResize);
    getCommonOptions("model_type").then((res) => {
      this.modelType = res.data.map((d) => ({
        label: d.dmname,
        value: d.dmcode,
      }));
    });
    getCommonOptions("model_type_one").then((res) => {
      this.modelTypeOne = res.data.map((d) => ({
        label: d.dmname,
        value: d.dmcode,
      }));
    });
    getCommonOptions("model_type_three").then((res) => {
      this.modelTypeThree = res.data.map((d) => ({
        label: d.dmname,
        value: d.dmcode,
      }));
    });
    getCommonOptions("vehicle_status").then((res) => {
      this.vehicleStatus = res.data.map((d) => ({
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
      if (this.tableParams.plateNo) {
        params.plateNo = this.tableParams.plateNo;
      }
      if (this.tableParams.driverName) {
        params.driverName = this.tableParams.driverName;
      }
      if (this.tableParams.phone) {
        params.phone = this.tableParams.phone;
      }
      return params;
    },
    fields() {
      return [
        {
          label: "",
          prop: "plateNo",
          type: "text",
          span: 4,
          placeholder: "请输入车牌号",
        },
        {
          label: "",
          prop: "driverName",
          type: "text",
          span: 4,
          placeholder: "请输入司机姓名",
        },
        {
          label: "",
          prop: "phone",
          type: "text",
          span: 4,
          placeholder: "请输入手机号码",
        },
      ];
    },
    columns() {
      return [
        // {
        //   label: '车辆图片',
        //   prop: 'photoId',
        //   render: (h, row) => {
        //     return (
        //       <div>
        //         <files value={row.photoId} key={row.photoId} disabled fileType="image"></files>
        //       </div>
        //     )
        //   }
        // },
        {
          label: "车牌号",
          prop: "plateNo",
          width: 120,
        },
        {
          label: "车辆类型",
          width: 180,
          render: (h, row) => {
            const dt1 =
              (this.modelTypeOne.find((d) => row.modelTypeOne == d.value) || {})
                .label || row.modelTypeOne;
            const dt2 =
              (this.modelType.find((d) => row.modelType == d.value) || {})
                .label || row.modelType;
            const dt3 =
              (
                this.modelTypeThree.find(
                  (d) => row.modelTypeThree == d.value
                ) || {}
              ).label || row.modelTypeThree;
            return (
              <div>
                {dt1}/{dt2}/{dt3}
              </div>
            );
          },
        },
        {
          label: "可载重量（kg）",
          prop: "payload",
          width: 140,
        },
        {
          label: "司机",
          prop: "driverIds",
          render: (h, row) => {
            const driverName =
              row.drivers && row.drivers.length
                ? row.drivers.map((d) => d.name).toString()
                : "";
            return <div>{driverName}</div>;
          },
        },
        {
          label: "状态",
          prop: "vehicleStatus",
          width: 120,
          render: (h, row) => {
            const dt =
              (
                this.vehicleStatus.find((d) => row.vehicleStatus == d.value) ||
                {}
              ).label || row.vehicleStatus;
            return <div>{dt}</div>;
          },
        },
        {
          label: "可用时间段",
          prop: "createTime",
          width: 170,
          render: (h, row) => {
            return (
              <div>
                {row.availablePeriodBegin}~{row.availablePeriodEnd}
              </div>
            );
          },
        },
        {
          label: "操作",
          fixed: "right",
          width: 60,
          render: (h, row) => {
            return (
              <el-dropdown>
                <el-button type="text" size="middle" class="txt-highlight">
                  更多
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>
                    <el-button
                      type="text"
                      onClick={() => this.openSaveDialog(row)}
                      size="middle"
                      class="txt-highlight"
                    >
                      编辑
                    </el-button>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-button
                      type="text"
                      onClick={() => this.del(row)}
                      size="middle"
                      class="txt-highlight"
                    >
                      删除
                    </el-button>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-button
                      type="text"
                      onClick={() => this.setFee(row)}
                      size="middle"
                      class="txt-highlight"
                    >
                      费用设置
                    </el-button>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
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
      this.currentItem = Object.assign({}, item || {});
      this.$refs.saveDialog.dialogVisible = true;
    },
    setFee(item) {
      viewFee({ plateNo: item.plateNo }).then((res) => {
        this.currentItem = Object.assign(
          { plateNo: item.plateNo },
          res.data || {}
        );
        this.$refs.saveDialog2.dialogVisible = true;
      });
    },
    saveItem2() {
      this.$refs.saveItemForm2.validate((data) => {
        console.log(data);
        this.$refs.saveDialog2.posting = true;
        saveFee(data)
          .then(() => {
            this.$refs.saveDialog2.close();
            this.toast("设置成功", "success");
          })
          .catch(() => {
            this.$refs.saveDialog2.posting = false;
          });
      });
    },
    saveItem() {
      this.$refs.saveItemForm.validate((data) => {
        const params = Object.assign({}, data);
        if (params.availablePeriod && params.availablePeriod.length) {
          params.availablePeriodBegin = moment(
            params.availablePeriod[0]
          ).format("HH:mm");
          params.availablePeriodEnd = moment(params.availablePeriod[1]).format(
            "HH:mm"
          );
        }
        this.$refs.saveDialog.posting = true;
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
        "确定删除车辆：<br />" +
          (item
            ? item.plateNo
            : this.multipleSelection.map((i) => i.plateNo).join("")),
        "删除车辆",
        {
          type: "warning",
          request: () => {
            return remove({
              vehicleIds: item
                ? item.vehicleId
                : this.multipleSelection.map((i) => i.vehicleId).join(","),
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
