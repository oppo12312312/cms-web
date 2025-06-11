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
          >配送路线
        </div>
        <div style="display: flex">
          <div style="cursor: pointer">
            已排线：<span
              style="color: blue; cursor: pointer; font-size: 18px"
              >{{ ypx }}</span
            >
          </div>
          <div style="margin-left: 16px; cursor: pointer">
            配送中：<span
              style="color: green; cursor: pointer; font-size: 18px"
              >{{ psz }}</span
            >
          </div>
          <div style="margin-left: 16px; cursor: pointer">
            已收货：<span
              style="color: red; cursor: pointer; font-size: 18px"
              >{{ ysh }}</span
            >
          </div>
        </div>
      </div>
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
              v-for="(p, i) in validOrderList"
              :key="p.orderNo"
              :position="{ lng: p.longitude, lat: p.latitude }"
              :top="currentOrder == p.orderNo ? true : false"
              @click="currentOrder = p.orderNo"
            >
              <bm-info-window :show="currentOrder == p.orderNo">
                <div style="font-size: 12px; width: 220px">
                  订单号：{{ p.orderNo }}
                </div>
                <div
                  style="
                    font-size: 12px;
                    width: 220px;
                    margin-top: 4px;
                    line-height: 14px;
                  "
                >
                  地址：{{ p.deliveryAddress }}
                </div>
              </bm-info-window>
              <bm-label
                :content="i + 1 + ''"
                :labelStyle="labelStyle"
                :offset="{ width: 0, height: 1 }"
              />
            </bm-marker>

            <bm-polyline
              v-if="polylinePath && polylinePath.length > 0"
              :path="polylinePath"
              stroke-color="blue"
              :stroke-opacity="0.8"
              :stroke-weight="4"
            ></bm-polyline>

            <bm-marker
              v-if="isValidPosition(startP)"
              :position="startP"
              :icon="{
                url: './static/imgs/dest_markers.png',
                size: { width: 32, height: 32 },
              }"
              :zIndex="100"
            ></bm-marker>
          </template>
        </baidu-map>
      </div>
      <div class="lcbrwgl-dd">
        <div class="lcbrwgl-ddh">
          <!-- <el-select v-model="pathIndex" placeholder="请选择">
            <el-option v-for="(item, i) in pathList" :key="i" :label="'路线' + (i + 1)" :value="i"></el-option>
          </el-select> -->
        </div>
        <div class="lcbrwgl-ddh">
          <div style="display: flex; font-size: 16px; margin-bottom: 8px">
            <div style="color: #666; font-size: 14px">车辆容量（Kg）：</div>
            <div>{{ payload }}</div>
          </div>
          <div style="display: flex; font-size: 16px; margin-bottom: 8px">
            <div style="color: #666; font-size: 14px">关联配送车辆：</div>
            <div>{{ plateNo }}</div>
          </div>
          <div style="display: flex; font-size: 16px; margin-bottom: 8px">
            <div style="color: #666; font-size: 14px">关联配送司机：</div>
            <div>{{ driverTypeName }} {{ driverName }} {{ phone }}</div>
          </div>
          <div style="display: flex; font-size: 16px; margin-bottom: 8px">
            <div style="color: #666; font-size: 14px">配送总里程：</div>
            <div>{{ distance }}米</div>
          </div>
        </div>
        <div class="lcbrwgl-ddd">
          <div
            @click="currentOrder = p.orderNo"
            v-for="(p, i) in orderList"
            :key="p.orderNo"
            class="psdz-c"
            :class="{ active: currentOrder == p.orderNo }"
          >
            <div class="psdz-title">
              <div class="psdz-d"></div>
              第 {{ i + 1 }} 配送地址
            </div>
            <div class="psdz-info">订单号：{{ p.orderNo }}</div>
            <div class="psdz-info">{{ p.deliveryAddress }}</div>
            <!-- <div @click="ycdd(p.orderNo)" class="yc">移除</div> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { view, save } from "#/api/dispatchSchedules";

