<template>
  <div>
    <div style="animation-duration: 800ms" :class="{ fadeIn: !isCollapse }">
      <!-- <h1 class="webTitle" v-show="!isCollapse">{{title}}</h1> -->
      <el-scrollbar wrap-class="scrollbar-wrapper">
        <el-menu
          class="el-menu-vertical"
          :unique-opened="true"
          :collapse="isCollapse"
          mode="vertical"
          :default-active="activeMenu"
          :collapse-transition="false"
        >
          <sidebar-item
            v-for="route in services"
            :key="route.path"
            :item="route"
            :base-path="route.path"
            :opened="opened"
          ></sidebar-item>
        </el-menu>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import sidebarItem from "./components/sidebarItem";
import { mapGetters } from "vuex";

export default {
  props: {
    opened: {
      type: Boolean,
      default: true,
    },
    title: {
      type: String,
    },
  },
  components: {
    sidebarItem,
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["services"]),
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
    isCollapse() {
      return !this.opened;
    },
  },
};
</script>
<style lang="scss"></style>
