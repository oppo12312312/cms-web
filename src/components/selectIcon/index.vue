<template>
  <el-popover trigger="click" v-model="visible" placement="bottom-start">
    <ul class="iconlist">
      <li v-for="item in iconList" :key="item.id" @click="selectIcon(item)">
        <el-image
          style="width: 32px; height: 32px"
          :src="require(`@p/static/imgs/icons/${item.id}.png`)"
        ></el-image>
      </li>
    </ul>
    <el-button slot="reference">
      <span v-if="!value">选择</span>
      <el-image
        v-else
        style="width: 20px; height: 20px"
        :src="require(`@p/static/imgs/icons/${value}.png`)"
      ></el-image>
    </el-button>
  </el-popover>
</template>

<script>
export default {
  model: {
    prop: "value",
    event: "change",
  },
  data() {
    return {
      visible: false,
    };
  },
  props: {
    value: [String, Number],
    iconList: {
      type: Array,
      default() {
        return Array.from({ length: 15 }).map((item, index) => {
          return {
            id: index + 1,
          };
        });
      },
    },
  },
  methods: {
    selectIcon(item) {
      this.$emit("change", item.id);
      this.visible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.iconlist {
  display: flex;
  flex-wrap: wrap;
  width: 240px;
  li {
    margin: 8px;
  }
}
.iconbtn {
  padding-top: 4px;
  padding-bottom: 4px !important;
}
</style>
