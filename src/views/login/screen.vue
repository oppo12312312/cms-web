<template>
  <div class="cl-c">
    <div
      v-for="(s, i) in screens"
      :key="i"
      class="screen"
      :style="{
        width: `${s.widthPx}px`,
        height: `${s.heightPx}px`,
      }"
    >
      {{ s.size }}寸({{ s.resolution }})
    </div>
    <el-button type="primary" @click="drawer = true" style="margin: 16px"
      >设置</el-button
    >
    <el-drawer
      title="屏幕"
      ref="theme"
      :visible.sync="drawer"
      direction="rtl"
      size="1200px"
      :append-to-body="true"
      :destroy-on-close="true"
    >
      <div class="drawer-c">
        <div style="margin-bottom: 8px">
          视窗分辨率：{{ width }} * {{ height }}
          <el-button
            type="primary"
            size="mini"
            @click="phone"
            style="margin-left: 16px"
            >手机</el-button
          >
          <el-button
            type="primary"
            size="mini"
            @click="pc"
            style="margin-left: 16px"
            >电脑</el-button
          >
        </div>
        <div class="bxsqcs">
          ㅤㅤㅤㅤㅤㅤㅤㅤ
          <div class="srk-t">屏幕尺寸</div>
          <div class="srk-t">屏幕横向分辨率</div>
          <div class="srk-t">屏幕纵向分辨率</div>
        </div>
        <div class="bxsqcs">
          本机显示器参数：
          <el-input
            type="number"
            v-model="bjSize"
            @change="setCkSize"
            autocomplete="off"
            placeholder="屏幕尺寸"
            class="srk"
          ></el-input>
          <el-input
            type="number"
            v-model="bjWidth"
            @change="setCkSize"
            autocomplete="off"
            placeholder="屏幕横向分辨率"
            class="srk"
          ></el-input>
          <el-input
            type="number"
            v-model="bjHeight"
            @change="setCkSize"
            autocomplete="off"
            placeholder="屏幕纵向分辨率"
            class="srk"
          ></el-input>
        </div>
        <div class="bxsqcs">
          对比显示器参数：
          <el-input
            type="number"
            v-model="dbSize"
            autocomplete="off"
            placeholder="屏幕尺寸"
            class="srk"
          ></el-input>
          <el-input
            type="number"
            v-model="dbWidth"
            autocomplete="off"
            placeholder="屏幕横向分辨率"
            class="srk"
          ></el-input>
          <el-input
            type="number"
            v-model="dbHeight"
            autocomplete="off"
            placeholder="屏幕纵向分辨率"
            class="srk"
          ></el-input>
          <el-button type="primary" @click="addScreen" style="margin: 16px"
            >添加</el-button
          >
        </div>
        <div class="dbcs">
          {{ width }} * {{ height }}
          <el-table :data="screenList" style="width: 100%" size="small">
            <el-table-column
              label="屏幕尺寸"
              width="80"
              prop="size"
            ></el-table-column>
            <el-table-column
              label="分辨率"
              width="120"
              prop="resolution"
            ></el-table-column>
            <el-table-column label="长（英寸）" width="85" prop="width">
              <template slot-scope="scope">{{
                scope.row.width && scope.row.width.toFixed(2)
              }}</template>
            </el-table-column>
            <el-table-column label="宽（英寸）" width="85" prop="height">
              <template slot-scope="scope">{{
                scope.row.height && scope.row.height.toFixed(2)
              }}</template>
            </el-table-column>
            <el-table-column label="面积（英寸²）" width="100" prop="area">
              <template slot-scope="scope">{{
                scope.row.area && scope.row.area.toFixed(2)
              }}</template>
            </el-table-column>
            <el-table-column label="长（厘米）" width="85" prop="widthCM">
              <template slot-scope="scope">{{
                scope.row.widthCM && scope.row.widthCM.toFixed(2)
              }}</template>
            </el-table-column>
            <el-table-column label="宽（厘米）" width="85" prop="heightCM">
              <template slot-scope="scope">{{
                scope.row.heightCM && scope.row.heightCM.toFixed(2)
              }}</template>
            </el-table-column>
            <el-table-column label="面积（厘米²）" width="100" prop="areaCM">
              <template slot-scope="scope">{{
                scope.row.areaCM && scope.row.areaCM.toFixed(2)
              }}</template>
            </el-table-column>
            <el-table-column label="PPI" width="85" prop="ppi">
              <template slot-scope="scope">{{
                scope.row.ppi && scope.row.ppi.toFixed(0)
              }}</template>
            </el-table-column>
            <el-table-column label="面积比例" width="100" prop="ppi">
              <template slot-scope="scope"
                >{{ ((scope.row.area / area) * 100).toFixed(2) }}%</template
              >
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <div style="display: flex">
                  <div
                    @click="screenList.splice(scope.$index, 1)"
                    class="czbtn"
                  >
                    删除
                  </div>
                  <div @click="scope.row.show = !scope.row.show" class="czbtn">
                    {{ scope.row.show ? "隐藏" : "显示" }}
                  </div>
                  <div @click="area = scope.row.area" class="czbtn">
                    设为标准
                  </div>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: "screen",
  data() {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
      drawer: true,
      bjSize: 23.8,
      bjWidth: 1920,
      bjHeight: 1080,

      ckWidth: 0,
      ckHeight: 0,

      dbSize: 17.3,
      dbWidth: 1920,
      dbHeight: 1080,
      area: 1,
      // screens: [
      //   { diagonal: 18, type: '16:10' },
      //   { diagonal: 17.3, type: '16:9' },
      //   { diagonal: 17, type: '16:10' },
      //   { diagonal: 16, type: '16:10' },
      //   { diagonal: 15.6, type: '16:9' },
      //   { diagonal: 14, type: '16:9' },
      //   { diagonal: 13.33, type: '16:10' },
      //   { diagonal: 13.3, type: '16:9' },
      //   { diagonal: 12.8, type: '16:9' },
      // ],
      screenList: [],
    };
  },
  computed: {
    screens() {
      return this.screenList
        .filter((s) => s.show)
        .map((screen) => {
          const temp = Object.assign({}, screen);
          temp.widthPx = (temp.width / this.ckWidth) * this.bjWidth;
          temp.heightPx = (temp.height / this.ckHeight) * this.bjHeight;
          return temp;
        });
    },
  },
  mounted() {
    this.setCkSize();
  },
  methods: {
    setCkSize() {
      if (this.bjSize && this.bjWidth && this.bjHeight) {
        const x = Math.sqrt(
          (this.bjSize * this.bjSize) /
            (this.bjWidth * this.bjWidth + this.bjHeight * this.bjHeight)
        );
        this.ckWidth = this.bjWidth * x;
        this.ckHeight = this.bjHeight * x;
      } else {
        this.ckWidth = 0;
        this.ckHeight = 0;
      }
    },
    getSize(diagonal, type = "16:9") {
      if (type == "16:9") {
        const x = Math.sqrt((diagonal * diagonal) / 337) * 2.54;
        return { width: 16 * x, height: 9 * x };
      } else if (type == "16:10") {
        const x = Math.sqrt((diagonal * diagonal) / 356) * 2.54;
        return { width: 16 * x, height: 10 * x };
      } else {
        return { width: 0, height: 0 };
      }
    },
    addScreen() {
      if (this.dbSize && this.dbWidth && this.dbHeight) {
        this.screenList.push(
          this.getScreen(this.dbSize, this.dbWidth, this.dbHeight)
        );
        this.dbSize = "";
        this.dbWidth = "";
        this.dbHeight = "";
      }
    },
    getScreen(s, w, h) {
      const x = Math.sqrt((s * s) / (w * w + h * h));
      return {
        size: s,
        ppi: 1 / x,
        width: w * x,
        height: h * x,
        area: w * x * h * x,
        widthCM: w * x * 2.54,
        heightCM: h * x * 2.54,
        areaCM: w * x * 2.54 * h * x * 2.54,
        resolution: `${w}*${h}`,
        resolutionWidth: w,
        resolutionHeight: h,
        show: false,
      };
    },
    phone() {
      this.screenList = [];
      const list = [
        { s: 6.28, w: 1080, h: 2400 },
        { s: 6.53, w: 1080, h: 2340 },
        { s: 6.67, w: 1220, h: 2712 },
        { s: 6.78, w: 1260, h: 2800 },
      ];
      list.forEach((l) => {
        this.screenList.push(this.getScreen(l.s, l.w, l.h));
      });
    },
    pc() {
      this.screenList = [];
      const list = [
        { s: 13.3, w: 1920, h: 1080 },
        { s: 13.3, w: 1920, h: 1200 },
        { s: 14, w: 1920, h: 1080 },
        { s: 14.5, w: 1920, h: 1200 },
        { s: 15.6, w: 1920, h: 1080 },
        { s: 16, w: 1920, h: 1200 },
        { s: 17, w: 1920, h: 1200 },
        { s: 17.3, w: 1920, h: 1080 },
        { s: 18, w: 1920, h: 1200 },
      ];
      list.forEach((l) => {
        this.screenList.push(this.getScreen(l.s, l.w, l.h));
      });
    },
  },
};
</script>

<style lang="scss">
.cl-c {
  width: 100%;
  height: 100%;
  background: #fff;
  position: relative;
  .screen {
    box-sizing: border-box;
    background: rgba(100, 100, 100, 0.2);
    border: red 1px solid;
    position: absolute;
    left: 0;
    bottom: 0;
  }
}
.drawer-c {
  width: 100%;
  height: 100%;
  padding: 16px;
  .bxsqcs {
    display: flex;
    align-items: center;
    font-size: 16px;
  }
  .srk {
    width: 150px;
    margin-left: 8px;
  }
  .srk-t {
    width: 150px;
    margin-left: 8px;
    margin-bottom: 8px;
    color: #999;
    font-size: 12px;
  }
}
.dbcs {
}
.czbtn {
  color: blue;
  cursor: pointer;
  margin-right: 8px;
}
</style>
