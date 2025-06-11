<template>
  <ul v-loading="loading">
    <li>校级角色：</li>
    <li>校级角色：</li>
    <li>其他角色：</li>
  </ul>
</template>

<script>
import { findByResource } from "@/api/roleManage";
export default {
  props: {
    resourceid: String,
  },
  data() {
    return {
      loading: true,
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.loading = true;
      //   findByResource({ resourceid: this.resourceid }).then((data) => {
      //     this.loading = false;
      //   });
    },
  },
};
</script>

<style lang="scss"></style>
