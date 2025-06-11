<template>
  <el-row :gutter="20" class="planmany-wrap">
    <el-col :span="12">
      <div class="tableFiltersWrap">
        <el-row class="txt-right">
          <el-col>
            <v-form :fields="fields" :fieldsData="tableParams">
              <el-col :span="10" class="txt-left">
                <el-button type="primary" @click="fecthData">查询</el-button>
                <el-button type="default" @click="reloadData">清空</el-button>
              </el-col>
            </v-form>
          </el-col>
        </el-row>
      </div>
      <v-page>
        <el-card shadow="never">
          <div slot="header" class="clearfix">
            <span> 选择要分配的寝室范围 </span>
            <div style="position: absolute; top: 10px; right: 10px">
              <v-btn
                type="add"
                txt="批量添加"
                @handleClick="roomSelect"
              ></v-btn>
            </div>
          </div>
          <div class="text item">
            <basic-table
              height="500"
              ref="basicTable"
              :columns="columns"
              :call-server="callServer"
              @selectionChange="selectionChange"
              v-model="tableParams"
            ></basic-table>
          </div>
        </el-card>
      </v-page>
      <v-page>
        <el-card class="fn-mt15" shadow="never">
          <div slot="header" class="clearfix">
            <span>已选择房间</span>
            <span
              v-show="roomSelected.length"
              class="fn-fr txt-grey"
              style="font-size: 12px"
            >
              您已选择{{ roomSelected.length }}个寝室，共有{{
                roomSelectedCount.kc
              }}张空床位，其中男生{{ roomSelectedCount.nan }}张，女生{{
                roomSelectedCount.nv
              }}张
            </span>
          </div>
          <div class="text item">
            <basic-table
              height="500"
              ref="basicTables"
              :columns="columnss"
              :props-data="roomSelected"
              :muti="false"
            ></basic-table>
          </div>
        </el-card>
      </v-page>
    </el-col>
    <el-col :span="12">
      <div class="tableFiltersWrap">
        <el-row class="txt-right">
          <el-col>
            <v-form :fields="fields1" :fieldsData="tableParams">
              <el-col :span="10" class="txt-left">
                <el-button type="primary" @click="fecthData1">查询</el-button>
                <el-button type="default" @click="reloadData1">清空</el-button>
              </el-col>
            </v-form>
          </el-col>
        </el-row>
      </div>
      <v-page>
        <el-card shadow="never">
          <div slot="header" class="clearfix">
            <span>选择要分配的学生范围</span>
            <div style="position: absolute; top: 10px; right: 10px">
              <v-btn type="add" txt="批量添加" @handleClick="stuSelect"></v-btn>
            </div>
          </div>
          <div class="text item">
            <basic-table
              height="500"
              ref="basicTable1"
              :columns="columns1"
              :call-server="callServer1"
              @selectionChange="selectionChange1"
              v-model="tableParams"
            ></basic-table>
          </div>
        </el-card>
      </v-page>
      <v-page>
        <el-card class="fn-mt15" shadow="never">
          <div slot="header" class="clearfix">
            <span>已选择学生</span>
            <span
              v-show="stuSelected.length"
              class="fn-fr txt-grey"
              style="font-size: 12px"
            >
              您已选择{{ stuSelected.length }}个学生，其中男生{{
                stuSelectedCount.nan
              }}名，女生{{ stuSelectedCount.nv }}名
            </span>
          </div>
          <div class="text item">
            <basic-table
              height="500"
              ref="basicTable1s"
              :columns="columns1s"
              :props-data="stuSelected"
              :muti="false"
            ></basic-table>
          </div>
        </el-card>
      </v-page>
    </el-col>
    <el-col style="text-align: center; margin-top: 15px">
      <el-button type="primary" :loading="posting" @click="onSubmit"
        >批量分配</el-button
      >
      <el-button @click="clear">清空</el-button>
    </el-col>
  </el-row>
</template>

<script>
import {
  listRooms,
  listBeds,
  exportRooms,
} from "@/projects/hbmu-suguan/api/sgStudentRoom";
import { mapGetters, mapActions } from "vuex";
import basicTable from "_c/tables";
import { listAllNS } from "@/projects/hbmu-suguan/api/studentInfo";
import { assignBatch } from "@/projects/hbmu-suguan/api/sgRoomassign";
import minxin from "../minxins/minxin";
import { tree } from "@/projects/hbmu-suguan/api/sgApt";

