<template>
  <el-card shadow="never">
    <div slot="header" class="clearfix">申请须知</div>
    <div>
      <div style="min-height: 400px" v-html="xss(remark)"></div>
      <div class="card-footer txt-right">
        <el-button @click="$router.go(-1)">取消</el-button>

        <el-button
          type="primary"
          @click="
            $router.push({
              name: routename,
            })
          "
          >我知道了</el-button
        >
      </div>
    </div>
  </el-card>
</template>

<script>
import { getModule } from "@/api/xgModule";

export default {
  props: {
    defid: String,
    module: String,
    routename: String,
  },
  data() {
    return {
      remark: "",
    };
  },
  created() {
    getModule(this.module).then((data) => {
      this.remark = data.data.remark;
    });
  },
  methods: {},
};
</script>
