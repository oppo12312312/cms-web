<template>
  <v-page>
    <el-card shadow="never">
      <div slot="header" class="clearfix">申请申请</div>
      <div>
        <save-leave-form
          ref="saveItemForm"
          :patch-data="currentItem"
        ></save-leave-form>
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
import saveLeaveForm from "../components/saveLeaveForm";
import { saveOrUpdate } from "@/api/leave";

export default {
  components: {
    saveLeaveForm,
  },
  data() {
    return {
      currentItem: {},
      posting: false,
    };
  },
  methods: {
    onSubmit() {
      const me = this;
      this.$refs.saveItemForm.validate((data) => {
        const oData = {};
        for (const key in data) {
          if (key != "files" && data[key] != "null") {
            oData[key] = data[key];
          }
        }
        this.posting = true;
        if (this.$refs.saveItemForm.status) {
          saveOrUpdate(data.files, oData)
            .then(() => {
              me.toast("修改成功", "success");
              me.$router.push({
                name: "leaveStuList",
              });
            })
            .catch((err) => {
              this.posting = false;
            });
        } else {
          saveOrUpdate(data.files, oData)
            .then(() => {
              me.toast("申请成功", "success");
              me.$router.push({
                name: "leaveStuList",
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
