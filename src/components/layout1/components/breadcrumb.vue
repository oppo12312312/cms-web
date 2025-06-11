<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <el-breadcrumb-item
      v-for="(item, i) in levelList"
      :key="i"
      v-show="item.meta.title"
    >
      <router-link :to="item.path">{{ item.meta.title }}</router-link>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>
<script>
export default {
  data() {
    return {
      levelList: null,
    };
  },
  watch: {
    $route(to, from) {
      this.getBreadcrumb();
    },
  },
  mounted() {
    this.getBreadcrumb();
  },
  methods: {
    /**
     * 生成面包屑的方法
     */
    getBreadcrumb() {
      const matched = this.$route.matched.filter((item) => item.name);
      matched.forEach((m) => {
        m.path = m.meta.activeMenu || this.$route.path;
      });
      this.levelList = matched;
    },
  },
};
</script>
<style lang="scss"></style>
