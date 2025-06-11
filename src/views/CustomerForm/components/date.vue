<script>
export default {
  props: {
    value: {
      type: Object,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  render(h) {
    switch (this.value.config.format) {
      case "yyyy-MM":
        return (
          <el-date-picker
            v-model={this.value.config.value}
            type="month"
            readonly={this.disabled}
          />
        );
        break;

      case "HH:mm":
      case "HH:mm:ss":
        return (
          <el-time-picker
            v-model={this.value.config.value}
            format={this.value.config.format}
            value-format={this.value.config.format}
            readonly={this.disabled}
          />
        );
        break;

      case "yyyy-MM-dd HH:mm":
      case "yyyy-MM-dd HH:mm:ss":
        return (
          <el-date-picker
            v-model={this.value.config.value}
            format={this.value.config.format}
            value-format={this.value.config.format}
            readonly={this.disabled}
            type="datetime"
          />
        );
        break;

      default:
        return (
          <el-date-picker
            v-model={this.value.config.value}
            format={this.value.config.format}
            value-format={this.value.config.format}
            readonly={this.disabled}
            type="date"
          />
        );
        break;
    }
  },
};
</script>
