export default {
  data() {
    return {
      showFields: [],
    };
  },
  computed: {},
  methods: {
    setCols(cols) {
      if (this.showFields.length) {
        for (let i = 0; i < cols.length; i++) {
          if (cols[i].prop || cols[i].field) {
            const field = cols[i].prop || cols[i].field;
            cols[i].isHide = this.showFields.indexOf(field) > -1 ? false : true;
          }
        }
      }
      return cols;
    },
    colsChange(showFields) {
      this.showFields = showFields;
    },
    exportsExecutes(fields, filename, fun) {
      const headers = [];
      const columns = [];
      fields.forEach((item, i) => {
        if (item.column && item.column != "") {
          columns.push(item.column);
          headers.push(item.header);
        }
      });
      return fun(
        {
          headers: headers,
          columns: columns,
        },
        filename
      );
    },
    export(tableParams, fun) {
      const params = {};
      for (const p in tableParams) {
        params[p] = tableParams[p] || "";
      }
      const headers = [];
      const columns = [];
      this.columns.forEach((item, i) => {
        if (item.prop && item.prop != "") {
          columns.push(item.prop);
          headers.push(item.label);
        }
      });
      params.headers = headers;
      params.columns = columns;
      fun(params);
    },
  },
};
