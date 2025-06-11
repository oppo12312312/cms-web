<template>
  <div class="chart-container" v-loading="isLoading">
    <div class="echarts" :id="chartId"></div>
  </div>
</template>
<script>
import Echarts from "echarts";
import china from "echarts/map/js/china.js";

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
  },
  created() {
    this.chartId = Number(
      Math.random().toString().substr(3, length) + Date.now()
    ).toString(36);
  },
  mounted() {
    const _this = this;
    this.$nextTick(() => {
      this.loadEchart();
      window.addEventListener("resize", this.resize);
    });
  },
  destroyed() {
    console.log("destroyed");
    const _this = this;
    window.removeEventListener("resize", this.resize);
  },
  watch: {
    echartOpts: function () {
      const _this = this;
      this.$nextTick(() => {
        this.loadEchart();
        window.addEventListener("resize", this.resize);
      });
    },
  },
  methods: {
    loadEchart() {
      this.myChart = Echarts.init(document.getElementById(this.chartId));
      this.myChart.setOption(this.echartOpts);
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
