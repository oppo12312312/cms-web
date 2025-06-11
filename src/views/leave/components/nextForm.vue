<template>
  <el-radio-group v-model="radio">
    <el-radio
      style="display: block; margin-bottom: 10px"
      v-for="(st, index) in steps"
      :key="st.stepid"
      :label="st.stepid"
      >{{ st.stepname }}</el-radio
    >
  </el-radio-group>
</template>

<script>
export default {
  props: {
    propsData: {},
  },
  data() {
    return {
      steps: [],
      preSteps: [],
      nextSteps: [],
      radio: "",
    };
  },
  created() {
    for (let i = 0; i < this.propsData.steps.length; i++) {
      if (i < this.propsData.currentIndex + 1) {
        this.preSteps.push(this.propsData.steps[i]);
      } else if (i > this.propsData.currentIndex + 1) {
        this.nextSteps.push(this.propsData.steps[i]);
      }
    }
    if (this.propsData.status == "prev") {
      this.steps = this.preSteps;
      this.radio = this.preSteps[0].stepid;
    } else if (this.propsData.status == "next") {
      this.steps = this.nextSteps;
      this.radio = this.nextSteps[0].stepid;
    } else {
      this.steps = this.propsData.steps;
      this.radio = this.steps[0].stepid;
    }
  },
};
</script>

<style lang="scss"></style>
