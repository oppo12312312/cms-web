<template>
  <v-page :has-left="true">
    <template #left>
      <el-card shadow="never">
        <div slot="header" class="clearfix">
          <span class="txt-bold">宿舍信息</span>
        </div>
        <div>
          <dom-tree ref="domTree" @handleNodeClick="handleNodeClick"></dom-tree>
        </div>
      </el-card>
    </template>
    <el-card
      v-if="gyCard.show"
      shadow="never"
      class="fn-mb15"
      style="position: relative"
    >
      <div slot="header" class="clearfix">
        <span class="txt-bold">{{ gyCard.title }}</span>
        <div style="position: absolute; right: 10px; top: 10px">
          <el-dropdown
            @command="handleCommand"
            class="fn-mr15"
            v-if="showAddMany"
          >
            <el-button type="primary">
              新增<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="campus" v-if="detail.perms.addCampus"
                >新增校区</el-dropdown-item
              >
              <el-dropdown-item command="zone" v-if="detail.perms.addZone"
                >新增公寓区</el-dropdown-item
              >
              <el-dropdown-item
                command="apartment"
                v-if="detail.perms.addAapartment"
                >新增公寓楼</el-dropdown-item
              >

              <el-dropdown-item command="unit" v-if="detail.perms.addUnit"
                >新增单元</el-dropdown-item
              >
              <el-dropdown-item command="floor" v-if="detail.perms.addFloor"
                >新增楼层</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
          <v-btn
            type="add"
            size="middle"
            :txt="'新增' + getLevelName(currentNode.nextLevel)"
            @handleClick="openSaveDialog"
            v-if="
              currentLevel != 'room' && currentLevel != 'floor' && !showAddMany
            "
          ></v-btn>

          <v-btn
            type="edit"
            size="middle"
            txt="修改"
            @handleClick="openEditDialog"
          ></v-btn>
          <v-btn
            type="del"
            size="middle"
            txt="删除"
            @handleClick="delItem"
          ></v-btn>
          <v-btn
            type=""
            v-if="currentLevel != 'room'"
            size="middle"
            txt="新增管理员"
            @handleClick="$refs.glyDialog.dialogVisible = true"
          ></v-btn>
        </div>
      </div>
      <el-row>
        <el-col :span="14">
          <div class="aptinfo" v-if="detail.roomInfo">
            <p>名称：{{ detail.roomInfo.roomName }}</p>
            <p>性别：{{ detail.roomInfo.roomSex }}</p>
            <p>床位数量：{{ detail.roomInfo.bedTotal }}</p>
            <p>收费标准：{{ detail.roomInfo.charge }}</p>
            <p>已住人数：{{ detail.roomInfo.checkin }}</p>
          </div>
          <div v-else class="aptinfo">
            <p>编号：{{ aptInfo.aptCode }}</p>
            <p>名称：{{ aptInfo.aptName }}</p>
            <p>全称：{{ aptInfo.fullName }}</p>
            <p v-if="aptInfo.jgrq">竣工日期：2020-08-03</p>
          </div>
        </el-col>
        <el-col :span="10">
          <v-image
            v-if="detail.files && detail.files.length"
            :placeholder="placeUrl"
            style="width: 100%; height: 120px"
            :fileid="detail.files[0].fileId"
          ></v-image>
        </el-col>
      </el-row>
    </el-card>
    <el-card
      v-if="glyCard.show && detail.managerList && detail.managerList.length"
      shadow="never"
      class="fn-mb15"
    >
      <div slot="header" class="clearfix">
        <span class="txt-bold">管理员信息</span>
      </div>
      <div v-loading="loading">
        <basic-table
          :muti="false"
          ref="glyTable"
          :props-data="detail.managerList"
          :columns="columns1"
        ></basic-table>
      </div>
    </el-card>

    <el-card
      v-if="tjCard.show"
      shadow="never"
      class="fn-mb15"
      style="position: relative"
    >
      <div slot="header" class="clearfix">
        <span class="txt-bold">住宿统计</span>
        <div style="position: absolute; right: 10px; top: 10px">
          <!-- <v-btn
            type="add"
            txt="新增校区"
            v-if="currentLevel == '' || currentLevel == 'top'"
            @handleClick="openSaveDialog"
          ></v-btn> -->
          <el-dropdown
            v-if="(currentLevel == '' || currentLevel == 'top') && showAddMany"
            @command="handleCommand"
            class="fn-mr15"
          >
            <el-button type="primary">
              新增<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="campus" v-if="detail.perms.addCampus"
                >新增校区</el-dropdown-item
              >
              <el-dropdown-item command="zone" v-if="detail.perms.addZone"
                >新增公寓区</el-dropdown-item
              >
              <el-dropdown-item
                command="apartment"
                v-if="detail.perms.addAapartment"
                >新增公寓楼</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
          <v-btn
            type=""
            txt="各院系住宿统计"
            @handleClick="openStaticDialog"
          ></v-btn>
        </div>
      </div>
      <div>
        <basic-table
          :muti="false"
          ref="tongjiTable"
          :props-data="detail.statics ? staticsData : []"
          :columns="columns"
        ></basic-table>
      </div>
    </el-card>
    <el-card
      v-if="fjCard.show"
      shadow="never"
      class="fn-mb15"
      style="position: relative"
    >
      <div slot="header" class="clearfix">
        <span class="txt-bold">房间信息</span>
        <div style="position: absolute; right: 10px; top: 10px">
          <v-btn
            type="add"
            txt="新增房间"
            @handleClick="openSaveDialog"
          ></v-btn>
        </div>
      </div>
      <el-row :gutter="15">
        <el-col :span="6" v-for="(fr, index) in roomList" :key="index">
          <el-card shadow="never" class="fn-mb15 fj-card">
            <div slot="header" class="clearfix">
              <span class="txt-bold">{{ fr.roomName }}</span>
              <i @click="editRoom(fr)" class="el-icon-edit"></i>
            </div>
            <div>
              <div class="card-content">
                {{ fr.roomSex }}({{ fr.checkin }}/{{ fr.bedTotal }})
              </div>
              <div class="card-footer">{{ fr.charge }}元/年</div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>
    <el-card
      v-if="this.currentLevel == 'room'"
      shadow="never"
      class="fn-mb15"
      style="position: relative"
    >
      <div slot="header" class="clearfix">
        <span class="txt-bold">已住人员信息</span>
        <div style="position: absolute; right: 10px; top: 10px">
          <v-btn
            type=""
            txt="整房退宿"
            @handleClick="openSaveDialog1(currentNode)"
          ></v-btn>
        </div>
      </div>
      <check-in-table
        :patch-data="setRoom(currentNode)"
        ref="checkInTable"
      ></check-in-table>
    </el-card>
    <el-card
      v-if="lcCard.show"
      shadow="never"
      class="fn-mb15"
      style="position: relative"
    >
      <div slot="header" class="clearfix">
        <span class="txt-bold">楼层详情</span>
      </div>
      <div v-loading="loading">
        <el-collapse>
          <el-collapse-item
            v-for="(fl, index) in floorList"
            :key="index"
            title=""
            :name="index"
            style="position: relative"
          >
            <template slot="title">
              <span>
                {{
                  fl.floorName +
                  "(已住：" +
                  fl.checkIn +
                  "/" +
                  fl.bedTotal +
                  ")"
                }}
              </span>
              <div style="position: absolute; right: 30px; top: 0px">
                <v-btn
                  type=""
                  txt="楼层基本信息"
                  size="small"
                  @handleClick="openDetailDialog(fl)"
                ></v-btn>
                <v-btn
                  type=""
                  txt="批量退宿"
                  size="small"
                  @handleClick="openSaveDialog1(fl)"
                ></v-btn>
                <v-btn
                  type=""
                  txt="新增房间"
                  size="small"
                  @handleClick="openSaveRoomDialog(fl)"
                ></v-btn>
              </div>
            </template>
            <el-row :gutter="15">
              <el-col :span="6" v-for="(fr, index) in fl.roomList" :key="index">
                <el-card shadow="never" class="fn-mb15 fj-card">
                  <div slot="header" class="clearfix">
                    <span class="txt-bold">{{ fr.roomName }}</span>
                    <i @click="editRoom(fr)" class="el-icon-edit"></i>
                  </div>
                  <div>
                    <div class="card-content">
                      {{ fr.roomSex }}({{ fr.checkin }}/{{ fr.bedTotal }})
                    </div>
                    <div class="card-footer">{{ fr.charge }}元/年</div>
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </el-collapse-item>
        </el-collapse>
      </div>
    </el-card>
    <v-dialog
      width="720px"
      ref="saveDialog"
      @handleClose="saveItem"
      :title="currentItem.dTitle ? currentItem.dTitle : getTitle()"
    >
      <save-dom-form
        ref="saveItemForm"
        v-if="changeForm"
        :patch-data="currentItem"
      ></save-dom-form>
      <save-gy-form
        v-else
        ref="saveItemForm"
        :patch-data="currentItem"
        :title="
          currentItem.title
            ? currentItem.title
            : currentItem.aptId
            ? getLevelName(currentNode.aptLevel)
            : getLevelName(currentNode.nextLevel)
        "
      ></save-gy-form>
    </v-dialog>
    <v-dialog
      :show-footer="false"
      width="860px"
      ref="staticDialog"
      title="院系入住统计"
    >
      <yxrz-table :patch-data="currentNode"></yxrz-table>
    </v-dialog>
    <v-dialog
      :show-footer="false"
      width="640px"
      ref="detailDialog"
      title="详情"
    >
      <el-row v-if="dialogDetail.info">
        <el-col :span="14">
          <div class="aptinfo" v-if="dialogDetail.roomInfo">
            <p>名称：{{ dialogDetail.roomInfo.roomName }}</p>
            <p>性别：{{ dialogDetail.roomInfo.roomSex }}</p>
            <p>床位数量：{{ dialogDetail.roomInfo.bedTotal }}</p>
            <p>收费标准：{{ dialogDetail.roomInfo.charge }}</p>
            <p>已住人数：{{ dialogDetail.roomInfo.checkin }}</p>
          </div>
          <div v-else class="aptinfo">
            <p>编号：{{ dialogDetail.info.aptCode }}</p>
            <p>名称：{{ dialogDetail.info.aptName }}</p>
            <p>全称：{{ dialogDetail.info.fullName }}</p>
            <p v-if="dialogDetail.info.jgrq">竣工日期：2020-08-03</p>
          </div>
        </el-col>
        <el-col :span="10">
          <v-image
            v-if="detail.files && detail.files.length"
            style="width: 100%; height: 120px"
            :fileid="detail.files[0].fileId"
          ></v-image>
        </el-col>
      </el-row>
    </v-dialog>
    <v-dialog
      :show-footer="false"
      width="860px"
      ref="glyDialog"
      title="添加管理员"
    >
      <gly-table
        ref="glyTable"
        @change="saveGly"
        :patch-data="currentItem"
      ></gly-table>
    </v-dialog>
    <check-out-form
      :patch-data="currentItem"
      ref="checkOutForm"
      @closed="fecthTsData"
    ></check-out-form>
    <distribution-form
      :patch-data="currentItem"
      ref="distributionForm"
    ></distribution-form>
  </v-page>
