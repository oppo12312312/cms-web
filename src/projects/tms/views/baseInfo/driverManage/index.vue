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
        width="600px"
        @handleClose="saveItem"
        :title="isEmptyObject(currentItem) ? '新增司机' : '修改司机'"
      >
        <save-form
          ref="saveItemForm"
          :patch-data="currentItem"
          :driverType="driverType"
          :idType="idType"
          :isAdd="isEmptyObject(currentItem)"
        ></save-form>
      </v-dialog>
    </v-page>
  </div>
</template>

<script>
import { pageList, add, edit, remove, open, close } from "#/api/tmsDriver";
import basicTable from "_c/tables";
import saveForm from "./saveForm";
import { codeTreeList } from "@/api/code";
import { getCommonOptions } from "@/api/common";

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
      driverType: [],
      idType: [],
    };
  },
  created() {
    codeTreeList({ parentid: "GY" });
    getCommonOptions("driver_type").then((res) => {
      this.driverType = res.data.map((d) => ({
        label: d.dmname,
        value: d.dmcode,
      }));
    });
    getCommonOptions("id_type").then((res) => {
      this.idType = res.data.map((d) => ({ label: d.dmname, value: d.dmcode }));
    });
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
      if (this.tableParams.phone) {
        params.phone = this.tableParams.phone;
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
        {
          label: "司机姓名",
          prop: "driverName",
        },
        {
          label: "手机号码",
          prop: "phone",
        },
        {
          label: "司机类型",
          prop: "driverType",
          width: 120,
          render: (h, row) => {
            const dt =
              (this.driverType.find((d) => row.driverType == d.value) || {})
                .label || row.driverType;
            return <div>{dt}</div>;
          },
        },
        {
          label: "证件类型",
          prop: "idType",
          width: 120,
          render: (h, row) => {
            const dt =
              (this.idType.find((d) => row.idType == d.value) || {}).label ||
              row.idType;
            return <div>{dt}</div>;
          },
        },
        {
          label: "证件号",
          prop: "idNo",
        },
        {
          label: "账号状态",
          prop: "createTime",
          width: 120,
          render: (h, row) => {
            return (
              <div>
                <el-switch
                  value={row.status}
                  active-value={1}
                  inactive-value={0}
                  on-change={(e) => {
                    this.changeStatus(row);
                  }}
                ></el-switch>
              </div>
            );
          },
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
      this.currentItem = Object.assign({}, item || {});
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
    changeStatus(row) {
      if (row.status == 0) {
        open({ driverId: row.driverId }).then(() => {
          // this.$refs.basicTable.fecthData();
          row.status = 1;
          this.toast("更改状态成功", "success");
        });
      } else {
        close({ driverId: row.driverId }).then(() => {
          // this.$refs.basicTable.fecthData();
          row.status = 0;
          this.toast("更改状态成功", "success");
        });
      }
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
