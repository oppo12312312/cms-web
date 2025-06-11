<template>
  <layout></layout>
</template>

<script>
import { mapGetters } from "vuex";
import { mapActions } from "vuex";
import layout from "./components/layout";

export default {
  components: {
    layout,
  },
  computed: {
    ...mapGetters(["logined"]),
  },

  created() {},
  methods: {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss"></style>
