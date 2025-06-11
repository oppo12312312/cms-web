<template>
  <div class="tags-wrap" v-if="show">
    <el-tag
      @click="sel(o)"
      :effect="selected.indexOf(o.value) > -1 ? 'dark' : 'light'"
      v-for="(o, index) in opts"
      :key="index"
      ><div :title="o.label">{{ o.label }}</div></el-tag
    >
  </div>
</template>
<script>
export default {
  props: {
    opts: Array,
    initId: String,
  },
  data() {
    return {
      selected: [],
      selArr: [],
      show: true,
    };
  },
  created() {
    if (this.initId) {
      for (const o of this.opts) {
        if (o.value == this.initId) {
          this.selected = [o.value];
          this.selArr = [o];
        }
      }
    }
  },
  methods: {
    sel(o) {
      this.selected = [o.value];
      this.selArr = [o];
    },
  },
};
</script>
<style lang="scss">
.tags-wrap {
  width: 600px;
  height: 400px;
  overflow-y: auto;
  overflow-x: hidden;
  .el-tag {
    width: 32%;
    margin-right: 1%;
    margin-bottom: 5px;
    cursor: pointer;
    white-space: nowrap;
    text-overflow: ellipsis;
    -o-text-overflow: ellipsis;
    overflow: hidden;
  }
}
</style>
