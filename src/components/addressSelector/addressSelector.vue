<template>
  <el-cascader
    :show-all-levels="showAll"
    v-model="operatingArea"
    :options="operatingAreaOptions"
    @change="handleChange"
    :props="{
      multiple: multiple,
      value: 'value',
      label: 'label',
      children: 'children',
      emitPath: false,
    }"
    clearable
    collapse-tags
    placeholder="请选择省份"
  ></el-cascader>
</template>

<script>
import {
  regionData,
  provinceAndCityData,
  CodeToText,
} from "element-china-area-data";
export default {
  model: {
    prop: "areaCode",
    event: "handleChange",
  },
  props: {
    showAll: {
      type: Boolean,
      default: false,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    initCode: String,
    level: {
      type: Number,
      default: 3,
    },
  },
  data() {
    return {
      operatingArea: [], //选择的地区
      operatingAreaTrue: [], //根据选择的地区返回的你想要的数据列表
      operatingAreaOptions: [],
    };
  },
  created() {
    this.setOptions();
  },
  methods: {
    setOptions() {
      if (this.initCode) {
        this.operatingArea = this.initCode;
      }
      switch (this.level) {
        case 1:
          const opts = provinceAndCityData;
          for (const o of opts) {
            delete o.children;
          }
          this.operatingAreaOptions = opts;
          break;
        case 2:
          this.operatingAreaOptions = provinceAndCityData;
          break;
        default:
          this.operatingAreaOptions = regionData;
          break;
      }
    },
    handleChange() {
      this.$emit("handleChange", this.operatingArea);
    },
  },
};
</script>
