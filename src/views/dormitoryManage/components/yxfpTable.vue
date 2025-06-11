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
      <el-row class="text item" :gutter="15">
        <el-col :span="8">
          <el-card shadow="never">
            <div slot="header" class="clearfix">楼栋</div>
            <basic-table
              ref="basicTable1"
              :columns="columns1"
              :props-data="ldArr"
              height="300"
              @selectionChange="ldChange"
            ></basic-table>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="never">
            <div slot="header" class="clearfix">楼层</div>
            <basic-table
              ref="basicTable2"
              :columns="columns2"
              :props-data="lcArr"
              height="300"
              @selectionChange="lcChange"
            ></basic-table>
          </el-card>
        </el-col>
        <el-col :span="8" class="fn-mb15">
          <el-card shadow="never">
            <div slot="header" class="clearfix">房间</div>
            <basic-table
              ref="basicTable3"
              :columns="columns3"
              :props-data="fjArr"
              height="300"
              @selectionChange="fjChange"
            ></basic-table>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card shadow="never">
            <div slot="header" class="clearfix">空床位</div>
            <basic-table
              ref="basicTable4"
              :columns="columns4"
              :props-data="cwArr"
              height="300"
              @selectionChange="cwChange"
            ></basic-table>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card shadow="never">
            <div slot="header" class="clearfix">宿舍分配</div>
            <div class="fp-info">
              <v-form :fields="fields1" :fieldsData="ruleForm"></v-form>
              <p>总人数：{{ deptDetail.total || 0 }}</p>
              <p>
                男生总人数：{{ deptDetail.manTotal || 0 }} 已分配床位数：{{
                  deptDetail.manRanged || 0
                }}
                缺：{{ deptDetail.manTotal - deptDetail.manRanged || 0 }}
              </p>
              <p>
                女生总人数：{{ deptDetail.womanTotal || 0 }} 已分配床位数：{{
                  deptDetail.womanRanged || 0
                }}
                缺：{{ deptDetail.womanTotal - deptDetail.womanRanged || 0 }}
              </p>
              <p>
                当前选中床位数：{{ cwSelect.length }} 男：{{ nanCount }} 女：{{
                  nvCount
                }}
              </p>
              <div style="margin: 20px 0 40px 0">
                <el-button type="primary" :loading="posting" @click="onSubmit"
                  >分配</el-button
                >
                <el-button @click="clear">清空</el-button>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </v-page>
  </div>
</template>

<script>
import {
  rangeApartmentList,
  rangeFloorList,
  rangeRoomList,
  rangeBedList,
  rangeBed,
  deptDetail,
  rangeClear,
} from "@/projects/hbmu-suguan/api/sgPreRange";
import { mapGetters, mapActions } from "vuex";
import basicTable from "_c/tables";
import studentInfo from "../components/studentInfo.vue";
import { tree } from "@/projects/hbmu-suguan/api/sgApt";

