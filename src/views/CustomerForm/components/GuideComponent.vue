<script>
//指引组件
// 传入组件类型  生成指定的组件
export default {
  props: {
    value: {
      type: Object,
      default: () => ({ topictype: "input", config: {} }),
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  render(h, cxt) {
    try {
      return h(require(`./${this.value.topictype}.vue`).default, {
        props: {
          value: this.value,
          disabled: this.disabled,
        },
      });
    } catch (error) {
      return h(require(`./input.vue`).default, {
        props: {
          value: this.value,
          disabled: this.disabled,
        },
      });
    }
  },
};
</script>
