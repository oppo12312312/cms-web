<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "App",
  created() {
    this.getParam();
  },
  methods: {
    ...mapActions(["getParam"]),
  },
};
</script>
