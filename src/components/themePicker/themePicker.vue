<template>
  <div @click="drawer = true">
    <i class="el-icon-s-opportunity"></i>
    <el-drawer
      title="主题配置"
      ref="theme"
      :visible.sync="drawer"
      direction="rtl"
      :before-close="handleClose"
      :append-to-body="true"
      :destroy-on-close="true"
    >
      <el-form ref="form" :model="form" label-width="60px">
        <el-form-item label="主题">
          <el-radio-group v-model="form.theme" size="medium">
            <el-radio-button
              v-for="(theme, index) in themes"
              :key="index"
              :label="theme.value"
              >{{ theme.label }}</el-radio-button
            >
          </el-radio-group>
        </el-form-item>
        <!-- <el-form-item label="字号">
          <el-radio-group v-model="form.size" size="medium">
            <el-radio-button
              v-for="(size, index) in sizes"
              :key="index"
              :label="size.label"
            ></el-radio-button>
          </el-radio-group>
        </el-form-item> -->
        <el-form-item label="">
          <el-button type="primary" @click="onSubmit">保存</el-button>
          <!-- <el-button @click="reset">恢复默认</el-button> -->
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>

<script>
import { getStorage } from "@/utils/localStore";
export default {
  data() {
    const theme = getStorage("theme") || "default";
    return {
      form: {
        theme: theme,
        size: "",
      },
      themes: [
        {
          label: "默认",
          value: "default",
        },
        {
          label: "黑色",
          value: "black",
        },
      ],
      // sizes: [
      //   {
      //     label: "小",
      //   },
      //   {
      //     label: "中",
      //   },
      //   {
      //     label: "大",
      //   },
      // ],
      drawer: false,
    };
  },
  methods: {
    handleClose(done) {
      this.setTheme(this.form.theme);
      done();
    },
    onSubmit() {
      this.$refs.theme.closeDrawer();
    },
  },
};
</script>
