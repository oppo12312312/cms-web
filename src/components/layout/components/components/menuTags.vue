<template>
  <scroll-pane ref="scrollPane" class="tags-view-wrapper">
    <span
      class="tags-view-item"
      v-for="(view, index) in tag_views"
      :key="index"
    >
      <router-link exact-active-class="active" :to="{ name: view.name }">{{
        view.title
      }}</router-link>
      <i
        v-if="index > 0"
        @click="delRoute(view, index)"
        class="el-icon-close"
      ></i>
    </span>
  </scroll-pane>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import scrollPane from "_c/scrollPane";

export default {
  components: {
    scrollPane,
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["tag_views"]),
  },
  methods: {
    ...mapActions(["delView"]),
    handleScroll(e) {
      const eventDelta = e.wheelDelta || -e.deltaY * 40;
      const $scrollWrapper = this.scrollWrapper;
      $scrollWrapper.scrollLeft = $scrollWrapper.scrollLeft + eventDelta / 4;
    },
    delRoute(view, index) {
      const me = this;
      this.delView(index).then(() => {
        if (view.name == me.$route.name) {
          me.$router.push({ name: me.tag_views[me.tag_views.length - 1].name });
        }
      });
    },
  },
};
</script>
<style lang="scss"></style>
