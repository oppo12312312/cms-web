<script>
export default {
  name: "vRender",
  functional: true,
  props: {
    scope: Object,
    render: Function,
    extra: Object,
  },
  render: (h, ctx) => {
    return ctx.props.render
      ? ctx.props.render(h, ctx.props.scope, ctx.props.extra)
      : "";
  },
};
</script>