export default {
  components: {
    basicTable,
  },
  mixins: [minxin],
  created() {
    this.getOpts(["xbOpts", "pyccOpts", "kslbOpts"]);
  },
  data() {
    return {
      tableParams: {},
      showFields: [],
      currentItem: {},
      roomSelected: [],
      stuSelected: [],
      multipleSelection: [],
      multipleSelection1: [],
      posting: false,
    };
  },
  computed: {
    ...mapGetters(["xbOpts"]),
    columns: function () {
      const cols = [
        {
          label: "宿舍",
          prop: "fullname",
          width: "120px",
        },
        {
          label: "性别属性",
          prop: "roomSex",
        },
        {
          label: "床位数量",
          prop: "bedTotal",
          empty: "0",
        },
        {
          label: "已住人数",
          prop: "checkin",
          empty: "0",
        },
        {
          label: "空床数",
          prop: "emptyNum",
          empty: "0",
        },
        {
          label: "操作",
          fixed: "right",
          render: (h, row) => {
            return (
              <div>
                <el-button
                  type="text"
                  onClick={() => this.roomSelect(row)}
                  size="middle"
                  class="txt-highlight"
                >
                  选择
                </el-button>
              </div>
            );
          },
        },
      ];
      if (this.showFields.length) {
        for (let i = 0; i < cols.length; i++) {
          if (cols[i].prop || cols[i].field) {
            const field = cols[i].prop || cols[i].field;
            cols[i].isHide = this.showFields.indexOf(field) > -1 ? false : true;
          }
        }
      }
      return cols;
    },
    columnss: function () {
      const cols = this.copy(this.columns);
      cols.pop();
      cols.push({
        label: "操作",
        fixed: "right",
        render: (h, row) => {
          return (
            <div>
              <el-button
                type="text"
                onClick={() => this.delRoomSelect(row)}
                size="middle"
                class="txt-highlight"
              >
                删除
              </el-button>
            </div>
          );
        },
      });
      return cols;
    },
    columns1: function () {
      const cols = [
        {
          label: "学号",
          prop: "xh",
        },
        {
          label: "姓名",
          prop: "xm",
        },
        {
          label: "性别",
          prop: "xb",
        },
        {
          label: this.lang_college,
          prop: "xy",
        },
        {
          label: "年级",
          prop: "nj",
        },
        {
          label: "专业",
          prop: "zy",
        },
        {
          label: "班级",
          prop: "bj",
        },
        {
          label: "培养层次",
          prop: "pycc",
        },
        {
          label: "学生类别",
          prop: "kslb",
        },
        {
          label: "操作",
          fixed: "right",
          render: (h, row) => {
            return (
              <div>
                <el-button
                  type="text"
                  onClick={() => this.stuSelect(row)}
                  size="middle"
                  class="txt-highlight"
                >
                  选择
                </el-button>
              </div>
            );
          },
        },
      ];
      if (this.showFields.length) {
        for (let i = 0; i < cols.length; i++) {
          if (cols[i].prop || cols[i].field) {
            const field = cols[i].prop || cols[i].field;
            cols[i].isHide = this.showFields.indexOf(field) > -1 ? false : true;
          }
        }
      }
      return cols;
    },
    columns1s: function () {
      const cols = this.copy(this.columns1);
      cols.pop();
      cols.push({
        label: "操作",
        fixed: "right",
        render: (h, row) => {
          return (
            <div>
              <el-button
                type="text"
                onClick={() => this.delStuSelect(row)}
                size="middle"
                class="txt-highlight"
              >
                删除
              </el-button>
            </div>
          );
        },
      });

      return cols;
    },
    fields() {
      const me = this;

      return [
        {
          label: "",
          prop: "roomSex",
          // span: 12,
          type: "select",
          placeholder: "请选择宿舍性别",
          options: this.xbOpts,
        },
        {
          label: "",
          prop: "fullStatus",
          // span: 12,
          type: "select",
          placeholder: "是否满员",
          options: this.fullStatusOpts,
        },
        {
          label: "",
          prop: "aptId",
          type: "tree",
          placeholder: "请选择调整房间",
          span: 12,
          nodeKey: "aptId",
          expandedKeys: ["node0"],
          defaultProps: {
            label: "aptName",
            value: "aptId",
            children: "children",
            isLeaf: "isLeaf",
          },
          loadNode: function (node, resolve) {
            // 一级节点处理
            if (node.level === 0) {
              tree({ aptId: "", aptLevel: "" }).then((leafs) => {
                const data = leafs.data;
                return resolve([
                  {
                    aptName: data[0].aptName,
                    aptId: "node0",
                    aptLevel: data[0].aptLevel,
                    isLeaf: false,
                  },
                ]);
              });
            }
            if (node.level >= 1) resolve([]);
            if (node.data) {
              tree({
                aptId: node.key == "node0" ? "" : node.key,
                aptLevel: node.data.aptLevel,
              }).then((leafs) => {
                const data = leafs.data;
                const arr = [];
                for (let i = 0; i < data.length; i++) {
                  arr.push({
                    aptName: data[i].aptName,
                    aptId: data[i].aptId,
                    aptLevel: data[i].aptLevel,
                    isLeaf: data[i].aptLevel == "room" ? true : false,
                  });
                }
                return resolve(arr);
              });
            }
          },
          handleClick: function (node) {
            me.tableParams.aptLevel = node.aptLevel;
          },
        },
      ];
    },
    fields1() {
      return [
        {
          label: "",
          prop: "xh",
          span: 8,
          type: "text",
          placeholder: "请输入学号",
        },
        {
          label: "",
          prop: "xm",
          span: 8,
          type: "text",
          placeholder: "请输入姓名",
        },
        {
          label: "",
          prop: "kslb",
          span: 8,
          type: "select",
          placeholder: "选择考生类别",
          options: this.kslbOpts,
        },
        {
          label: "",
          span: 8,
          type: "xyzybj",
          layout: ["xy"],
        },
        {
          label: "",
          placeholder: "请选择年级",
          prop: "nj",
          span: 8,
          type: "date",
          dType: "year",
          format: "yyyy-MM-dd",
          formate: "yyyy-MM-dd",
        },
        {
          label: "",
          prop: "pycc",
          span: 8,
          type: "select",
          placeholder: "选择培养层次",
          options: this.pyccOpts,
        },
        {
          label: "",
          prop: "xb",
          span: 8,
          type: "select",
          placeholder: "请选择性别",
          options: this.xbOpts,
        },
      ];
    },
    roomIds() {
      const roomIds = [];
      if (this.roomSelected.length) {
        for (let i = 0; i < this.roomSelected.length; i++) {
          roomIds.push(this.roomSelected[i].roomId);
        }
      }

      return roomIds;
    },
    stuIds() {
      const stuIds = [];
      if (this.stuSelected.length) {
        for (let i = 0; i < this.stuSelected.length; i++) {
          stuIds.push(this.stuSelected[i].infoId);
        }
      }

      return stuIds;
    },
    roomSelectedCount() {
      const count = {
        kc: 0,
        nan: 0,
        nv: 0,
      };
      for (let i = 0; i < this.roomSelected.length; i++) {
        count.kc += this.roomSelected[i].emptyNum;
        if (this.roomSelected[i].roomSex == "男") {
          count.nan += this.roomSelected[i].emptyNum;
        }
        if (this.roomSelected[i].roomSex == "女") {
          count.nv += this.roomSelected[i].emptyNum;
        }
      }
      return count;
    },
    stuSelectedCount() {
      const count = {
        nan: 0,
        nv: 0,
      };
      for (let i = 0; i < this.stuSelected.length; i++) {
        if (this.stuSelected[i].xb == "男") {
          count.nan++;
        }
        if (this.stuSelected[i].xb == "女") {
          count.nv++;
        }
      }
      return count;
    },
  },
  methods: {
    ...mapActions(["getOpts"]),
    exportsExecutes(fields, filename) {
      return exportStudents(
        Object.assign(this.tableParams, {
          excelDtos: fields,
        }),
        filename
      );
    },
    colsChange(showFields) {
      this.showFields = showFields;
    },
    callServer(pagination) {
      return listRooms;
    },
    callServer1(pagination) {
      return listAllNS;
    },
    fecthData() {
      this.$refs.basicTable.fecthData();
    },
    fecthData1() {
      this.$refs.basicTable.fecthData();
    },
    reloadData() {
      this.tableParams = {};
      this.$refs.basicTable.reload();
    },
    reloadData1() {
      this.tableParams = {};
      this.$refs.basicTable1.reload();
    },
    selectionChange(val) {
      this.multipleSelection = val;
    },
    selectionChange1(val) {
      this.multipleSelection1 = val;
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
          userAdd(data)
            .then(() => {
              this.$refs.saveDialog.close();
              me.toast("修改成功", "success");
              me.fecthData();
            })
            .catch((err) => {
              this.$refs.saveDialog.posting = false;
            });
        } else {
          userAdd(data)
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
        dels.push(item.truename);
        ids.push(item.userid);
      } else {
        if (this.multipleSelection.length) {
          for (const ml of this.multipleSelection) {
            dels.push(ml.truename);
            ids.push(ml.userid);
          }
        }
      }
      this.alert("删除用户：" + dels.join(",") + "。", "确认要进行删除吗？", {
        type: "warning",
        request() {
          return userDelete(ids.join(","));
        },
        success() {
          me.toast("删除成功", "success");
          me.fecthData();
        },
      });
    },
    roomSelect(item) {
      if (item) {
        if (this.roomIds.indexOf(item.roomId) == -1) {
          this.roomSelected.push(item);
        }
      } else {
        if (this.multipleSelection.length) {
          for (let i = 0; i < this.multipleSelection.length; i++) {
            if (this.roomIds.indexOf(this.multipleSelection[i].roomId) == -1) {
              this.roomSelected.push(this.multipleSelection[i]);
            }
          }
        } else {
          this.toast("请至少勾选一项", "warning");
        }
      }
    },
    stuSelect(item) {
      if (item) {
        if (this.stuIds.indexOf(item.infoId) == -1) {
          this.stuSelected.push(item);
        }
      } else {
        if (this.multipleSelection1.length) {
          for (let i = 0; i < this.multipleSelection1.length; i++) {
            if (this.stuIds.indexOf(this.multipleSelection1[i].infoId) == -1) {
              this.stuSelected.push(this.multipleSelection1[i]);
            }
          }
        } else {
          this.toast("请至少勾选一项", "warning");
        }
      }
    },
    delStuSelect(row) {
      let index = 0;
      for (let i = 0; i < this.stuIds.length; i++) {
        if (row.infoId == this.stuIds[i]) {
          index = i;
        }
      }
      this.stuIds.splice(index, 1);
      this.stuSelected.splice(index, 1);
    },
    delRoomSelect(row) {
      let index = 0;
      for (let i = 0; i < this.roomIds.length; i++) {
        if (row.roomId == this.roomIds[i]) {
          index = i;
        }
      }
      this.roomIds.splice(index, 1);
      this.roomSelected.splice(index, 1);
    },
    clear() {
      this.roomSelected = [];
      this.stuSelected = [];
    },
    onSubmit() {
      const me = this;
      const roomIds = [];
      const infoIds = [];
      for (let i = 0; i < this.roomSelected.length; i++) {
        roomIds.push(this.roomSelected[i].roomId);
      }
      for (let i = 0; i < this.stuSelected.length; i++) {
        infoIds.push(this.stuSelected[i].infoId);
      }
      me.alert(
        `您当前选中总床位数：${this.roomSelectedCount.kc}个,男生床位：${this.roomSelectedCount.nan}个,女生床位：${this.roomSelectedCount.nv}个。
分配给男生：${this.stuSelectedCount.nan}人，女生：${this.stuSelectedCount.nan}人。
选择的床位将按性别依次分配给选择的学生，当选择的床位数小于选择的学生人数时，多出的学生将不分配。
确认对所选数据进行分配吗？`,
        "批量分配",
        {
          type: "warning",
          request() {
            return assignBatch({
              roomIds: roomIds,
              infoIds: infoIds,
            });
          },
          success() {
            me.toast("分配成功", "success");
          },
        }
      );
    },
  },
};
</script>

<style lang="scss">
.planmany-wrap {
  .pagination-left {
    display: none;
  }
  .el-pagination__jump {
    display: none !important;
  }
  .el-pagination__sizes {
    display: none !important;
  }
}
</style>