</template>

<script>
import domTree from "./components/domTree";
import saveDomForm from "./components/saveDomForm";
import saveGyForm from "./components/saveGyForm";
import basicTable from "_c/tables";
import checkOutForm from "./components/checkOutForm";
import distributionForm from "./components/distributionForm";
import yxrzTable from "./components/yxrzTable";
import glyTable from "./components/glyTable";
import noPic from "@p/static/imgs/no_pic.png";

import {
  addCampus,
  deleteCampus,
  updateCampus,
  treeDetail,
  addZone,
  deleteZone,
  updateZone,
  updateAptApartment,
  deleteAptApartment,
  addAptApartment,
  updateUnit,
  deleteUnit,
  addUnit,
  addFloor,
  deleteFloor,
  updateFloor,
  addRoom,
  deleteRoom,
  updateRoom,
} from "@/projects/hbmu-suguan/api/sgApt";
import {
  addManager,
  deleteManager,
} from "@/projects/hbmu-suguan/api/sgAptManager";
import checkInTable from "./components/checkInTable";

export default {
  components: {
    basicTable,
    domTree,
    saveDomForm,
    saveGyForm,
    checkOutForm,
    distributionForm,
    checkInTable,
    yxrzTable,
    glyTable,
  },
  data() {
    return {
      placeUrl: noPic,
      dialogDetail: {},
      detail: {
        perms: {},
      },
      aptInfo: {},
      staticsData: [],
      isEdit: false,
      loading: false,
      listLoading: false,
      changeForm: true,
      floorList: [],
      roomList: [],
      bedList: [],
      defaultProps: {
        label: "name",
      },
      treeData: [],
      resources: [],
      columns: [
        {
          label: "",
          prop: "label",
        },
        {
          label: "总床位",
          prop: "zcw",
          empty: "0",
        },
        {
          label: "已住床位",
          prop: "yzcw",
          empty: "0",
        },
        {
          label: "空床位",
          prop: "kcw",
          empty: "0",
        },
      ],
      columns1: [
        {
          label: "帐号",
          prop: "username",
        },
        {
          label: "姓名",
          prop: "truename",
        },
        {
          label: "部门",
          prop: "xy",
        },
        {
          label: "手机号",
          prop: "sj",
        },
        {
          label: "操作",
          fixed: "right",
          render: (h, row) => {
            return (
              <div>
                <el-button
                  type="text"
                  onClick={() => this.delGly(row)}
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
      columns2: [
        {
          label: "",
          prop: "label",
        },
        {
          label: "总床位",
          prop: "zcw",
          empty: "0",
        },
        {
          label: "已住床位",
          prop: "yzcw",
          empty: "0",
        },
        {
          label: "空床位",
          prop: "kcw",
          empty: "0",
        },
      ],
      glyComumns: [],
      currentItem: {},
      parentNode: {},
      currentNode: {},
      ruleForm: {},
      glyParams: {},
      showAddMany: false,
    };
  },
  created() {
    this.getDetail("", "top");
  },
  computed: {
    currentLevel: function () {
      return this.currentNode.aptLevel ? this.currentNode.aptLevel : "";
    },
    gyCard: function () {
      const title = this.getLevelName(this.currentLevel) + "信息";

      return {
        title: title,
        show:
          ["campus", "zone", "apartment", "unit", "floor", "room"].indexOf(
            this.currentLevel
          ) > -1,
      };
    },
    glyCard: function () {
      return {
        show:
          ["campus", "zone", "apartment", "unit", "floor"].indexOf(
            this.currentLevel
          ) > -1,
      };
    },
    tjCard: function () {
      return {
        show:
          ["", "top", "campus", "zone", "apartment", "unit"].indexOf(
            this.currentLevel
          ) > -1,
      };
    },
    lcCard: function () {
      return {
        show: ["unit"].indexOf(this.currentLevel) > -1,
      };
    },
    fjCard: function () {
      return {
        show: ["floor"].indexOf(this.currentLevel) > -1,
      };
    },
  },
  methods: {
    fecthTsData(type) {
      this.$refs.checkInTable.fecthData();
    },
    getLevelName(level) {
      switch (level) {
        case "campus":
          return "校区";
        case "zone":
          return "公寓区";
        case "apartment":
          return "公寓楼";
        case "unit":
          return "单元";
        case "floor":
          return "楼层";
        case "room":
          return "房间";
      }
    },
    getTitle(title) {
      if (this.currentItem.aptId) {
        return this.currentNode.nextLevel
          ? "修改" + this.getLevelName(this.currentNode.aptLevel)
          : "修改校区";
      } else {
        return this.currentNode.aptLevel && this.currentNode.aptLevel != "top"
          ? "新增" + this.getLevelName(this.currentNode.nextLevel)
          : "新增校区";
      }
    },
    setRoom(node) {
      node.roomId = node.aptId;
      return node;
    },
    handleNodeClick(node) {
      this.currentNode = node;
      this.getDetail(node.aptId, node.aptLevel ? node.aptLevel : "top");
    },
    getDetail(aptId, aptLevel, cb) {
      treeDetail({
        aptId: aptId == "node0" ? "" : aptId,
        aptLevel: aptLevel,
      }).then((data) => {
        this.$set(this, "detail", data.data);
        if (data.data.perms) {
          this.showAddMany = true;
        } else {
          this.showAddMany = false;
        }
        this.aptInfo = data.data.info;
        if (data.data.statics) {
          this.initRows(data.data.statics);
        }
        if (data.data.floorList) {
          this.floorList = data.data.floorList;
        }
        if (data.data.roomList) {
          this.roomList = data.data.roomList;
        }
        if (data.data.bedList) {
          this.bedList = data.data.bedList;
        }
        if (data.data.roomInfo) {
          this.currentNode.roomInfo = data.data.roomInfo;
        }
        if (cb) {
          cb(data);
        }
      });
    },
    initRows(statics) {
      const staticsData = [];
      staticsData.push({
        label: "总数",
        zcw: statics.CWSL,
        yzcw: statics.RZRS,
        kcw: statics.KCSL,
      });
      staticsData.push({
        label: "男生人数",
        zcw: statics.MAN_CWSL,
        yzcw: statics.MAN_RZRS,
        kcw: statics.MAN_KCSL,
      });
      staticsData.push({
        label: "女生人数",
        zcw: statics.WOMEN_CWSL,
        yzcw: statics.WOMEN_RZRS,
        kcw: statics.WOMEN_KCSL,
      });
      this.$set(this, "staticsData", staticsData);
    },
    switchForm(level) {
      if (level == "" || level == "top" || level == "campus") {
        this.changeForm = true;
      } else {
        this.changeForm = false;
      }
    },
    openSaveDialog1(item) {
      this.currentItem = {};
      if (item) {
        this.currentItem = item;
        if (item.floorId) {
          this.currentItem.aptLevel = "floor";
          this.currentItem.aptId = item.floorId;
        }
      }
      this.currentItem.tsType = "overall";
      this.$refs.checkOutForm.show();
    },
    openSaveDialog(item) {
      this.currentItem = {};
      if (this.currentLevel != "" && this.currentLevel != "top") {
        this.currentItem.currentNode = this.currentNode;
        this.currentItem.nextLevel = this.currentNode.nextLevel;
        this.switchForm(this.currentLevel);
      } else {
        this.changeForm = true;
      }

      this.$refs.saveDialog.dialogVisible = true;
    },
    openDetailDialog(item) {
      treeDetail({
        aptId: item.floorId,
        aptLevel: "floor",
      }).then((data) => {
        this.dialogDetail = data.data;
        this.$refs.detailDialog.dialogVisible = true;
      });
    },
    openSaveRoomDialog(item) {
      this.currentItem = {
        title: "房间",
        dTitle: "新增房间",
      };
      if (this.currentLevel != "" && this.currentLevel != "top") {
        this.currentItem.currentNode = {
          aptId: item.floorId,
          aptCode: item.floorCode,
          aptName: item.floorName,
          aptLevel: "floor",
          nextLevel: "room",
        };
        this.switchForm(this.currentLevel);
      }

      this.$refs.saveDialog.dialogVisible = true;
    },
    openEditDialog(item) {
      this.currentItem = {
        aptId: this.currentNode.aptId,
        files: this.detail.files,
      };
      this.currentItem.currentNode = this.currentNode;
      this.switchForm(this.currentNode.parent.data.aptLevel);
      this.$refs.saveDialog.dialogVisible = true;
    },
    openStaticDialog() {
      this.$refs.staticDialog.dialogVisible = true;
    },
    handleCommand(type) {
      this.currentItem = {};
      if (!this.currentNode.aptId) {
        this.currentNode = {
          aptId: "",
          aptLevel: "top",
        };
      }

      if (type == "campus") {
        this.currentItem.currentNode = this.currentNode;
        this.currentItem.nextLevel = type;
        (this.currentItem.isSpect = addCampus),
          (this.currentItem.dTitle = "新增校区");
        this.changeForm = true;
      } else if (type == "zone") {
        this.currentItem.currentNode = this.currentNode;
        this.currentItem.nextLevel = type;
        (this.currentItem.isSpect = addZone),
          (this.currentItem.dTitle = "新增公寓区");
        this.changeForm = true;
      } else if (type == "apartment") {
        this.currentItem.currentNode = this.currentNode;
        this.currentItem.nextLevel = type;
        (this.currentItem.isSpect = addAptApartment),
          (this.currentItem.dTitle = "新增公寓楼");
        this.changeForm = false;
      } else if (type == "floor") {
        this.currentItem.currentNode = this.currentNode;
        this.currentItem.nextLevel = type;
        (this.currentItem.isSpect = addFloor),
          (this.currentItem.title = "楼层");
        this.currentItem.dTitle = "新增楼层";
        this.changeForm = false;
      } else if (type == "unit") {
        this.currentItem.currentNode = this.currentNode;
        this.currentItem.nextLevel = type;
        (this.currentItem.isSpect = addUnit),
          (this.currentItem.dTitle = "新增单元");
        this.changeForm = false;
      } else {
        this.changeForm = true;
      }

      this.$refs.saveDialog.dialogVisible = true;
    },
    glyServer() {
      return findSgUsers;
    },
    saveItem() {
      const me = this;
      this.$refs.saveItemForm.validate((data) => {
        const oData = {};
        for (const key in data) {
          if (key == "dto") {
            oData.dtoStr = JSON.stringify(data[key]);
          } else if (key != "files" && data[key] != "null") {
            oData[key] = data[key];
          }
        }
        this.$refs.saveDialog.posting = true;
        if (this.currentItem.aptId) {
          if (
            this.currentLevel == "top" ||
            this.currentLevel == "" ||
            this.currentLevel == "campus"
          ) {
            this.editNodes(updateCampus, [data.files], oData);
          } else if (this.currentLevel == "zone") {
            this.editNodes(updateZone, [data.files], oData);
          } else if (this.currentLevel == "apartment") {
            this.editNodes(updateAptApartment, [data.files], oData);
          } else if (this.currentLevel == "unit") {
            this.editNodes(updateUnit, [data.files], oData);
          } else if (this.currentLevel == "floor") {
            this.editNodes(updateFloor, [data.files], oData);
          } else if (this.currentLevel == "room") {
            this.editNodes(updateRoom, [data.files], oData, () => {
              this.$refs.checkInTable.fecthData();
            });
          }
        } else {
          if (this.currentItem.isSpect) {
            this.addNodes(this.currentItem.isSpect, [data.files], oData);
          } else {
            if (this.currentLevel == "top" || this.currentLevel == "") {
              this.addNodes(addCampus, [data.files], oData);
            } else if (this.currentLevel == "campus") {
              this.addNodes(addZone, [data.files], oData);
            } else if (this.currentLevel == "zone") {
              this.addNodes(addAptApartment, [data.files], oData);
            } else if (this.currentLevel == "apartment") {
              this.addNodes(addUnit, [data.files], oData);
            } else if (this.currentLevel == "unit") {
              this.addNodes(addFloor, [data.files], oData);
            } else if (this.currentLevel == "floor") {
              this.addNodes(addRoom, [data.files], oData);
            }
          }
        }
      });
    },
    saveGly(item) {
      const me = this;
      this.alert("确定设置" + item.truename + "为管理员？", "设置", {
        type: "warning",
        request() {
          return addManager({
            aptId: me.currentNode.aptId,
            aptLevel: me.currentNode.aptLevel,
            // managerId: item.userid,
            userid: item.userid,
          });
        },
        success() {
          me.toast("设置成功", "success");
          me.$refs.glyDialog.close();
          me.getDetail(me.currentNode.aptId, me.currentNode.aptLevel);
        },
      });
    },
    delGly(item) {
      const me = this;
      this.alert("确定删除管理员：" + item.truename + "？", "删除", {
        type: "error",
        request() {
          return deleteManager({
            aptId: me.currentNode.aptId,
            aptLevel: me.currentNode.aptLevel,
            managerId: item.managerId,
            userid: item.userid,
          });
        },
        success() {
          me.toast("删除成功", "success");
          me.getDetail(me.currentNode.aptId, me.currentNode.aptLevel);
        },
      });
    },
    addNodes(fun, files, query) {
      const me = this;
      fun(files, query)
        .then(() => {
          this.$refs.saveDialog.close();
          me.toast("添加成功", "success");
          me.$refs.domTree.updateKeyChildren(
            me.currentNode.aptId,
            me.currentNode.aptLevel
          );
        })
        .catch((err) => {
          me.$refs.saveDialog.posting = false;
        });
    },
    editNodes(fun, files, query, cb) {
      const me = this;
      const oData = {};
      for (const key in query) {
        if (key != "roomCount" && key != "unitCount" && key != "floorCount") {
          oData[key] = query[key];
        }
      }
      fun(files, oData)
        .then(() => {
          this.$refs.saveDialog.close();
          me.toast("修改成功", "success");
          me.getDetail(me.currentNode.aptId, me.currentNode.aptLevel);
          me.$refs.domTree.updateKeyChildren(
            me.currentNode.parent.aptId,
            me.currentNode.parent.aptLevel
          );
          if (cb) {
            cb();
          }
        })
        .catch((err) => {
          this.$refs.saveDialog.posting = false;
        });
    },
    editRoom(item) {
      this.getDetail(item.roomId, "room", (data) => {
        this.currentNode = {
          aptId: data.data.roomInfo.roomId,
          aptCode: data.data.roomInfo.roomCode,
          aptName: data.data.roomInfo.roomName,
          aptLevel: "room",
          roomInfo: data.data.roomInfo,
          parent: { data: this.currentNode },
        };
      });
    },
    delItem() {
      const me = this;
      const title = this.getLevelName(this.currentNode.aptLevel);
      this.alert("确定删除" + title + "？", "删除", {
        type: "error",
        request() {
          if (
            me.currentLevel == "top" ||
            me.currentLevel == "" ||
            me.currentLevel == "campus"
          ) {
            return deleteCampus({
              campusId: me.currentNode.aptId,
            });
          } else if (me.currentLevel == "zone") {
            return deleteZone({
              zoneId: me.currentNode.aptId,
            });
          } else if (me.currentLevel == "apartment") {
            return deleteAptApartment({
              apartmentId: me.currentNode.aptId,
            });
          } else if (me.currentLevel == "unit") {
            return deleteUnit({
              unitId: me.currentNode.aptId,
            });
          } else if (me.currentLevel == "floor") {
            return deleteFloor({
              floorId: me.currentNode.aptId,
            });
          } else if (me.currentLevel == "room") {
            return deleteRoom({
              roomId: me.currentNode.aptId,
            });
          }
        },
        success() {
          me.toast("删除成功", "success");
          me.$refs.domTree.remove(me.currentNode.aptId);
          me.$refs.domTree.setCurrentKey("node0");
          me.handleNodeClick(me.$refs.domTree.getNode("node0"));
        },
      });
    },
  },
};
</script>

<style lang="scss">
.aptinfo {
  p {
    line-height: 32px;
  }
}
.fj-card {
  .el-card__header {
    padding: 10px;
    position: relative;
    .el-icon-edit {
      position: absolute;
      right: 10px;
      top: 12px;
      cursor: pointer;
    }
  }
  .el-card__body {
    padding: 0;
    .card-content {
      padding: 20px 10px;
    }
    .card-footer {
      padding: 10px;
      margin: 0;
    }
  }
}
</style>
