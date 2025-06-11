<template>
  <el-card class="box-card" shadow="never">
    <save-fdy-form
      ref="saveItemForm"
      :patch-data="currentItem"
      :dept-data="deptOptions"
    ></save-fdy-form>
    <el-row class="fn-ac">
      <el-button type="primary" @click="saveItem">提交</el-button>
      <el-button @click="toBack">返回</el-button>
    </el-row>
  </el-card>
</template>
<script>
import { fdyInfo, fdyUpdateInfo } from "@/api/xgAssFdy";
import { getXueyuanOptions } from "@/filters/options";
import saveFdyForm from "_c/forms/saveFdyForm";

export default {
  components: {
    saveFdyForm,
  },
  data() {
    return {
      deptOptions: [],
      currentItem: {},
    };
  },
  created() {
    getXueyuanOptions().then((data) => {
      this.deptOptions = data;
    });
    this.init();
  },
  methods: {
    init() {
      fdyInfo().then((data) => {
        this.currentItem = data.data;
      });
    },
    saveItem() {
      const me = this;
      this.$refs.saveItemForm.validate((data) => {
        fdyUpdateInfo(data)
          .then(() => {
            me.toast("修改成功", "success");
          })
          .catch((err) => {});
      });
    },
    toBack() {
      this.$router.push({
        name: "business",
      });
    },
  },
};
</script>
<style lang="scss"></style>