export default {
  props: {
    patchData: Object,
  },
  components: {
    basicTable,
    studentInfo,
  },
  created() {
    this.getOpts(["xbOpts"]);
    this.getLd();
    if (this.userInfo.deptid || this.patchData.xyId) {
      this.ruleForm.xyId = this.patchData.xyId || this.userInfo.deptid;
      deptDetail({
        xyId: this.ruleForm.xyId,
        bjid: "",
        nj: this.patchData.nj,
      }).then((data) => {
        this.deptDetail = data.data;
      });
    }
  },
  data() {
    return {
      ldArr: [],
      ldSelect: [],
      lcArr: [],
      lcSelect: [],
      fjSelect: [],
      fjArr: [],
      cwSelect: [],
      cwArr: [],
      currentItem: {},
      tableParams: {
        sex: "",
        wholeRoom: "0",
        passRanged: "yes",
        settingId: this.patchData.settingId,
      },
      rangeDetail: {},
      posting: false,
      ruleForm: {
        xyId: "",
        bjid: "",
        xy: "",
        bjmc: "",
      },
      deptDetail: {},
    };
  },
  computed: {
    ...mapGetters(["xbOpts"]),
    columns1: function () {
      const cols = [
        {
          label: "编号",
          width: "100px",
          prop: "apartmentCode",
        },
        {
          label: "楼栋",
          width: "120px",
          prop: "apartmentName",
        },
      ];
      return cols;
    },
    columns2: function () {
      const cols = [
        {
          label: "编号",
          width: "100px",
          prop: "floorCode",
        },
        {
          label: "楼层",
          width: "120px",
          prop: "floorName",
        },
      ];
      return cols;
    },
    columns3: function () {
      const cols = [
        {
          label: "编号",
          width: "100px",
          prop: "roomCode",
        },
        {
          label: "房间",
          width: "120px",
          prop: "roomName",
        },
      ];
      return cols;
    },
    columns4: function () {
      const cols = [
        {
          label: "床位",
          prop: "bedCode",
        },
        {
          label: "位置",
          width: "120px",
          prop: "fullname",
        },
        {
          label: "性别",
          prop: "xb",
        },
        {
          label: "收费标准",
          prop: "charge",
        },
      ];
      return cols;
    },
    fields() {
      const me = this;
      const arr = [
        {
          label: "",
          prop: "sex",
          span: 4,
          type: "select",
          placeholder: "请选择性别",
          options: this.xbOpts,
        },
        {
          label: "",
          prop: "wholeRoom",
          span: 4,
          type: "select",
          placeholder: "请选择房间属性",
          options: [
            {
              label: "整间",
              value: "0",
            },
            {
              label: "有部分床位",
              value: "1",
            },
          ],
        },
        {
          label: "",
          prop: "passRanged",
          span: 4,
          type: "select",
          placeholder: "已分配",
          options: [
            {
              label: "过滤",
              value: "yes",
            },
            {
              label: "不过滤",
              value: "no",
            },
          ],
        },
      ];
      if (this.userInfo.roleType == "xx") {
        arr.push({
          label: "",
          prop: "aptId",
          type: "tree",
          placeholder: "请选择宿舍位置",
          span: 4,
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
                    isLeaf: data[i].aptLevel == "zone" ? true : false,
                  });
                }
                return resolve(arr);
              });
            }
          },
          handleClick: function (node) {
            me.tableParams.aptLevel = node.aptLevel;
          },
        });
      }
      return arr;
    },
    fields1() {
      const me = this;
      return [
        {
          label: "",
          type: "xyzybj",
          labelShow: "true",
          layout: ["xy", "bj"],
          xyId: me.ruleForm.xyId,
          njs: me.patchData.nj,
          xyDisabled: me.userInfo.roleType != "xx" ? true : false,
        },
      ];
    },
    nanCount: function () {
      let count = 0;
      if (this.cwSelect.length) {
        for (let i = 0; i < this.cwSelect.length; i++) {
          if (this.cwSelect[i].xb == "男") {
            count++;
          }
        }
      }
      return count;
    },
    nvCount: function () {
      let count = 0;
      if (this.cwSelect.length) {
        for (let i = 0; i < this.cwSelect.length; i++) {
          if (this.cwSelect[i].xb == "女") {
            count++;
          }
        }
      }
      return count;
    },
  },
  watch: {
    "ruleForm.bjid": function (nVal, oVal) {
      if (nVal != oVal) {
        deptDetail({
          xyId: this.ruleForm.xyId,
          bjid: this.ruleForm.bjid,
          nj: this.patchData.nj,
        }).then((data) => {
          this.deptDetail = data.data;
        });
      }
    },
    "ruleForm.xyId": function (nVal, oVal) {
      if (nVal != oVal) {
        deptDetail({
          xyId: this.ruleForm.xyId,
          bjid: this.ruleForm.bjid,
          nj: this.patchData.nj,
        }).then((data) => {
          this.deptDetail = data.data;
        });
      }
    },
  },
  methods: {
    ...mapActions(["getOpts"]),
    exportsExecutes(fields, filename) {
      return exportList(
        Object.assign(this.tableParams, {
          excelDtos: fields,
        }),
        filename
      );
    },
    colsChange(showFields) {
      this.showFields = showFields;
    },
    getLd(pagination) {
      rangeApartmentList(this.tableParams).then((data) => {
        this.ldArr = data.data;
      });
    },
    getLc(ldArr) {
      if (ldArr.length) {
        rangeFloorList(
          Object.assign(this.tableParams, {
            apartments: ldArr,
          })
        ).then((data) => {
          this.lcArr = data.data;
        });
      } else {
        this.lcArr = [];
      }
    },
    getFj(lcArr) {
      if (lcArr.length) {
        rangeRoomList(
          Object.assign(this.tableParams, {
            floors: lcArr,
          })
        ).then((data) => {
          this.fjArr = data.data;
        });
      } else {
        this.fjArr = [];
      }
    },
    getCw(fjArr) {
      if (fjArr.length) {
        rangeBedList(
          Object.assign(this.tableParams, {
            rooms: fjArr,
          })
        ).then((data) => {
          this.cwArr = data.data;
        });
      } else {
        this.cwArr = [];
      }
    },
    fecthData() {
      this.getLd();
    },
    reloadData() {
      this.tableParams = {
        settingId: this.patchData.settingId,
      };
      this.$refs.basicTable.reload();
    },
    ldChange(val) {
      this.ldSelect = val;
      const ldArr = [];
      for (let i = 0; i < val.length; i++) {
        ldArr.push(val[i].apartmentId);
      }
      this.getLc(ldArr);
    },
    lcChange(val) {
      this.lcSelect = val;
      const lcArr = [];
      for (let i = 0; i < val.length; i++) {
        lcArr.push(val[i].floorId);
      }
      this.getFj(lcArr);
    },
    fjChange(val) {
      this.fjSelect = val;
      const fjArr = [];
      for (let i = 0; i < val.length; i++) {
        fjArr.push(val[i].roomId);
      }
      this.getCw(fjArr);
    },
    cwChange(val) {
      this.cwSelect = val;
    },
    rangeScopeList() {
      rangeScopeList({}).then((data) => {
        this.rangeDetail = data.data;
      });
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
    openStuDialog(item) {
      this.currentItem = item || {};
      this.$refs.stuDialog.dialogVisible = true;
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
    clear() {
      const me = this;
      if (this.ruleForm.xyId) {
        this.alert(
          `确认清空当前${this.lang_college}班级预分配信息？`,
          "确认要进行清空吗？",
          {
            type: "warning",
            request() {
              return rangeClear({
                xyId: me.ruleForm.xyId,
                bjid: me.ruleForm.bjid,
                settingId: me.patchData.settingId,
              });
            },
            success() {
              me.toast("清空成功", "success");
            },
          }
        );
      } else {
        me.toast(`请先选择${this.lang_college}`, "warning");
      }
    },
    onSubmit() {
      const bedIds = [];
      const me = this;
      if (this.cwSelect.length && me.ruleForm.xyId) {
        //this.posting = true;
        for (let i = 0; i < this.cwSelect.length; i++) {
          bedIds.push(this.cwSelect[i].bedId);
        }
        me.alert(
          `您当前选中总床位数：${this.cwSelect.length}个,男生床位：${
            this.nanCount
          }个,女生床位：${this.nvCount}个。
分配给男生：${this.deptDetail.manTotal || 0}人，女生：${
            this.deptDetail.womanTotal || 0
          }人。
选择的床位将按性别依次分配给选择的学生，当选择的床位数小于选择的学生人数时，多出的学生将不分配。
确认对所选数据进行分配吗？`,
          "批量分配",
          {
            type: "warning",
            request() {
              return rangeBed({
                beds: bedIds,
                xyId: me.ruleForm.xyId,
                bjid: me.ruleForm.bjid,
                xy: me.ruleForm.xy,
                bjmc: me.ruleForm.bjmc,
                settingId: me.patchData.settingId,
              });
              // .then((data) => {
              //   this.toast("分配成功", "success");
              //   let fjArr = [];
              //   for (let i = 0; i < this.fjArr.length; i++) {
              //     fjArr.push(this.fjArr[i].roomId);
              //   }
              //   this.getCw(fjArr);
              //   this.posting = false;
              // })
              // .catch((err) => {
              //   this.posting = false;
              // });
            },
            success() {
              me.toast("分配成功", "success");
              me.toast("分配成功", "success");
              const fjArr = [];
              for (let i = 0; i < me.fjArr.length; i++) {
                fjArr.push(me.fjArr[i].roomId);
              }
              deptDetail({
                xyId: me.ruleForm.xyId,
                bjid: me.ruleForm.bjid,
                nj: this.patchData.nj,
              }).then((data) => {
                me.deptDetail = data.data;
              });
              me.getCw(fjArr);
              //me.posting = false;
            },
          }
        );
      } else if (!this.ruleForm.xyId) {
        this.toast(`请先选择${this.lang_college}`, "warning");
      } else {
        this.toast("请先选择空床位", "warning");
      }
    },
  },
};
</script>
<style lang="scss">
.fp-info {
  p {
    line-height: 32px;
  }
}
</style>
