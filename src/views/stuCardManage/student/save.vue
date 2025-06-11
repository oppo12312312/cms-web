<template>
  <v-page>
    <el-card shadow="never">
      <div slot="header" class="clearfix">学生证补办申请</div>
      <div>
        <save-card-form
          ref="saveItemForm"
          :userid="userInfo.userId"
          :patch-data="currentItem"
        ></save-card-form>
        <div class="card-footer txt-center">
          <el-button @click="$router.go(-1)">取消</el-button>

          <el-button type="primary" :loading="posting" @click="onSubmit"
            >提交</el-button
          >
        </div>
      </div>
    </el-card>
  </v-page>
</template>

<script>
import saveCardForm from "../components/saveCardForm";
import { stdApproveAddOrUpdate } from "@/api/studentCard";

export default {
  components: {
    saveCardForm,
  },
  data() {
    return {
      posting: false,
      currentItem: {},
    };
  },
  methods: {
    onSubmit() {
      const me = this;
      this.$refs.saveItemForm.validate((data) => {
        this.posting = true;
        if (this.$refs.saveItemForm.status) {
          stdApproveAddOrUpdate(data)
            .then(() => {
              me.toast("修改成功", "success");
              me.$router.push({
                name: "stuCardbbList",
              });
            })
            .catch((err) => {
              this.posting = false;
            });
        } else {
          stdApproveAddOrUpdate(data)
            .then(() => {
              me.toast("申请成功", "success");
              me.$router.push({
                name: "stuCardbbList",
              });
            })
            .catch((err) => {
              this.posting = false;
            });
        }
      });
    },
  },
};
</script>
