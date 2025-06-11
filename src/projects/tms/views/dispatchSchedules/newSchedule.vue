<template>
  <div class="lcbrwgl-c">
    <div class="lcbrwgl-header">
      <div
        style="
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 48px;
          width: 100%;
        "
      >
        <div @click="$emit('back')" class="title">
          <i
            class="el-icon-back"
            style="font-size: 22px; cursor: pointer; margin-right: 12px"
          ></i
          >新增排线
        </div>
      </div>
    </div>
    <div
      class="lcbrwgl-header"
      style="display: flex; justify-content: space-between; width: 100%"
    >
      <div
        style="display: flex; align-items: center"
        :style="{ height: `${defaultHeight}px` }"
      >
        <el-button
          style="margin-left: 8px; margin-right: 8px"
          type="primary"
          @click="xzdd"
          >选择订单</el-button
        >
        <!-- <v-import-btn2
          @uploaded="fecthData"
          :businessType="plateNos ? plateNos.label : ''"
          :batchid="scheduleId"
          importCode="tms_order"
          filename="订单导入模板"
        ></v-import-btn2> -->
        <!-- 文件上传组件 -->
        <excel-upload-button
          button-text="导入订单"
          :autoUpload="true"
          tip-text=""
          @upload-success="handleAutoUploadSuccess"
          @upload-error="handleError"
          @file-remove="handleFileRemove"
        />
      </div>
      <div>
        <el-button @click="del" v-if="tab == '0'">撤销</el-button>
        <el-button
          @click="deleteSelectedOrders"
          v-if="tab == '2'"
          type="danger"
        >
          删除订单</el-button
        >
      </div>

      <!-- <div>
        <el-button v-if="tab == '0'" type="primary" size="small" @click="zdpx"
          >自动排线</el-button
        >
      </div> -->
    </div>
    <div class="lcbrwgl-body">
      <div class="lcbrwgl-dt">
        <baidu-map
          v-if="mapReady"
          style="width: 100%; height: 100%"
          center="武汉"
          :scroll-wheel-zoom="true"
          ref="map"
        >
          <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
          <template v-if="mapComponentsReady">
            <bm-marker
              v-for="(o, i) in validOrderList"
              :key="o.orderNo"
              :position="{ lng: o.longitude, lat: o.latitude }"
              @click="currentOrder = o.orderNo"
            >
              <bm-info-window :show="currentOrder == o.orderNo">
                <div>订单序号：{{ i + 1 }}</div>
                <div style="font-size: 12px; width: 220px">
                  订单号：{{ o.orderNo }}
                </div>
                <div
                  style="
                    font-size: 12px;
                    width: 220px;
                    margin-top: 4px;
                    line-height: 14px;
                  "
                >
                  地址：{{ o.userAddress }}
                </div>
              </bm-info-window>
              <bm-label
                :content="i + 1 + ''"
                :labelStyle="labelStyle"
                :offset="{ width: 0, height: 1 }"
              />
            </bm-marker>
            <bm-polyline
              v-if="pathList && pathList.length > 0 && tab === '2'"
              :path="pathList"
              stroke-color="blue"
              :stroke-opacity="0.8"
              :stroke-weight="4"
            ></bm-polyline>
            <bm-marker
              v-if="isValidPosition(start)"
              :position="start"
              :icon="{
                url: './static/imgs/ckdz.png',
                size: { width: 32, height: 32 },
              }"
            ></bm-marker>
          </template>
        </baidu-map>
      </div>
      <!-- <div class="lcbrwgl-dt"></div> -->
      <div class="lcbrwgl-dd">
        <div class="lcbrwgl-dd-h">
          <div
            @click="getEOrderList('0')"
            class="status-item"
            :class="{ active: tab == '0' }"
          >
            待排线
          </div>
          <div
            @click="getEOrderList('2')"
            class="status-item"
            :class="{ active: tab == '2' }"
          >
            已排线
          </div>
          <div
            @click="getEOrderList('3')"
            class="status-item"
            :class="{ active: tab == '3' }"
          >
            配送中
          </div>
          <div
            @click="getEOrderList('4')"
            class="status-item"
            :class="{ active: tab == '4' }"
          >
            问题单
          </div>
        </div>
        <div class="lcbrwgl-dd-b">
          <draggable
            v-model="eOrderList"
            :disabled="tab != '0'"
            item-key="orderNo"
            animation="300"
            v-bind="dragOptions"
            class="drag-area"
          >
            <div
              v-for="(o, i) in tab == '4' ? wrongOrderList : validOrderList"
              :key="o.orderNo"
              class="drag"
            >
              <div
                @click="currentOrder = o.orderNo"
                class="order-item"
                :class="{ active: currentOrder == o.orderNo }"
              >
                <div class="ddxh">
                  <span>订单序号：{{ i + 1 }}</span>
                  <el-button
                    v-if="tab === '4'"
                    type="text"
                    @click="onClickRepareLngLat(o)"
                    >标注经纬度</el-button
                  >
                </div>
                <div class="ddh">
                  <el-checkbox
                    v-if="tab == '0' || tab == '2'"
                    v-model="o.checked"
                  ></el-checkbox>
                  订单号：<span class="ddhh">{{ o.orderNo }}</span>
                </div>
                <div class="ddh" style="margin-top: 4px">
                  {{ o.userAddress }}
                </div>
                <div class="ddh" style="margin-top: 4px">
                  实际支付：<span class="ddhh">{{ o.payPrice }}</span>
                </div>
              </div>
            </div>
          </draggable>
          <div v-if="validOrderList.length == 0" class="zwsj">暂无数据</div>
        </div>
        <div v-if="tab == '0'" class="lcbrwgl-dd-f">
          <el-checkbox v-model="checked" @change="changeQx">全选</el-checkbox>
          <div>
            <el-select
              v-model="plateNos"
              placeholder="请选择车牌号"
              style="margin-right: 10px; width: 130px"
              clearable
              size="small"
              @change="onChangeSelectCph"
            >
              <el-option
                v-for="cph in plateList"
                :key="cph.value"
                :label="cph.label"
                :value="cph"
              ></el-option>
            </el-select>
            <el-button type="primary" @click="sc" size="small"
              >生成排线</el-button
            >
          </div>
        </div>
        <div v-if="tab == '2'" class="lcbrwgl-dd-f">
          <el-checkbox v-model="checked" @change="changeQx">全选</el-checkbox>
          <div>
            <span style="font-size: 12px; color: #666"
              >已选中：{{ selectedOrderCount }} 个订单</span
            >
          </div>
        </div>
      </div>
    </div>
    <v-dialog
      ref="saveDialog"
      width="1260px"
      title="选择订单"
      confirmBtnTxt="确定"
      @handleClose="confirmXzdd"
    >
      <div style="display: flex">
        <div style="flex: 1 1 auto">
          <select-order ref="saveItemForm" :patch-data="{}"></select-order>
        </div>
      </div>
    </v-dialog>

    <el-dialog
      title="订单经纬度修复"
      :visible.sync="repareDlgVisible"
      width="500px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form
        :model="lngLatForm"
        :rules="lngLatRules"
        ref="lngLatForm"
        label-width="100px"
        status-icon
      >
        <el-form-item label="订单号">
          <span>{{ currentOrder }}</span>
        </el-form-item>
        <el-form-item label="详细地址">
          <span>{{ curWrongOrder.userAddress }}</span>
        </el-form-item>
        <el-form-item label="经度" prop="longitude">
          <el-input
            v-model="lngLatForm.longitude"
            placeholder="请输入经度"
            type="number"
          ></el-input>
        </el-form-item>
        <el-form-item label="纬度" prop="latitude">
          <el-input
            v-model="lngLatForm.latitude"
            placeholder="请输入纬度"
            type="number"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="repareDlgVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitLngLat" :loading="submitLoading"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import selectOrder from "./selectOrder";