export default {
  props: {
    id: String,
  },
  components: {},
  data() {
    return {
      distance: 0,
      currentItem: {},
      start: { lng: 114.31, lat: 30.59 }, // 默认武汉坐标
      show: false,
      pathList: [],
      currentOrder: "",
      payload: 0,
      plateNo: "",
      driverTypeName: "",
      driverName: "",
      phone: "",
      ypx: 0,
      psz: 0,
      ysh: 0,
      map: null,
      mapReady: false,
      mapComponentsReady: false,
      labelStyle: {
        color: "red",
        fontSize: "11px",
        width: "18px",
        height: "18px",
        "line-height": "14px",
        "border-radius": "12px",
        "text-align": "center",
      },
      orderList: [],
    };
  },
  created() {
    this.getData();
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
  computed: {
    polylinePath() {
      let routes = [];
      this.pathList.forEach((step) => {
        this.distance += step.distance;
        step.routes.forEach((route) => {
          routes.push(route);
        });
      });
      return routes;
    },
    validOrderList() {
      return this.orderList.filter((p) =>
        this.isValidPosition({ lng: p.longitude, lat: p.latitude })
      );
    },
    startP() {
      return this.start && this.start.lng && this.start.lat
        ? this.start
        : { lng: 114.31, lat: 30.59 }; // 默认武汉坐标
    },
  },
  methods: {
    isValidPosition(pos) {
      return pos && pos.lng && pos.lat && !isNaN(pos.lng) && !isNaN(pos.lat);
    },
    getData() {
      view({ scheduleId: this.id })
        .then((res) => {
          if (res.data.longitude && res.data.latitude) {
            this.start = { lng: res.data.longitude, lat: res.data.latitude };
          }
          this.payload = res.data?.payload;
          this.plateNo = res.data?.plateNo;
          this.driverTypeName = res.data?.driverTypeName;
          this.driverName = res.data?.driverName;
          this.phone = res.data?.phone;
          this.ypx = res.data?.ypx || 0;
          this.psz = res.data?.psz || 0;
          this.ysh = res.data?.ywc || 0;

          if (res.data.routeSteps && Array.isArray(res.data.routeSteps)) {
            res.data.routeSteps.forEach((rs) => {
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
                rs.distance = routesData ? routesData.distance : 0;
                rs.routes = t;
              } catch (e) {
                console.error("路径数据解析错误:", e);
                rs.routes = [];
                rs.distance = 0;
              }
            });
            this.pathList = res.data.routeSteps;
          } else {
            this.pathList = [];
          }
          this.orderList = res.data.tmsDispatchSchedulesDetails;
          // 触发视图更新
          this.$nextTick(() => {
            if (this.map) {
              this.map.setZoom(14);
            }
          });
        })
        .catch((err) => {
          console.error("获取数据失败:", err);
          this.pathList = [];
        });
    },
    ycdd(orderNo) {
      this.alert("确定移除订单：<br />" + orderNo, "移除", {
        type: "warning",
        request: () => {
          return save({
            orderList: this.orderList.filter((p) => p.orderNo === orderNo),
            plateNo: this.plateNo,
            scheduleId: this.id,
          });
        },
        success: () => {
          this.toast("移除成功", "success");
          this.getData();
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.psdz-c {
  padding: 12px;
  cursor: pointer;
  position: relative;
  .yc {
    position: absolute;
    top: 8px;
    right: 8px;
    color: #3363ff;
    cursor: pointer;
  }
  .psdz-title {
    display: flex;
    align-items: center;
    font-size: 16px;
    .psdz-d {
      height: 6px;
      width: 6px;
      border-radius: 6px;
      background: #3363ff;
      margin-right: 8px;
    }
  }
  .psdz-info {
    font-size: 15px;
    color: #666;
    padding-left: 32px;
  }
}
.psdz-c.active {
  background: #c7e5f7;
  .psdz-title,
  .psdz-info {
    color: #000;
  }
}
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
    height: 48px;
    border-bottom: #ddd 1px solid;
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
    .lcbrwgl-dt {
      flex: 1 1 auto;
      background: #f4f4f4;
      height: calc(100% - 16px);
    }
    .lcbrwgl-dd {
      width: 360px;
      flex: 0 0 auto;
      background: #fafafa;
      height: calc(100% - 16px);
      display: flex;
      flex-direction: column;
      .lcbrwgl-ddh {
        flex: 0 0 auto;
        background: #ffffff;
        padding: 12px;
      }
      .lcbrwgl-ddd {
        flex: 1 1 auto;
        overflow-x: hidden;
        overflow-y: auto;
      }
    }
  }
}
</style>
