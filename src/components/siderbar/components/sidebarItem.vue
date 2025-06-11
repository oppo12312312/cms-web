<template>
  <div>
    <template v-if="hasOneShowingChild(item)">
      <router-link
        v-if="!item.meta.hidden"
        class="title"
        active-class="active"
        :to="{ name: item.name }"
      >
        <el-menu-item
          :index="resolvePath(item.redirect ? item.redirect : item.path)"
        >
          <el-image
            :src="require(`@p/static/servicefont/${item.meta.icon}.svg`)"
            class="item-svg_50"
          ></el-image>
          <span slot="title" v-show="opened">{{ item.meta.title }}</span>
        </el-menu-item>
      </router-link>
    </template>

    <el-submenu v-else ref="subMenu" :index="resolvePath(item.path)">
      <template slot="title">
        <el-image
          :src="require(`@p/static/servicefont/${item.meta.icon}.svg`)"
          class="item-svg_50"
        ></el-image>

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
