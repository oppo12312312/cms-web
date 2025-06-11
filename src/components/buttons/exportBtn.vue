<template>
  <span>
    <el-button type="text" @click="exportFile" v-if="type == 'text'">
      <img class="icon-img" src="@p/static/imgs/daochu.png" />
      导出
    </el-button>
    <el-button
      :type="type"
      icon="el-icon-document-delete"
      @click="exportFile"
      v-else
    >
      {{ txt }}
    </el-button>
  </span>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: "text",
    },
    txt: {
      type: String,
      default: "导出",
    },
    download: Function,
  },
  methods: {
    exportFile() {
      this.download();
    },
  },
};
</script>
