<template>
  <div class="app-breadcrumb-wrap">
    <el-collapse v-model="activeNames">
      <el-collapse-item name="1">
        <template slot="title">
          <el-breadcrumb class="app-breadcrumb" separator="/">
            <el-breadcrumb-item v-for="item in levelList" :key="item.path">
              <router-link :to="item.path">{{ item.meta.title }}</router-link>
            </el-breadcrumb-item>
          </el-breadcrumb>
        </template>
        <ul class="serives-wrap">
          <li
            v-show="!menu.meta.isHide"
            v-for="(menu, index) in menuList"
            :key="index"
          >
            <el-tag>
              <router-link
                :to="{ name: menu.name }"
                exact-active-class="active"
              >
                <el-image
                  style="width: 20px; vertical-align: middle"
                  :src="require(`@p/static/servicefont/${menu.meta.icon}.svg`)"
                  class="menu-icon"
                ></el-image>
                {{ menu.meta.title }}
              </router-link>
            </el-tag>
          </li>
        </ul>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      levelList: null,
      menuList: [],
      activeNames: ["1"],
    };
  },
  computed: {
    ...mapGetters(["services"]),
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
      const matched = this.$route.matched.filter(
        (item) => item.name && item.meta.title
      );
      this.levelList = matched;
      const parent = this.services.filter((item) => {
        return item.name == matched[0].name;
      });
      this.menuList = parent[0].children;
    },
  },
};
</script>
<style lang="scss">
.menu-icon {
  .el-image__inner {
    vertical-align: middle;
  }
}
</style>
