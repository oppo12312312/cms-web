<template>
  <el-button type="text" @click="getData">
    <img class="icon-img" src="@p/static/imgs/dayin.png" />
    {{ title }}
    <vue-easy-print ref="easyPrint">
      <div id="printTable" v-show="true">
        <slot></slot>
      </div>
    </vue-easy-print>
  </el-button>
</template>

<script>
import vueEasyPrint from "_c/vueEasyPrint";
export default {
  components: {
    vueEasyPrint,
  },
  props: {
    title: { type: String, default: "打印" },
  },
  methods: {
    getData() {
      this.$emit("handleClick");
    },
    print() {
      this.$nextTick(() => {
        this.$refs.easyPrint.print();
      });
    },
  },
};
</script>
<style scoped>
/* @page {
  size: auto A4 landscape;
  margin: 3mm;
} */
</style>
