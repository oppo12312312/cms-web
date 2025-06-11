<template>
  <el-date-picker
    v-model="value"
    :value-format="cFormate"
    :editable="false"
    :type="type"
    :placeholder="placeholder"
    start-placeholder="开始日期"
    end-placeholder="结束日期"
    @change="dateChange"
  ></el-date-picker>
</template>

<script>
export default {
  model: {
    prop: "value",
    event: "dateChange",
  },
  props: {
    value: String,
    formate: {
      type: String,
      default: "yyyy-MM-dd HH:mm:ss",
    },
    placeholder: {
      type: String,
      default: "选择日期",
    },
    type: {
      type: String,
      default: "date",
    },
    formateType: String,
  },
  data() {
    return {};
  },
  created() {
    if (this.value && this.value.indexOf("/") > -1) {
      this.value = this.value.split("/").join("-");
    }
  },
  computed: {
    cFormate: function () {
      if (this.formateType) {
        return this.formateType;
      }
      switch (this.type) {
        case "year":
          return "yyyy";
        case "month":
          return "yyyy-MM";
        default:
          return "yyyy-MM-dd HH:mm:ss";
      }
    },
  },
  methods: {
    dateChange() {
      this.$emit("dateChange", this.value);
    },
  },
};
</script>
<style lang="scss"></style>
