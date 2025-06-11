<template>
  <div>
    <template v-if="hasOneShowingChild(item)">
      <router-link
        v-if="!item.meta.hidden"
        class="title"
        active-class="active"
        :key="item.name"
        :to="{ name: item.name }"
      >
        <el-menu-item
          :index="resolvePath(item.redirect ? item.redirect : item.path)"
        >
          <!-- <i :class="[item.meta.icon]"></i> -->
          <template v-if="item.meta.icon">
            <img
              :src="require(`@p/static/imgs/${item.meta.icon}.png`)"
              class="item-svg"
            />
          </template>
          <span slot="title" v-show="opened">{{ item.meta.title }}</span>
        </el-menu-item>
      </router-link>
    </template>

    <el-submenu v-else ref="subMenu" :index="resolvePath(item.path)">
      <template slot="title">
        <template v-if="item.meta.icon">
          <img
            :src="require(`@p/static/imgs/${item.meta.icon}.png`)"
            class="item-svg"
          />
        </template>
        <span v-show="opened" slot="title">{{ item.meta.title }}</span>
      </template>
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :item="child"
        :base-path="basePath"
      ></sidebar-item>
    </el-submenu>
  </div>
</template>

<script>
import path from "path";
import { isExternal } from "@/utils/util";

export default {
  name: "sidebarItem",
  props: {
    item: {
      type: Object,
      required: true,
    },
    basePath: {
      type: String,
      default: "",
    },
    opened: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {};
  },
  methods: {
    hasOneShowingChild(route) {
      if (route.children && route.children.length) {
        const shows = route.children.filter((item) => {
          return !item.meta.hidden;
        });
        if (shows.length && shows.length > 0) {
          return false;
        } else {
          return true;
        }
      } else {
        return true;
      }
    },
    resolvePath(routePath) {
      if (isExternal(routePath)) {
        return routePath;
      }
      if (isExternal(this.basePath)) {
        return this.basePath;
      }
      return path.resolve(this.basePath, routePath);
    },
  },
};
</script>
<style lang="scss" scoped>
.iconfont {
  vertical-align: middle;
  margin-right: 5px;
  // width: 24px;
  padding: 0 3px;
  text-align: center;
  font-size: 18px;
}
.item-svg {
  width: 16px;
  height: 16px;
  margin-right: 8px;
}
</style>
