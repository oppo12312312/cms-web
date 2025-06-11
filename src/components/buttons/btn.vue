<template>
  <el-button
    :size="size"
    :icon="comIcon"
    :type="getType()"
    @click.stop="handleClick"
  >
    {{ getTxt() }}
  </el-button>
</template>

<script>
export default {
  props: {
    type: { type: String, default: "add" },
    txt: { type: String },
    icon: { type: String },
    size: {
      type: String,
      default: "middle",
    },
  },
  data() {
    return {};
  },
  computed: {
    comIcon() {
      if (this.icon) {
        return this.icon;
      } else {
        switch (this.type) {
          case "add":
            return "el-icon-plus";
          case "edit":
            return "el-icon-edit";
          case "del":
            return "el-icon-delete";
          default:
            return this.icon || "";
        }
      }
    },
  },
  methods: {
    handleClick() {
      this.$emit("handleClick");
    },
    getType() {
      switch (this.type) {
        case "add":
          return "primary";
        case "edit":
          return "success";
        case "del":
          return "default";
        default:
          return this.type;
      }
    },
    getTxt() {
      if (this.txt) {
        return this.txt;
      } else {
        switch (this.type) {
          case "add":
            return "新增";
          case "edit":
            return "编辑";
          case "del":
            return "删除";
        }
      }
    },
  },
};
</script>

<style lang="scss"></style>
