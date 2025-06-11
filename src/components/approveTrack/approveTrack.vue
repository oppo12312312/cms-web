<template>
  <div class="approve-track-wrap">
    <el-card v-if="trackList.length" class="box-card fn-mt15" shadow="never">
      <div slot="header" class="clearfix">
        <span class="tle">审批轨迹</span>
      </div>
      <div>
        <el-steps :active="currentIndex" align-center>
          <el-step
            v-for="tr in trackList"
            :key="tr.stepid"
            :title="tr.stepname"
            description=""
            :class="getClass(tr.stepStatus)"
          >
          </el-step>
        </el-steps>
      </div>
    </el-card>
    <div
      v-for="(tr, index) in processData"
      :key="tr.stepid"
      :title="tr.stepname"
      style="border: 1px solid #ebeef5; overflow: hidden"
    >
      <p
        style="
          border-bottom: 1px solid #ebeef5;
          margin-top: -1px;
          padding: 10px 15px;
        "
      >
        {{ tr.stepname }}
        <el-tag v-if="index > 0" :type="getStepType(tr.status, index)">{{
          getStepTxt(tr.status, index)
        }}</el-tag>
      </p>
      <el-form class="no-bottom" style="padding: 15px">
        <el-col :span="12">
          <el-form-item label="操作人：">{{ tr.userxm }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="操作时间：">{{ tr.createtime }}</el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="操作意见：" v-if="tr.spyj">{{
            tr.spyj
          }}</el-form-item>
        </el-col>
      </el-form>
    </div>
  </div>
</template>

<script>
import { selectApprovalTrack } from "@/api/process";

export default {
  props: {
    defid: String,
    businessid: String,
  },
  data() {
    return {
      trackList: [],
      currentIndex: "1",
      processData: [],
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      selectApprovalTrack({
        defid: this.defid,
        businessid: this.businessid,
      }).then((data) => {
        this.trackList = data.data.steps;
        this.processData = data.data.processData;
        let isClosed = true;
        for (let i = 0; i < data.data.steps.length; i++) {
          if (data.data.steps[i].stepStatus == 100) {
            this.currentIndex = i;
            isClosed = false;
          }
        }
        if (isClosed) {
          this.currentIndex = this.trackList.length;
          this.trackList.push({
            stepStatus: 100,
            stepname: "已结束",
          });
        }
        this.$EventBus.$emit("currentApprove", {
          currentIndex: this.currentIndex,
          steps: this.trackList,
        });
      });
    },
    getClass(status) {
      if (status) {
        switch (status) {
          case 1:
            return "success";
          case 2:
            return "danger";
          case 3:
            return "success";
          case 9:
            return "danger";
          default:
            return "primary";
        }
      } else {
        return "default";
      }
    },
    getStepType(status, index) {
      if (index > 0) {
        switch (status) {
          case 1:
            return "success";
            break;
          case 2:
            return "danger";
            break;
          case 3:
            return "success";
            break;
          case 9:
            return "danger";
            break;
          default:
            return "primary";
        }
      }
    },
    getStepTxt(status, index) {
      if (index > 0) {
        switch (status) {
          case 1:
            return "审核通过";
          case 2:
            return "审核未通过";
          case 3:
            return "审批结束";
          case 9:
            return "打回";
            break;
          default:
            return "审核中";
        }
      }
    },
    getSteps() {
      return {
        currentIndex: this.currentIndex,
        steps: this.trackList,
      };
    },
  },
};
</script>

<style lang="scss">
.approve-track-wrap {
  .el-step__title {
    line-height: 24px;
  }
  .el-step {
    &.default {
      .el-step__head {
        color: #c0c4cc;
        border-color: #c0c4cc;
      }
      .el-step__title {
        color: #c0c4cc;
      }
    }
    &.danger {
      .el-step__head {
        color: #ff4949;
        border-color: #ff4949;
      }
      .el-step__title {
        color: #ff4949;
      }
    }
  }
}
</style>
