export default {
  data() {
    return {};
  },
  methods: {
    setCloumns(data, opts) {
      const columns = [];
      for (const h of data) {
        const column = {};
        const fieldid = h.fieldid || h[opts.value];
        if (fieldid == "csrq" || fieldid == "CSRQ") {
          column.label = h.title || h[opts.label];
          column.render = (h, row) => {
            return <span>{this.formate(row[fieldid])}</span>;
          };
        } else {
          column.label = h.title || h[opts.label];
          column.prop = h.field || h[opts.value];
        }

        if (h.children) {
          column.children = this.setCloumns(h.children);
        }
        columns.push(column);
      }
      return columns;
    },
    formate(value) {
      if (value) {
        return value.substr(0, 10);
      } else {
        return "暂无";
      }
    },
  },
};
