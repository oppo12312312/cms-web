<template>
  <div>
    <div @click="open">
      <el-input
        v-model="userName"
        placeholder="请选择人员"
        readonly
        clearable
      ></el-input>
    </div>
    <v-dialog
      title="选择人员"
      width="1100px"
      ref="dialog"
      confirmBtnTxt="确定"
      @handleClose="setUser"
    >
      <div class="user-selector-container">
        <div class="left">
          <v-form :fields="searchFields" :fieldsData="params">
            <el-col :span="4" class="txt-left">
              <el-button type="primary" @click="fecthData">查询</el-button>
            </el-col>
          </v-form>
          <basic-table
            ref="basicTable"
            :columns="columns"
            :call-server="callServer"
            :selectKey="selectKey"
            keyCode="userid"
            v-model="searchParams"
            @selectionChange="selectionChange"
          >
          </basic-table>
        </div>
        <div class="action">
          <el-button
            @click="add"
            type="primary"
            icon="el-icon-arrow-right"
            size="mini"
            >添加</el-button
          ><br />
          <el-button
            @click="del"
            type="primary"
            icon="el-icon-arrow-left"
            size="mini"
            >删除</el-button
          ><br />
          <el-button
            @click="clear"
            type="primary"
            icon="el-icon-error"
            size="mini"
            >清空</el-button
          ><br />
          <el-button
            @click="reSet"
            type="primary"
            icon="el-icon-refresh-right"
            size="mini"
            >重置</el-button
          >
        </div>
        <div class="right">
          <basic-table
            :columns="columns2"
            :props-data="selectRows"
            @selectionChange="selectionChange2"
          >
          </basic-table>
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script>
import basicTable from "_c/tables/";

export default {
  components: {
    basicTable,
  },
  props: {
    value: String,
    userxms: String,
    queryDeptlist: Function,
    queryUserlist: Function,
  },
  data() {
    return {
      userId: "",
      deptList: [],
      params: {},
      userName: "",
      columns: [
        { label: "姓名", prop: "truename" },
        { label: "学号", prop: "username" },
        { label: "性别", prop: "xb", width: "70px" },
        { label: "部门", prop: "deptname" },
      ],
      columns2: [
        { label: "姓名", prop: "truename" },
        { label: "学号", prop: "username" },
      ],
      selectRows: [],
      multipleSelection: [],
      multipleSelection2: [],
      oData: [],
    };
  },
  computed: {
    selectKey() {
      return this.selectRows.map((s) => s.userid);
    },
    searchFields() {
      return [
        {
          label: "",
          placeholder: "请输入姓名",
          prop: "truename",
          type: "text",
          options: this.deptList,
          span: 8,
        },
        {
          label: "",
          placeholder: "请选择部门",
          prop: "deptid",
          type: "select",
          options: this.deptList,
          span: 12,
        },
      ];
    },
    searchParams() {
      const params = {};
      if (this.params.truename) params.truename = this.params.truename;
      if (this.params.deptid) params.deptids = [this.params.deptid];
      return params;
    },
  },
  created() {
    this.init();
    if (this.value) {
      if (
        this.userxms &&
        this.userxms.split(",").length == this.value.split(",").length
      ) {
        this.value.split(",").forEach((v, index) => {
          this.selectRows.push({
            userid: v,
            username: v,
            truename: this.userxms.split(",")[index],
          });
        });
        this.userName = this.selectRows.map((s) => s.truename).toString();
        this.oData = JSON.parse(JSON.stringify(this.selectRows));
      } else {
        this.value.split(",").forEach((v) => {
          this.queryUserlist({ userid: v }).then((res) => {
            if (res.data && res.data.length == 1) {
              this.selectRows.push(res.data[0]);
              this.userName = this.selectRows.map((s) => s.truename).toString();
              this.oData = JSON.parse(JSON.stringify(this.selectRows));
            }
          });
        });
      }
    }
  },
  methods: {
    async init() {
      const deptlist = await this.queryDeptlist({});
      this.deptList = deptlist.data.map((item) => {
        return { label: item.deptname, value: item.deptid };
      });
    },
    open() {
      this.$refs.dialog.dialogVisible = true;
    },
    callServer() {
      return this.queryUserlist;
    },
    fecthData() {
      this.$refs.basicTable.fecthData();
    },
    selectionChange(val) {
      this.multipleSelection = val;
    },
    selectionChange2(val) {
      this.multipleSelection2 = val;
    },
    add() {
      this.selectRows = this.selectRows.concat(
        this.multipleSelection.filter(
          (m) => this.selectRows.findIndex((s) => s.userid == m.userid) == -1
        )
      );
    },
    del() {
      this.selectRows = this.selectRows.filter(
        (s) =>
          this.multipleSelection2.findIndex((m) => s.userid == m.userid) == -1
      );
      this.setKeys();
    },
    setKeys() {
      this.$nextTick(() => {
        this.$refs.basicTable.setKeys();
      });
    },
    clear() {
      this.selectRows = [];
      this.setKeys();
    },
    setUser() {
      this.$emit("change", this.selectRows.map((s) => s.userid).toString());
      this.userName = this.selectRows.map((s) => s.truename).toString();
      const hash = {};
      const dept = this.selectRows.reduce((accum, item) => {
        hash[item.deptid] ? "" : (hash[item.deptid] = true && accum.push(item));
        return accum;
      }, []);
      this.$emit("setValue", {
        userxms: this.selectRows.map((s) => s.truename).toString(),
        userids: this.selectRows.map((s) => s.userid).toString(),
        // deptids: dept.map(d => d.deptid),
        // deptnames: dept.map(d => d.deptname).toString()
      });
      this.$refs.dialog.close();
    },
    reSet() {
      this.selectRows = JSON.parse(JSON.stringify(this.oData));
    },
  },
};
</script>

<style lang="scss" scoped>
.user-selector-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .left {
    width: 60%;
    border: #dddddd 1px solid;
    border-radius: 8px;
    padding: 8px;
    height: 655px;
  }
  .action {
    text-align: center;
    padding: 8px;
    .el-button {
      margin-bottom: 8px;
    }
  }
  .right {
    width: 40%;
    height: 655px;
    border: #dddddd 1px solid;
    border-radius: 8px;
    padding: 8px;
    overflow-x: hidden;
    overflow-y: auto;
  }
}
</style>
