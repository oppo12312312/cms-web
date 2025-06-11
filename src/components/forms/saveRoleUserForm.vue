<template>
  <basic-table
    v-model="tableParams"
    @selectionChange="selectionChange"
    ref="basicTable"
    :call-server="callServer"
    :columns="columns"
  >
    <div slot="tableHeader" class="txt-right">
      <v-form :fields="fields" :fieldsData="tableParams">
        <el-col :span="4" class="txt-left">
          <el-button type="primary" @click="fecthData()">查询</el-button>
        </el-col>
      </v-form>
    </div>
  </basic-table>
</template>
<script>
import { unallocatedUserList } from "@/api/roleManage";
import basicTable from "_c/tables";
import { queryDeptlist } from "#/api/public";

export default {
  components: {
    basicTable,
  },
  props: {
    patchData: Object,
  },
  data() {
    const roleid = this.patchData.roleid;
    return {
      tableParams: {
        roleid: roleid,
        truename: "",
        username: "",
        deptid: "",
        usertype: "",
      },
      columns: [
        {
          label: "用户名",
          prop: "username",
        },
        {
          label: "姓名",
          prop: "truename",
        },
        {
          label: "联系方式",
          prop: "tel",
        },
        {
          label: "所在部门",
          prop: "deptName",
        },
      ],
      multipleSelection: [],
      deptsListOptions: [],
    };
  },
  created() {
    queryDeptlist({ level: 3, pageSize: 1000, pageIndex: 1 }).then((res) => {
      this.deptsListOptions = res.data.map((d) => ({
        label: d.deptName,
        value: d.deptId,
      }));
    });
  },
  computed: {
    fields() {
      return [
        {
          label: "",
          prop: "truename",
          span: 6,
          type: "text",
          placeholder: "请输入姓名",
        },
        {
          label: "",
          prop: "username",
          span: 6,
          type: "text",
          placeholder: "请输入用户名",
        },
        {
          label: "",
          prop: "deptid",
          span: 8,
          type: "select",
          placeholder: "请选择部门",
          options: this.deptsListOptions,
        },
      ];
    },
  },
  methods: {
    callServer() {
      return unallocatedUserList;
    },
    selectionChange(val) {
      this.multipleSelection = val;
    },
    fecthData(keep) {
      this.$refs.basicTable.fecthData();
    },
  },
};
</script>
<style lang="scss"></style>
