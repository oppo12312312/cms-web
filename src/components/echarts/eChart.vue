<template>
  <div class="chart-container" v-loading="isLoading">
    <!-- <div class="echarts" :id="chartId" @click="handleOpen"></div> -->
    <div
      class="echarts"
      v-show="!isEmptyObject(echartOpts)"
      :id="chartId"
    ></div>
    <div style="height: 100%; display: flex" v-show="isEmptyObject(echartOpts)">
      <div style="margin: auto">
        <img style="display: block" src="@p/static/imgs/no_data.png" />
        <p class="txt-center">暂无数据</p>
      </div>
    </div>
  </div>
</template>
<script>
import Echarts from "echarts";

export default {
  data() {
    return {
      myChart: {},
      chartId: "",
    };
  },
  props: {
    echartOpts: {
      type: Object,
      default: {},
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    canClick: {
      type: Boolean,
      default: false,
    },
    labelClick: {
      type: Boolean,
      default: false,
    },
  },
  created() {
    this.chartId = Number(
      Math.random().toString().substr(3, 10) + Date.now()
    ).toString(36);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resize);
  },
  destroyed() {
    window.removeEventListener("resize", this.resize);
  },
  watch: {
    echartOpts: {
      handler() {
        const _this = this;
        this.$nextTick(() => {
          this.loadEchart();
          window.addEventListener("resize", () => {
            _this.myChart.resize();
          });
        });
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    loadEchart() {
      const chartDom = document.getElementById(this.chartId);
      if (!chartDom) {
        return;
      }
      Echarts.dispose(chartDom);
      this.myChart = Echarts.init(chartDom);
      this.myChart.setOption(this.echartOpts);
      const me = this;
      if (this.canClick) {
        this.myChart.on("click", function (params) {
          me.$emit("handleOpen", params);
        });
      }
      if (this.labelClick) {
        this.myChart.on("click", "series.pie", function (params) {
          me.$emit("handleLabel", params);
        });
      }
    },
    resize() {
      this.myChart.resize();
    },
  },
};
</script>
<style lang="scss">
.chart-container {
  width: 100%;
  height: 100%;

  .echarts {
    width: 100%;
    height: 100%;
  }
}
</style>