import { pageList } from "#/api/tmsVehicle";
import {
  save,
  generate,
  dpxList,
  generateDpxList,
  view,
  cancelDpxOrder,
  viewVehicleLocation,
  updateLatLon,
  cancelOrderPendingDPXStatus,
} from "#/api/dispatchSchedules";
import ExcelUploadButton from "@/components/ExcelUploadButton.vue";
import draggable from "vuedraggable";
// import { businessId } from "@/api/pFile"

export default {
  props: {
    id: String,
  },
  components: { selectOrder, draggable, ExcelUploadButton },
  created() {
    // 查询车牌号列表
    pageList({ pageIndex: 1, pageSize: 1000, vehicleStatus: 1 }).then((res) => {
      this.plateList = res.data.map((d) => ({
        label: d.plateNo,
        value: d.vehicleId,
      }));
    });
    this.getEOrderList("0");
  },
  mounted() {
    // 在一段延迟后再渲染地图
    setTimeout(() => {
      this.mapReady = true;

      // 地图加载完成后执行
      this.$nextTick(() => {
        if (this.$refs.map) {
          this.$refs.map.$on("ready", () => {
            this.map = this.$refs.map.map;
            // 手动设置浅色地图样式
            try {
              // 注意：百度地图API可能要求在map实例上直接设置
              if (this.map && this.map.setMapStyle) {
                this.map.setMapStyle({ style: "light" });
              }
            } catch (e) {
              console.error("设置地图样式失败:", e);
            }

            // 再延迟加载地图上的标记等组件
            setTimeout(() => {
              this.mapComponentsReady = true;
            }, 500);
          });
        }
      });
    }, 500);
  },
  data() {
    return {
      wrongOrderList: [],
      defaultHeight: 48,
      currentOrder: "",
      curWrongOrder: {},
      eOrderList: [],
      plateList: [],
      uploadResult: null,
      plateNos: "",
      pathList: [],
      scheduleId: "",
      tab: "0",
      checked: true,
      disabled: false,
      mapReady: false,
      mapComponentsReady: false,
      repareDlgVisible: false,
      map: null,
      labelStyle: {
        color: "red",
        fontSize: "11px",
        width: "18px",
        height: "18px",
        "line-height": "14px",
        "border-radius": "12px",
        "text-align": "center",
      },
      start: {},
      dragOptions: {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost",
        dragClass: "drag",
      },
      lngLatForm: {
        longitude: "",
        latitude: "",
      },
      lngLatRules: {
        longitude: [
          { required: true, message: "请输入经度", trigger: "blur" },
          {
            type: "number",
            message: "经度必须为数字值",
            trigger: "blur",
            transform: (value) => Number(value),
          },
          {
            validator: (rule, value, callback) => {
              if (value && (value < -180 || value > 180)) {
                callback(new Error("经度范围为-180到180之间"));
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
        ],
        latitude: [
          { required: true, message: "请输入纬度", trigger: "blur" },
          {
            type: "number",
            message: "纬度必须为数字值",
            trigger: "blur",
            transform: (value) => Number(value),
          },
          {
            validator: (rule, value, callback) => {
              if (value && (value < -90 || value > 90)) {
                callback(new Error("纬度范围为-90到90之间"));
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
        ],
      },
      submitLoading: false,
    };
  },
  computed: {
    validOrderList() {
      return this.eOrderList.filter((o) =>
        this.isValidPosition({ lng: o.longitude, lat: o.latitude })
      );
    },
    selectedOrderCount() {
      return this.eOrderList.filter((o) => o.checked).length;
    },
  },
  methods: {
    isValidPosition(pos) {
      return pos && pos.lng && pos.lat && !isNaN(pos.lng) && !isNaN(pos.lat);
    },
    // 导入订单
    fecthData() {
      this.getEOrderList("0");
      this.disabled = true;
      // 查看渲染已存在的排线（地图上的点）
      view({ scheduleId: this.scheduleId }).then((res) => {
        this.plateNos = res.data.plateNo;
        if (res.data.longitude && res.data.latitude) {
          this.start = { lng: res.data.longitude, lat: res.data.latitude };
        }
      });
    },
    // 上传成功回调
    handleAutoUploadSuccess(response) {
      console.log("上传成功:", response);
      this.defaultHeight = 82;
    },
    // 上传失败回调
    handleError(error) {
      console.error("上传失败:", error);

      this.defaultHeight = 82;
    },
    // 文件移除回调
    handleFileRemove() {
      this.defaultHeight = 48;
    },
    // 选择车牌号后自动排序
    onChangeSelectCph(val) {
      const pxOrderList = this.validOrderList.filter((o) => o.checked);
      const unSelectOrderList = this.validOrderList.filter((o) => !o.checked);
      if (pxOrderList.length > 0 && this.plateNos) {
        this.plateNos = val;
        generate({
          orderList: pxOrderList,
          plateNo: val.label,
        }).then((res) => {
          this.eOrderList = [
            ...res.data.map((o) => ({
              ...o,
              checked: true,
            })),
            ...unSelectOrderList,
          ];
          viewVehicleLocation(val.value).then((res) => {
            this.start = { lng: res.data.longitude, lat: res.data.latitude };
          });
        });
      } else if (pxOrderList.length > 0) {
        this.toast("请选择车辆", "warning");
        this.plateNos = null;
      } else {
        this.toast("请选择待排线订单", "warning");
        this.plateNos = null;
      }
    },
    onClickRepareLngLat(o) {
      this.curWrongOrder = o;
      this.lngLatForm.longitude = this.curWrongOrder.longitude;
      this.lngLatForm.latitude = this.curWrongOrder.latitude;
      this.repareDlgVisible = true;
      // 重置表单
      this.$nextTick(() => {
        if (this.$refs.lngLatForm) {
          this.$refs.lngLatForm.resetFields();
        }
      });
    },
    changeQx() {
      this.eOrderList.forEach((o) => {
        o.checked = this.checked;
      });
    },
    getEOrderList(tab) {
      this.tab = tab;
      if (tab == "4") {
        this.eOrderList = this.wrongOrderList;
      } else {
        const scheduleId = tab === "0" ? "" : this.scheduleId;
        dpxList({
          tab,
          pageIndex: 1,
          pageSize: 1000,
          scheduleId: scheduleId,
        }).then((res) => {
          res.data.forEach((o) => {
            o.checked = false; // 每次刷新时重置选择状态
          });
          this.eOrderList = res.data;
          this.checked = false; // 重置全选状态

          if (tab === "0" && !this.scheduleId) {
            this.wrongOrderList = this.eOrderList.filter(
              (item) =>
                !this.isValidPosition({
                  lng: item.longitude,
                  lat: item.latitude,
                })
            );
            console.log(this.wrongOrderList);
          }

          // 如果是已排线状态，获取排程详情信息
          if (tab === "2" && this.scheduleId) {
            view({ scheduleId: this.scheduleId })
              .then((viewRes) => {
                if (viewRes.data) {
                  this.plateNos = viewRes.data.plateNo;
                  if (viewRes.data.longitude && viewRes.data.latitude) {
                    this.start = {
                      lng: viewRes.data.longitude,
                      lat: viewRes.data.latitude,
                    };
                  }
                }
              })
              .catch((err) => {
                console.error("获取排程详情失败:", err);
              });
          }
        });
      }
    },

    // 选择订单
    xzdd() {
      // if (!this.plateNos) {
      //   return this.toast("请先选择车辆", "error")
      // }
      this.$refs.saveDialog.dialogVisible = true;
    },
    confirmXzdd() {
      if (this.$refs.saveItemForm.multipleSelection.length == 0) {
        return this.toast("请选择订单", "error");
      }
      this.$refs.saveDialog.dialogVisible = false;
      const keyMap = {
        orderNumber: "orderNo",
        merchantName: "merName",
        userNickname: "realName",
        creationTime: "creationTime",
        deliveryAddress: "userAddress",
        actualPaymentAmount: "payPrice",
        totalCost: "totalPrice",
      };
      generateDpxList({
        orderList: this.$refs.saveItemForm.multipleSelection.map((o) => {
          const newO = { ...o };
          Object.keys(keyMap).forEach((key) => {
            newO[keyMap[key]] = o[key];
          });
          return newO;
        }),
      }).then(() => {
        // 重新选择订单
        this.pathList = [];
        this.scheduleId = "";
        this.plateNos = null;
        this.getEOrderList("0");
      });
    },
    sc() {
      if (this.eOrderList.findIndex((o) => o.checked) == -1) {
        return this.toast("请选择订单", "error");
      }
      if (!this.plateNos) {
        return this.toast("请选择车辆", "error");
      }
      save({
        orderList: this.eOrderList
          .filter((o) => o.checked)
          .map((o, index) => ({
            latitude: o.latitude,
            longitude: o.longitude,
            orderNo: o.orderNo,
            payPrice: o.payPrice,
            userAddress: o.userAddress,
            sort: index + 1,
          })),
        plateNo: this.plateNos.label,
      }).then((res) => {
        this.toast("生成成功", "success");
        // 设置排程ID
        this.scheduleId = res.data[0].scheduleId;
        // 保存车牌号信息
        this.plateNos = this.plateNos.label;
        // 切换到已排线状态并刷新列表
        this.getEOrderList("2");
        // 解析路径信息并绘制地图
        this.parsePath(res.data);
        // 刷新车牌号列表
        pageList({ pageIndex: 1, pageSize: 1000, vehicleStatus: 1 }).then(
          (res) => {
            this.plateList = res.data.map((d) => ({
              label: d.plateNo,
              value: d.vehicleId,
            }));
          }
        );
        // this.$emit('goDetail', { scheduleId })
      });
    },
    // 解析生产排线路径
    parsePath(data) {
      data.forEach((rs) => {
        try {
          const t = [];
          const routesData = JSON.parse(rs.routes);
          if (
            routesData &&
            routesData.steps &&
            Array.isArray(routesData.steps)
          ) {
            routesData.steps.forEach((step) => {
              if (step && step.path) {
                step.path.split(";").forEach((path) => {
                  const p = path.split(",");
                  if (
                    p.length >= 2 &&
                    !isNaN(parseFloat(p[0])) &&
                    !isNaN(parseFloat(p[1]))
                  ) {
                    t.push({
                      lng: parseFloat(p[0]),
                      lat: parseFloat(p[1]),
                    });
                  }
                });
              }
            });
          }
          this.pathList = this.pathList.concat(t);
        } catch (e) {
          console.error("路径数据解析错误:", e);
          this.pathList = [];
        }
      });
    },
    del() {
      const cancelList = this.eOrderList.filter((o) => o.checked);
      this.alert("确定取消待排线订单吗？", "取消", {
        type: "warning",
        request: () => {
          return cancelDpxOrder({
            orderList: cancelList,
          });
        },
        success: () => {
          this.toast("取消成功", "success");
          this.getEOrderList("0");
        },
      });
    },
    submitLngLat() {
      this.$refs.lngLatForm.validate((valid) => {
        if (valid) {
          this.submitLoading = true;

          // 找到当前选中的订单
          const currentOrderObj = this.eOrderList.find(
            (o) => o.orderNo === this.currentOrder
          );

          if (!currentOrderObj) {
            this.$message.error("未找到当前订单信息");
            this.submitLoading = false;
            return;
          }

          // 调用接口更新经纬度
          updateLatLon(
            currentOrderObj.orderNo,
            this.lngLatForm.latitude,
            this.lngLatForm.longitude
          )
            .then((res) => {
              this.$message.success("经纬度更新成功");

              // 更新当前订单的经纬度
              currentOrderObj.longitude = this.lngLatForm.longitude;
              currentOrderObj.latitude = this.lngLatForm.latitude;

              // 从错误订单列表中移除
              const wrongIndex = this.wrongOrderList.findIndex(
                (o) => o.orderNo === this.currentOrder
              );
              if (wrongIndex > -1) {
                this.wrongOrderList.splice(wrongIndex, 1);
              }

              this.repareDlgVisible = false;
              this.submitLoading = false;
            })
            .catch((err) => {
              this.$message.error("更新失败: " + (err.message || "未知错误"));
              this.submitLoading = false;
            });
        }
      });
    },
    // 删除已排线的订单
    deleteSelectedOrders() {
      const selectedOrders = this.eOrderList.filter((o) => o.checked);
      if (selectedOrders.length === 0) {
        this.toast("请选择要删除的订单", "warning");
        return;
      }

      // 获取当前排程的车牌号
      if (!this.plateNos) {
        this.toast("未找到车牌号信息", "error");
        return;
      }

      // 准备删除的订单列表（要删除的订单）
      const deleteOrderList = selectedOrders.map((o) => ({
        createTime: o.createTime,
        id: o.id,
        latitude: o.latitude,
        longitude: o.longitude,
        merName: o.merName,
        orderNo: o.orderNo,
        payPrice: o.payPrice,
        realName: o.realName,
        sort: o.sort,
        totalNum: o.totalNum,
        totalPrice: o.totalPrice,
        userAddress: o.userAddress,
        userPhone: o.userPhone,
      }));

      // 准备剩余的订单列表（未被删除的订单）
      const remainingOrders = this.eOrderList.filter((o) => !o.checked);
      const orderList = remainingOrders.map((o, index) => ({
        createTime: o.createTime,
        id: o.id,
        latitude: o.latitude,
        longitude: o.longitude,
        merName: o.merName,
        orderNo: o.orderNo,
        payPrice: o.payPrice,
        realName: o.realName,
        sort: index + 1, // 重新排序
        totalNum: o.totalNum,
        totalPrice: o.totalPrice,
        userAddress: o.userAddress,
        userPhone: o.userPhone,
      }));

      this.alert(
        `确定删除选中的 ${selectedOrders.length} 个订单吗？`,
        "删除订单",
        {
          type: "warning",
          request: () => {
            return cancelOrderPendingDPXStatus({
              deleteOrderList: deleteOrderList,
              orderList: orderList,
              plateNo:
                typeof this.plateNos === "string"
                  ? this.plateNos
                  : this.plateNos.label,
              scheduleId: this.scheduleId,
            });
          },
          success: () => {
            this.toast("删除成功", "success");
            // 刷新已排线列表
            this.getEOrderList("2");
            // 更新地图绘制
            this.pathList = [];
            // 重新获取路径信息
            if (this.scheduleId) {
              view({ scheduleId: this.scheduleId }).then((res) => {
                if (res.data && res.data.list && res.data.list.length > 0) {
                  this.parsePath(res.data.list);
                }
              });
            }
          },
        }
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.lcbrwgl-c {
  width: 100% !important;
  height: calc(100vh - 100px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #fff;

  .lcbrwgl-header {
    padding: 0px 16px 0 16px;
    background: #fff;
    flex-grow: 0;
    flex-shrink: 0;
    display: flex;

    // height: 48px;
    .title {
      cursor: pointer;
      display: flex;
      align-items: center;
      font-size: 18px;
    }
  }

  .lcbrwgl-body {
    background: #fff;
    flex-grow: 1;
    flex-shrink: 1;
    overflow: auto;
    display: flex;
    padding: 12px;

    .lcbrwgl-dt {
      flex: 1 1 auto;
      background: #f4f4f4;
      height: calc(100% - 16px);
    }

    .lcbrwgl-dd {
      width: 340px;
      flex: 0 0 auto;
      background: #fafafa;
      height: calc(100% - 16px);
      display: flex;
      flex-direction: column;

      .lcbrwgl-dd-h {
        flex: 0 0 auto;
        display: flex;

        .status-item {
          width: 34%;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #f0f0f0;
          height: 48px;
          font-size: 18px;
          cursor: pointer;
        }

        .status-item.active {
          color: #3363ff;
          background: #ffffff;
        }
      }

      .lcbrwgl-dd-f {
        // flex: 0 0 auto;
        background: #f0f0f0;
        height: 40px;
        width: 100%;
        padding: 0 12px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .lcbrwgl-dd-b {
        flex: 1 1 auto;
        overflow-x: hidden;
        overflow-y: auto;
      }

      .order-item {
        padding: 12px;
        border-bottom: #ddd 1px solid;
        left: 16px;
        cursor: pointer;

        .ddxh {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .ddh {
          color: #777;
        }

        .ddhh {
          color: #333;
        }
      }

      .order-item.active {
        background: #c7e5f7;

        .ddh {
          color: #555;
        }

        .ddhh {
          color: #000;
        }
      }
    }
  }
}

.zwsj {
  width: 100%;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: #999;
}
</style>
