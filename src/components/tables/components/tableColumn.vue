<template>
  <el-table-column
    :prop="column.prop"
    :label="column.label"
    :sortable="column.sortable || false"
    :formatter="column.formatter || null"
    v-if="!column.isHide"
    :width="column.width || null"
    :min-width="column.minWidth || setMinWidth(column.prop)"
    :fixed="column.fixed || null"
    :align="column.align"
    show-overflow-tooltip
  >
    <template v-if="column.children">
      <table-column
        v-for="(item, index) in column.children"
        :key="index"
        :column="item"
      ></table-column>
    </template>
    <template slot-scope="scope">
      <v-render
        v-if="column.render"
        :scope="scope.row"
        :render="column.render"
      ></v-render>
      <span v-else>{{
        scope.row[column.prop] || scope.row[column.prop] == 0
          ? scope.row[column.prop]
          : column.empty || column.empty == 0
          ? column.empty
          : ""
      }}</span>
    </template>
    <template slot="header">
      <v-render v-if="column.renderHead" :render="column.renderHead"></v-render>
      <span v-else>{{ column.label }}</span>
    </template>
  </el-table-column>
</template>

<script>
export default {
  name: "tableColumn",
  props: {
    column: {
      type: Object,
    },
    emptyTxt: String,
  },
  methods: {
    setMinWidth(prop) {
      if (prop == "xh") {
        return "130px";
      } else if (prop == "xm") {
        return "80px";
      } else if (prop == "xy") {
        return "160px";
      } else if (prop == "bjmc") {
        return "200px";
      } else if (prop == "zy") {
        return "160px";
      } else if (prop == "deptname") {
        return "160px";
      }
    },
  },
};
</script>
