<template>
  <div v-if="showConfig">
    <el-divider content-position="left">配置</el-divider>

    <div class="config-item" v-if="showRequired">
      <el-checkbox v-model="form.required">必填</el-checkbox>
    </div>

    <div class="config-item" v-if="showOptions">
      <div class="item-title">选项</div>
      <div class="item-opt" v-for="(item, index) in form.options" :key="index">
        <span>{{ index + 1 }}. </span>
        <el-input size="mini" v-model="item.label" />
        <i class="el-icon-delete"></i>
      </div>
      <div class="item-bottom">
        <span @click="add(0)"><i class="el-icon-plus" /> 添加选项</span>
        <el-divider direction="vertical"></el-divider>
        <span @click="add(1)">添加其他项</span>
      </div>
    </div>

    <div class="config-item" v-if="showDateFormat">
      <div class="item-title">日期显示格式</div>
      <el-select size="mini" v-model="form.format">
        <el-option
          v-for="item in dataFormats"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>

    <div class="config-item" v-if="showLimit">
      <div class="item-title">数量</div>
      <div class="item-con">
        <el-input size="mini" maxlength="2" v-model.number="form.limit" />
      </div>
    </div>

    <div class="config-item" v-if="showAccept">
      <div class="item-title">格式</div>
      <div class="item-con">
        <el-select
          size="mini"
          multiple
          collapse-tags
          clearable
          v-model="form.accept"
          style="width: 100%"
        >
          <el-option
            v-for="item in fileTypes"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
    </div>

    <div class="config-item" v-if="showSize">
      <div class="item-title">大小</div>
      <div class="item-con">
        <el-input size="mini" maxlength="3" v-model.number="form.size">
          <template slot="append">MB</template>
        </el-input>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      dataFormats: [
        { label: "年-月", value: "yyyy-MM" },
        { label: "年-月-日", value: "yyyy-MM-dd" },
        { label: "年-月-日 时:分", value: "yyyy-MM-dd HH:mm" },
        { label: "年-月-日 时:分:秒", value: "yyyy-MM-dd HH:mm:ss" },
        { label: "月.日", value: "MM.dd" },
        { label: "时:分", value: "HH:mm" },
        { label: "时:分:秒", value: "HH:mm:ss" },
      ],
      fileTypes: [
        { label: ".doc", value: ".doc" },
        { label: ".docx", value: ".docx" },
        { label: ".pdf", value: ".pdf" },
        { label: ".png", value: ".png" },
        { label: ".jpg", value: ".jpg" },
        { label: ".jpeg", value: ".jpeg" },
        { label: ".avi", value: ".avi" },
        { label: ".wmv", value: ".wmv" },
        { label: ".mpeg", value: ".mpeg" },
        { label: ".mp4", value: ".mp4" },
        { label: ".rmvb", value: ".rmvb" },
        { label: ".mp3", value: ".mp3" },
        { label: ".wma", value: ".wma" },
      ],
    };
  },
  computed: {
    type() {
      return this.data.type || "input";
    },
    form() {
      return this.data.config || {};
    },
    showRequired() {
      return this.form.hasOwnProperty("required");
    },
    showOptions() {
      return this.form.hasOwnProperty("options");
    },
    showDateFormat() {
      return this.form.hasOwnProperty("format");
    },
    showLimit() {
      return this.form.hasOwnProperty("limit");
    },
    showSize() {
      return this.form.hasOwnProperty("size");
    },
    showAccept() {
      return this.form.hasOwnProperty("accept");
    },
    showConfig() {
      return (
        this.showRequired ||
        this.showOptions ||
        this.showDateFormat ||
        this.showLimit ||
        this.showSize ||
        this.showAccept
      );
    },
  },
  watch: {
    form: {
      handler() {
        this.$emit("change", this.form);
      },
      deep: true,
    },
  },
  methods: {
    add(type) {
      const obj =
        type == 0
          ? { label: "选项", value: this.form.options.length }
          : { label: "其他", value: 9 };
      this.form.options.push(obj);
    },
  },
};
</script>

<style lang="scss" scoped>
.config-item {
  padding: 6px 0;

  .item-title {
    font-family: PingFangSC-Regular;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    color: #2a2a2a;
    letter-spacing: 0;
    margin-bottom: 4px;
  }

  .item-opt {
    padding: 4px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;

    span {
      width: 20px;
      text-align: center;
    }

    i {
      padding: 6px;
      cursor: pointer;
    }
  }

  .item-bottom {
    font-family: PingFangSC-Regular;
    font-weight: 400;
    font-size: 12px;
    line-height: 20px;
    color: #04be95;
    letter-spacing: 0;

    span {
      cursor: pointer;
    }
  }

  .item-con {
    margin: 6px 0 0 0;
    width: 75%;
  }
}
</style>
